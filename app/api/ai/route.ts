import { diagnosticarComClaude, playbookComClaude } from '@/lib/claude-playbook'
import { gerarPlaybookLocal, gerarDiagnosticoLocal } from '@/lib/playbook-local'
import { gerarMensagemComArsenal } from '@/lib/claude-copy'
import { NextRequest, NextResponse } from 'next/server'
import { gerarAbordagem, calcularScoreIA, chat, gerarFollowup, gerarPlanoHoje, diagnosticarNegocio, gerarScriptCompleto, classificarTermometro, analisarConversa, type MensagemConversa } from '@/lib/gemini'
import { melhorHorarioPara } from '@/lib/horarios'
import { analisarSiteLead } from '@/lib/site-analyzer'
import { analisarAvaliacoesGMaps } from '@/lib/reviews-analyzer'
import { atualizarMensagem, getClient } from '@/lib/db'
import { escolherScriptAbordagem, pickDiagnostico } from '@/lib/mensagens'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'cole_sua_chave_aqui') {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 400 })
  }

  try {
    const db = getClient()

    /**
     * Gera a Msg 1 do lead — CLAUDE + ARSENAL (13/07/2026).
     *
     * Antes rodava no Gemini 2.5-flash com o SYSTEM_PROMPT de abril, e:
     *   · caía com 503 "high demand" (o erro que o Eduardo viu no painel);
     *   · não sabia NADA do que o scraper v2 descobre. Gerava "você tem sistema
     *     ou organiza na mão?" pra uma barbearia que o scraper JÁ SABIA que
     *     usa Trinks. Perguntar o que você já sabe é o oposto de personalizar.
     *
     * Agora usa o ARSENAL_COPY (7 frentes de pesquisa) + o sistema detectado +
     * o nível de consciência. Cai de volta no Gemini só se a chave do Claude
     * não estiver configurada.
     */
    if (action === 'abordagem') {
      const { lead, force } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      // busca o lead COMPLETO no banco — o payload do painel pode não trazer
      // sistema_detectado / nivel_consciencia, que são o que decide a mensagem
      let completo = lead
      if (lead.id) {
        const r = await db.execute({ sql: `SELECT * FROM leads WHERE id = ?`, args: [lead.id] })
        if (r.rows[0]) completo = { ...lead, ...(r.rows[0] as any) }
      }

      // LOCAL por padrão (custo zero): a msg 1 do playbook já é escrita à mão
      // por nicho × situação. force=true chama o Claude.
      if (!force) {
        const pb = gerarPlaybookLocal(completo)
        if (lead.id) await atualizarMensagem(lead.id, pb.msg1)
        return NextResponse.json({
          mensagem: pb.msg1,
          argumento: gerarDiagnosticoLocal(completo).arma_certa,
          diagnostico: completo.sistema_detectado
            ? `Já usa ${completo.sistema_detectado} — a dor dele é o SISTEMA (trava/desloga), não a agenda.`
            : `Nível: ${completo.nivel_consciencia ?? 'desconhecido'}`,
          modelo: pb.modelo,
          custo_usd: 0,
        })
      }

      if (process.env.ANTHROPIC_API_KEY) {
        const g = await gerarMensagemComArsenal(completo)
        if (lead.id && g.mensagem) await atualizarMensagem(lead.id, g.mensagem)
        return NextResponse.json({
          mensagem: g.mensagem,
          argumento: g.angulo,
          diagnostico: completo.sistema_detectado
            ? `Já usa ${completo.sistema_detectado} — a dor dele é o SISTEMA (trava/desloga), não a agenda.`
            : `Nível: ${completo.nivel_consciencia ?? 'desconhecido'}`,
          modelo: g.modelo,
          custo_usd: Number(g.custoUSD.toFixed(4)),
        })
      }

      // fallback: sem chave do Claude, usa o gerador antigo (Gemini)
      const resposta = await gerarAbordagem(completo)
      if (lead.id && resposta.mensagem) await atualizarMensagem(lead.id, resposta.mensagem)
      return NextResponse.json(resposta)
    }

    // Análise automática do site do lead
    if (action === 'analisar-site') {
      const { siteUrl, nome, leadId } = body
      if (!siteUrl || !nome) return NextResponse.json({ error: 'siteUrl e nome obrigatórios' }, { status: 400 })

      const analise = await analisarSiteLead(siteUrl, nome)

      if (leadId) {
        const notas = `[Análise do site — ${new Date().toLocaleDateString('pt-BR')}]\nNota: ${analise.nota}/10\n${analise.pontos_fracos}\nArgumento: ${analise.argumento}`
        await db.execute({
          sql: `UPDATE leads SET notas = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
          args: [notas, leadId],
        })
      }

      return NextResponse.json(analise)
    }

    // Score inteligente via IA
    if (action === 'score') {
      const { lead } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      const resultado = await calcularScoreIA(lead)

      if (lead.id) {
        await db.execute({
          sql: `UPDATE leads SET score = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
          args: [resultado.score, lead.id],
        })
      }

      return NextResponse.json(resultado)
    }

    // Gera follow-up personalizado
    if (action === 'followup') {
      const { lead } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      const resultado = await gerarFollowup(lead)

      if (lead.id) {
        const hoje = new Date()
        hoje.setDate(hoje.getDate() + resultado.dias)
        const dataFollowup = hoje.toISOString().split('T')[0]

        await db.execute({
          sql: `UPDATE leads SET mensagem = ?, proximo_followup = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
          args: [resultado.mensagem, dataFollowup, lead.id],
        })
      }

      return NextResponse.json(resultado)
    }

    // Análise de avaliações do Google Maps
    if (action === 'avaliar-reviews') {
      const { mapsUrl, nome, leadId } = body
      if (!mapsUrl || !nome) return NextResponse.json({ error: 'mapsUrl e nome obrigatórios' }, { status: 400 })

      const analise = await analisarAvaliacoesGMaps(mapsUrl, nome)

      if (leadId && analise.oportunidade && analise.oportunidade !== 'Visitar o perfil do Google e ler as avaliações') {
        const nota = `[Avaliações Google — ${new Date().toLocaleDateString('pt-BR')}]\nDor: ${analise.dor_principal}\nElogio: ${analise.elogio_principal}\nOportunidade: ${analise.oportunidade}`
        await db.execute({
          sql: `UPDATE leads SET notas = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
          args: [nota, leadId],
        })
      }

      return NextResponse.json(analise)
    }

    // Diagnóstico do negócio — LOCAL por padrão (custo zero).
    // A API só entra se pedirem force=true explicitamente no painel.
    if (action === 'diagnostico') {
      const { lead, force } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      if (!force) {
        const rl = lead.id
          ? await db.execute({ sql: `SELECT * FROM leads WHERE id = ?`, args: [lead.id] })
          : null
        const completo = { ...lead, ...((rl?.rows[0] as any) ?? {}) }
        const d = gerarDiagnosticoLocal(completo)

        if (lead.id) {
          const notas = [
            `[Diagnóstico — local, sem API]`,
            `Dor: ${d.dor_central}`,
            `Arma certa: ${d.arma_certa}`,
            `NÃO oferecer: ${d.o_que_nao_oferecer}`,
          ].join('\n')
          await db.execute({
            sql: `UPDATE leads SET notas = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
            args: [notas, lead.id],
          })
        }

        return NextResponse.json({
          dor_central: d.dor_central,
          custo_da_dor: d.custo_da_dor,
          produto_ideal: d.arma_certa,
          o_que_nao_oferecer: d.o_que_nao_oferecer,
          mensagem_impacto: d.mensagem_impacto,
          modelo: d.modelo,
          custo_usd: 0,
        })
      }

      if (process.env.ANTHROPIC_API_KEY && lead.id) {
        const rl = await db.execute({ sql: `SELECT * FROM leads WHERE id = ?`, args: [lead.id] })
        const completo = { ...lead, ...((rl.rows[0] as any) ?? {}) }

        const d = await diagnosticarComClaude(completo)

        const notas = [
          `[Diagnóstico — ${new Date().toLocaleDateString('pt-BR')}]`,
          `Dor: ${d.dor_central}`,
          `Custo: ${d.custo_da_dor}`,
          `Arma certa: ${d.arma_certa}`,
          `NÃO oferecer: ${d.o_que_nao_oferecer}`,
        ].join('\n')

        await db.execute({
          sql: `UPDATE leads SET notas = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
          args: [notas, lead.id],
        })

        return NextResponse.json({
          dor_central: d.dor_central,
          custo_da_dor: d.custo_da_dor,
          produto_ideal: d.arma_certa,
          o_que_nao_oferecer: d.o_que_nao_oferecer,
          mensagem_impacto: d.mensagem_impacto,
          modelo: d.modelo,
          custo_usd: Number(d.custoUSD.toFixed(4)),
        })
      }

      // fallback Gemini
      const resultado = await diagnosticarNegocio(lead)
      if (lead.id) {
        const notas = `[Diagnóstico — ${new Date().toLocaleDateString('pt-BR')}]\nDor: ${resultado.dor_central}\nCusto: ${resultado.custo_da_dor}\nProduto ideal: ${resultado.produto_ideal}`
        await db.execute({
          sql: `UPDATE leads SET mensagem = ?, notas = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
          args: [resultado.mensagem_impacto, notas, lead.id],
        })
      }
      return NextResponse.json(resultado)
    }

    // Plano de prospecção para hoje
    if (action === 'prospectar-hoje') {
      const { leads: leadsParam } = body
      if (!leadsParam || !Array.isArray(leadsParam)) {
        return NextResponse.json({ error: 'leads obrigatório (array)' }, { status: 400 })
      }
      const plano = await gerarPlanoHoje(leadsParam)
      return NextResponse.json({ plano })
    }

    // Script completo de vendas — playbook por lead (cacheado no banco)
    if (action === 'script_completo') {
      const { lead, force } = body
      if (!lead?.id) return NextResponse.json({ error: 'lead (com id) obrigatório' }, { status: 400 })

      // Se não for refresh forçado, tenta carregar do cache
      if (!force) {
        const cached = await db.execute({
          sql: `SELECT script_json FROM leads WHERE id = ?`,
          args: [lead.id],
        })
        const raw = cached.rows[0]?.script_json as string | undefined
        if (raw) {
          try { return NextResponse.json({ script: JSON.parse(raw), cached: true }) }
          catch { /* fallthrough para regerar */ }
        }
      }

      // busca o lead COMPLETO (sistema_detectado / nivel_consciencia / notas)
      const rl = await db.execute({ sql: `SELECT * FROM leads WHERE id = ?`, args: [lead.id] })
      const completo = { ...lead, ...((rl.rows[0] as any) ?? {}) }

      // LOCAL por padrão — custo zero. A conversa muda por NICHO e por SITUAÇÃO,
      // não de lead pra lead: duas barbearias que já usam sistema recebem a mesma
      // abertura, só muda o nome. Não faz sentido pagar API por isso.
      //
      // force=true chama o Claude (arsenal + mapa de nicho) — usar só quando o
      // playbook local não servir pra aquele caso específico.
      const script = force
        ? process.env.ANTHROPIC_API_KEY
          ? await playbookComClaude(completo)
          : await gerarScriptCompleto(lead)
        : gerarPlaybookLocal(completo)

      await db.execute({
        sql: `UPDATE leads SET script_json = ?, script_gerado_em = datetime('now','localtime'), atualizado_em = datetime('now','localtime') WHERE id = ?`,
        args: [JSON.stringify(script), lead.id],
      })

      return NextResponse.json({ script, cached: false })
    }

    // Termômetro do lead — classifica quente/morno/frio + próxima ação
    if (action === 'termometro') {
      const { lead } = body
      if (!lead?.id) return NextResponse.json({ error: 'lead (com id) obrigatório' }, { status: 400 })

      const termo = await classificarTermometro(lead)
      await db.execute({
        sql: `UPDATE leads SET termometro = ?, termometro_acao = ?, termometro_atualizado_em = datetime('now','localtime') WHERE id = ?`,
        args: [termo.nivel, termo.acao_sugerida, lead.id],
      })

      return NextResponse.json(termo)
    }

    // Melhor horário de contato baseado na categoria (heurística local, sem IA)
    if (action === 'melhor_horario') {
      const { categoria, tipo } = body
      if (!categoria) return NextResponse.json({ error: 'categoria obrigatória' }, { status: 400 })
      return NextResponse.json(melhorHorarioPara(categoria, tipo))
    }

    // Gera abordagem usando arsenal pré-carregado (router por categoria + diagnóstico A/B/C determinístico)
    // POST { action: 'gerar_abordagem_arsenal', leadId }
    if (action === 'gerar_abordagem_arsenal') {
      const { leadId } = body
      if (!leadId) return NextResponse.json({ error: 'leadId obrigatório' }, { status: 400 })

      const r = await db.execute({ sql: `SELECT * FROM leads WHERE id = ?`, args: [leadId] })
      const lead = r.rows[0] as any
      if (!lead) return NextResponse.json({ error: 'lead não encontrado' }, { status: 404 })

      // Roteia oferta + escolhe variante de diagnóstico — tudo determinístico, sem LLM
      const { tipo, script } = escolherScriptAbordagem({
        nome:      lead.nome as string,
        categoria: (lead.categoria as string) ?? '',
      })
      const diag = pickDiagnostico(script, (lead.telefone as string) ?? lead.id.toString())

      // Persiste roteamento no lead — primeira vez fixa, próximas chamadas mantém
      // (assim as métricas de conversão por variante ficam estáveis pro mesmo lead)
      await db.execute({
        sql: `UPDATE leads
              SET tipo_oferta = COALESCE(tipo_oferta, ?),
                  variante_diagnostico = COALESCE(variante_diagnostico, ?),
                  atualizado_em = datetime('now','localtime')
              WHERE id = ?`,
        args: [tipo, diag.variante, leadId],
      })

      return NextResponse.json({
        tipo_oferta:  tipo,
        variante:     diag.variante,
        sequencia: {
          msg1_abertura:        script.abertura,
          msg2_diagnostico:     diag.texto,
          msg3a_pitch_so_ig:    script.pitch_se_so_ig,
          msg3b_pitch_tem_site: script.pitch_se_tem_site,
          msg4_fechamento:      script.fechamento,
          arma_call_alinhamento: script.call_alinhamento ?? null,
        },
      })
    }

    // Marca o disparo da abordagem (chamado quando o vendedor confirma envio da msg1)
    // POST { action: 'marcar_disparo', leadId }
    if (action === 'marcar_disparo') {
      const { leadId } = body
      if (!leadId) return NextResponse.json({ error: 'leadId obrigatório' }, { status: 400 })

      await db.execute({
        sql: `UPDATE leads
              SET disparado_em = COALESCE(disparado_em, datetime('now','localtime')),
                  status = CASE WHEN status = 'novo' THEN 'abordado' ELSE status END,
                  atualizado_em = datetime('now','localtime')
              WHERE id = ?`,
        args: [leadId],
      })
      return NextResponse.json({ ok: true })
    }

    // Aprovar ou rejeitar uma lição candidata
    // POST { action: 'decidir_licao', licaoId, decisao: 'aprovada'|'rejeitada' }
    if (action === 'decidir_licao') {
      const { licaoId, decisao } = body
      if (!licaoId)  return NextResponse.json({ error: 'licaoId obrigatório' }, { status: 400 })
      if (decisao !== 'aprovada' && decisao !== 'rejeitada') {
        return NextResponse.json({ error: 'decisao deve ser aprovada|rejeitada' }, { status: 400 })
      }

      await db.execute({
        sql: `UPDATE licoes
              SET status = ?, decidida_em = datetime('now','localtime'), decidida_por = 'eduardo'
              WHERE id = ?`,
        args: [decisao, licaoId],
      })
      return NextResponse.json({ ok: true })
    }

    // Analisa conversa terminada e extrai lições candidatas pra alimentar a máquina
    // POST { action: 'analisar_conversa', leadId, resultado: 'ganho'|'perdido'|'neutro', motivo_perdido? }
    if (action === 'analisar_conversa') {
      const { leadId, resultado, motivo_perdido } = body
      if (!leadId)    return NextResponse.json({ error: 'leadId obrigatório' }, { status: 400 })
      if (!resultado) return NextResponse.json({ error: 'resultado obrigatório (ganho|perdido|neutro)' }, { status: 400 })

      // Carrega lead + histórico de mensagens em paralelo
      const [leadRow, msgsRow] = await Promise.all([
        db.execute({ sql: `SELECT * FROM leads WHERE id = ?`, args: [leadId] }),
        db.execute({
          sql:  `SELECT direcao, texto, timestamp FROM mensagens_whatsapp
                 WHERE lead_id = ? ORDER BY timestamp ASC`,
          args: [leadId],
        }),
      ])

      const lead = leadRow.rows[0] as any
      if (!lead) return NextResponse.json({ error: 'lead não encontrado' }, { status: 404 })

      const historico: MensagemConversa[] = msgsRow.rows.map((r: any) => ({
        direcao:   r.direcao as 'in' | 'out',
        texto:     r.texto as string,
        timestamp: r.timestamp as string,
      }))

      if (historico.length === 0) {
        return NextResponse.json({ licoes: [], aviso: 'sem mensagens registradas para esse lead' })
      }

      const licoes = await analisarConversa({
        lead: {
          nome:                  lead.nome,
          categoria:             lead.categoria ?? '',
          tipo:                  lead.tipo,
          tipo_oferta:           lead.tipo_oferta,
          variante_diagnostico:  lead.variante_diagnostico,
        },
        historico,
        resultado,
        motivo_perdido,
      })

      // Persiste lições candidatas — todas começam com status='pendente' aguardando aprovação
      for (const l of licoes) {
        await db.execute({
          sql: `INSERT INTO licoes (lead_id, tipo_oferta, fase, titulo, observacao, evidencia, proposta, tipo, resultado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            leadId,
            lead.tipo_oferta ?? null,
            l.fase,
            l.titulo,
            l.observacao,
            l.evidencia,
            l.proposta,
            l.tipo,
            resultado,
          ],
        })
      }

      // Atualiza lead com o resultado consolidado
      await db.execute({
        sql: `UPDATE leads
              SET fechou = ?, motivo_perdido = ?, atualizado_em = datetime('now','localtime')
              WHERE id = ?`,
        args: [resultado === 'ganho' ? 1 : 0, motivo_perdido ?? null, leadId],
      })

      return NextResponse.json({ licoes, total: licoes.length })
    }

    // Chat livre com o agente
    if (action === 'chat') {
      const { historico = [], pergunta } = body
      if (!pergunta) return NextResponse.json({ error: 'pergunta obrigatória' }, { status: 400 })

      const resposta = await chat(historico, pergunta)
      return NextResponse.json({ resposta })
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
