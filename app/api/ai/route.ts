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

    // Gera abordagem personalizada para um lead
    if (action === 'abordagem') {
      const { lead } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      const resposta = await gerarAbordagem(lead)

      if (lead.id && resposta.mensagem) {
        await atualizarMensagem(lead.id, resposta.mensagem)
      }

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

    // Diagnóstico profundo do negócio
    if (action === 'diagnostico') {
      const { lead } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      const resultado = await diagnosticarNegocio(lead)

      // Salva mensagem de impacto e notas no banco
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

      const script = await gerarScriptCompleto(lead)
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
