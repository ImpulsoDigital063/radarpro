/**
 * Gerador de mensagem — CLAUDE + ARSENAL.
 *
 * Substitui o gerarAbordagem() do gemini.ts, que:
 *   · rodava no Gemini 2.5-flash e caía com 503 ("high demand") — foi o erro que
 *     o Eduardo viu no painel em 14/07;
 *   · usava o SYSTEM_PROMPT de abril (mil linhas, playbook de landing page);
 *   · não sabia NADA do que o scraper v2 descobre (qual sistema o lead usa, o
 *     nível de consciência). Gerava "você tem sistema ou organiza na mão?" pra
 *     uma barbearia que o próprio scraper já sabia que usa TRINKS.
 *
 * Agora: Claude Opus 4.8 + ARSENAL_COPY (destilado de 7 frentes de pesquisa) +
 * o contexto REAL do lead, incluindo o sistema detectado.
 */

import Anthropic from '@anthropic-ai/sdk'
import { ARSENAL_COPY, contextoDoLead, LeadParaCopy } from './copy-prompt'

let client: Anthropic | null = null
function getClaude(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY não configurada')
  if (!client) client = new Anthropic({ apiKey: key })
  return client
}

/** O que o scraper v2 descobriu — é isso que decide a mensagem. */
export type LeadCompleto = LeadParaCopy & {
  id?: number
  telefone?: string | null
  sistema_detectado?: string | null
  nivel_consciencia?: string | null
}

/** Traduz o nível técnico em instrução pra IA. */
function instrucaoDoNivel(nivel: string | null | undefined, sistema: string | null | undefined): string {
  if (sistema) {
    return [
      `🔥 ESTE LEAD JÁ USA O ${sistema.toUpperCase()}.`,
      '',
      'A dor dele NÃO é a agenda — é o SISTEMA. Use a munição da seção 3.5.',
      'A arma mais forte: o AgendaPRO NÃO DESLOGA (a dor nº1 de todos eles).',
      '',
      '⚠️ NÃO diga que você sabe qual sistema ele usa (soa a espionagem).',
      '⚠️ NÃO fale mal do concorrente pelo nome (você vira fofoqueiro).',
      '✅ PERGUNTE pela dor e deixe ELE reclamar. Quem tem que dizer que é ruim é ele.',
    ].join('\n')
  }

  switch (nivel) {
    case 'MOVIMENTO_ALTO_MANUAL':
      return [
        '🔥 O LEAD MAIS QUENTE: movimento grande e controle 100% na mão.',
        'Fatura bem e não tem sistema. O eixo é o DINHEIRO ("agenda cheia, caixa vazio").',
        'NÃO fale de agenda — ela dá conta da agenda. Fale do que escapa: o caixa.',
      ].join('\n')
    case 'AGENDA_PELA_DM':
      return [
        'Ela agenda pela DM do Instagram. Está no MANUAL.',
        'Descreva a rotina dela SEM JULGAR. Não abra falando "sistema" — ela desliga.',
        'O eixo é o dinheiro, não a agenda.',
      ].join('\n')
    case 'TEM_SITE_PROPRIO':
      return 'Tem site próprio. É mais organizada que a média — fale de mecanismo, não de organização.'
    case 'FRIO':
      return [
        'Pouca informação sobre ela. Mensagem CURTÍSSIMA.',
        'Só nomeie a situação e faça uma pergunta de diagnóstico. Não venda nada.',
      ].join('\n')
    default:
      return 'Nível desconhecido — use a pergunta de diagnóstico da seção 3.'
  }
}

export type MensagemGerada = {
  mensagem: string
  angulo: string
  modelo: string
  custoUSD: number
}

export async function gerarMensagemComArsenal(lead: LeadCompleto): Promise<MensagemGerada> {
  const claude = getClaude()

  const ctx = contextoDoLead(lead)
  const instrucao = instrucaoDoNivel(lead.nivel_consciencia, lead.sistema_detectado)

  const r = await claude.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 500,
    system: ARSENAL_COPY,
    messages: [
      {
        role: 'user',
        content: [
          ctx,
          '',
          '─── DIAGNÓSTICO (o scraper já descobriu isto) ───',
          instrucao,
          '',
          'Escreva a Msg 1. Responda em JSON puro, sem markdown:',
          '{"mensagem": "o texto pronto pra colar no WhatsApp", "angulo": "3-5 palavras dizendo qual ângulo você usou"}',
        ].join('\n'),
      },
    ],
  })

  const bloco = r.content.find((b) => b.type === 'text')
  const bruto = bloco && bloco.type === 'text' ? bloco.text.trim() : ''

  let mensagem = bruto
  let angulo = ''
  try {
    const limpo = bruto.replace(/^```json\s*/i, '').replace(/```$/, '').trim()
    const j = JSON.parse(limpo)
    mensagem = String(j.mensagem ?? bruto).trim()
    angulo = String(j.angulo ?? '').trim()
  } catch {
    // se não veio JSON, usa o texto cru — melhor entregar algo que quebrar
  }

  const custoUSD = (r.usage.input_tokens / 1e6) * 5 + (r.usage.output_tokens / 1e6) * 25

  return { mensagem, angulo, modelo: 'claude-opus-4-8', custoUSD }
}
