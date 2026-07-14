/**
 * PLAYBOOK e DIAGNÓSTICO — Claude + Arsenal + Mapa de Nicho.
 *
 * Migra do Gemini (que caiu com 503 no painel) e do SYSTEM_PROMPT de abril.
 *
 * A diferença que importa: agora sabe a dor ESPECÍFICA do nicho e a função EXATA
 * que resolve. Uma lash designer não tem a dor de um barbeiro. Sem isso a IA fala
 * "sistema de gestão pra beleza" — que é o mesmo que não dizer nada.
 */

import Anthropic from '@anthropic-ai/sdk'
import { ARSENAL_COPY } from './copy-prompt'
import { contextoDoNicho } from './nichos'

let client: Anthropic | null = null
function getClaude(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY não configurada')
  if (!client) client = new Anthropic({ apiKey: key })
  return client
}

export type LeadInfo = {
  id?: number
  nome: string
  categoria: string
  telefone?: string | null
  nota?: number | null
  num_avaliacoes?: number | null
  instagram?: string | null
  instagram_bio?: string | null
  site_real?: string | null
  sistema_detectado?: string | null
  nivel_consciencia?: string | null
  notas?: string | null
}

function fichaDoLead(l: LeadInfo): string {
  const linhas = [
    `Negócio: ${l.nome}`,
    `Categoria: ${l.categoria}`,
    l.nota != null ? `Google: ${l.nota} (${l.num_avaliacoes ?? 0} avaliações) ⚠️ SINAL INTERNO — nunca escrever na mensagem` : 'Google: sem nota',
    `Site: ${l.site_real ?? 'não tem'}`,
    `Instagram: ${l.instagram ?? 'não encontrado'}`,
    l.instagram_bio ? `Bio: "${l.instagram_bio}"` : '',
    l.sistema_detectado
      ? `🔥 JÁ USA: ${l.sistema_detectado} — a dor dele é o SISTEMA (trava/desloga/suporte), não a agenda.`
      : `Nível: ${l.nivel_consciencia ?? 'desconhecido'}`,
    l.notas ? `Notas anteriores: ${l.notas}` : '',
    '',
    '⚠️ NÃO temos o nome da pessoa. NÃO cite endereço, quadra ou rua.',
  ].filter(Boolean)

  return linhas.join('\n')
}

/* ═══════════════════════════════════════════════════════════════
   DIAGNÓSTICO — o que dói NESSE negócio, e o que resolve
   ═══════════════════════════════════════════════════════════════ */

export type Diagnostico = {
  dor_central: string
  custo_da_dor: string
  arma_certa: string
  o_que_nao_oferecer: string
  mensagem_impacto: string
  modelo: string
  custoUSD: number
}

export async function diagnosticarComClaude(lead: LeadInfo): Promise<Diagnostico> {
  const claude = getClaude()

  const r = await claude.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 900,
    system: ARSENAL_COPY,
    messages: [
      {
        role: 'user',
        content: [
          '# DIAGNÓSTICO DO NEGÓCIO',
          '',
          fichaDoLead(lead),
          '',
          '─── O NICHO DELA ───',
          contextoDoNicho(lead.categoria, lead.nome),
          '',
          'Faça o diagnóstico. Responda em JSON puro, sem markdown:',
          '{',
          '  "dor_central": "a dor nº1 DESSE negócio — específica, não genérica",',
          '  "custo_da_dor": "o que essa dor custa a ela (em tempo, dinheiro ou risco). NÃO invente número.",',
          '  "arma_certa": "a função EXATA do AgendaPRO que resolve — específica (ex: \'marca e lote da cola na ficha\', não \'gestão\')",',
          '  "o_que_nao_oferecer": "o que NÃO adianta oferecer pra esse nicho",',
          '  "mensagem_impacto": "a frase de 1-2 linhas que faz ela parar e pensar. No tom do Eduardo."',
          '}',
        ].join('\n'),
      },
    ],
  })

  const b = r.content.find((x) => x.type === 'text')
  const bruto = b && b.type === 'text' ? b.text.trim() : '{}'
  const limpo = bruto.replace(/^```json\s*/i, '').replace(/```$/, '').trim()

  let j: any = {}
  try { j = JSON.parse(limpo) } catch { j = {} }

  return {
    dor_central: String(j.dor_central ?? '—'),
    custo_da_dor: String(j.custo_da_dor ?? '—'),
    arma_certa: String(j.arma_certa ?? '—'),
    o_que_nao_oferecer: String(j.o_que_nao_oferecer ?? '—'),
    mensagem_impacto: String(j.mensagem_impacto ?? '—'),
    modelo: 'claude-opus-4-8',
    custoUSD: (r.usage.input_tokens / 1e6) * 5 + (r.usage.output_tokens / 1e6) * 25,
  }
}

/* ═══════════════════════════════════════════════════════════════
   PLAYBOOK — a conversa inteira, do "oi" ao fechamento
   ═══════════════════════════════════════════════════════════════ */

export type Playbook = {
  msg1: string
  se_responder_curioso: string
  se_disser_ja_tenho_sistema: string
  se_disser_nao_tenho_tempo: string
  se_disser_ta_caro: string
  se_perguntar_whatsapp_automatico: string
  se_perguntar_nota_fiscal: string
  se_sumir_d3: string
  se_sumir_d7: string
  como_fechar: string
  modelo: string
  custoUSD: number
}

export async function playbookComClaude(lead: LeadInfo): Promise<Playbook> {
  const claude = getClaude()

  const r = await claude.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2200,
    system: ARSENAL_COPY,
    messages: [
      {
        role: 'user',
        content: [
          '# PLAYBOOK DE VENDA — a conversa inteira com ESTE lead',
          '',
          fichaDoLead(lead),
          '',
          '─── O NICHO DELA ───',
          contextoDoNicho(lead.categoria, lead.nome),
          '',
          'Escreva o playbook. TEXTO LITERAL, pronto pra colar no WhatsApp — nada de',
          '"explique que...". Escreva a frase que ele vai mandar.',
          '',
          'REGRAS DURAS:',
          '· Msg 1: sem preço, sem link, máx 5 linhas.',
          '· WHATSAPP: é SEMI-AUTOMÁTICO. O sistema MONTA a mensagem pronta (confirmação,',
          '  lembrete, aniversário, cupom pra cliente sumida) e ela envia com 1 TOQUE.',
          '  NÃO diga "não temos". Diga a verdade E vire vantagem: disparo automático em',
          '  massa é o que faz o WhatsApp BANIR número. Aqui sai do número dela, com o',
          '  toque dela. O que NÃO existe é o envio sozinho, sem clique.',
          '· NOTA FISCAL não existe. Aí sim: responda honesto e não perca a venda.',
          '· Nunca cite o concorrente pelo nome.',
          '· Nunca cite nota/avaliações do Google.',
          '· Nunca cite endereço.',
          '',
          'Responda em JSON puro, sem markdown:',
          '{',
          '  "msg1": "a primeira mensagem, pronta",',
          '  "se_responder_curioso": "ela respondeu com interesse — o que mandar",',
          '  "se_disser_ja_tenho_sistema": "resposta (use a dor do sistema dela, sem citar a marca)",',
          '  "se_disser_nao_tenho_tempo": "resposta — a arma aqui é: EU monto pra você",',
          '  "se_disser_ta_caro": "resposta — nunca baixe o preço, mude o quadro",',
          '  "se_perguntar_whatsapp_automatico": "TEMOS, SEMI-AUTOMÁTICO: o sistema escreve a mensagem pronta e ela envia com 1 toque. Explique isso e vire vantagem (disparo em massa derruba número).",',
          '  "se_perguntar_nota_fiscal": "NÃO TEMOS. Responda honesto.",',
          '  "se_sumir_d3": "follow-up no dia 3",',
          '  "se_sumir_d7": "o breakup do dia 7 — devolve o controle a ela",',
          '  "como_fechar": "como pedir a venda sem parecer desesperado"',
          '}',
        ].join('\n'),
      },
    ],
  })

  const b = r.content.find((x) => x.type === 'text')
  const bruto = b && b.type === 'text' ? b.text.trim() : '{}'
  const limpo = bruto.replace(/^```json\s*/i, '').replace(/```$/, '').trim()

  let j: any = {}
  try { j = JSON.parse(limpo) } catch { j = {} }

  const g = (k: string) => String(j[k] ?? '—')

  return {
    msg1: g('msg1'),
    se_responder_curioso: g('se_responder_curioso'),
    se_disser_ja_tenho_sistema: g('se_disser_ja_tenho_sistema'),
    se_disser_nao_tenho_tempo: g('se_disser_nao_tenho_tempo'),
    se_disser_ta_caro: g('se_disser_ta_caro'),
    se_perguntar_whatsapp_automatico: g('se_perguntar_whatsapp_automatico'),
    se_perguntar_nota_fiscal: g('se_perguntar_nota_fiscal'),
    se_sumir_d3: g('se_sumir_d3'),
    se_sumir_d7: g('se_sumir_d7'),
    como_fechar: g('como_fechar'),
    modelo: 'claude-opus-4-8',
    custoUSD: (r.usage.input_tokens / 1e6) * 5 + (r.usage.output_tokens / 1e6) * 25,
  }
}
