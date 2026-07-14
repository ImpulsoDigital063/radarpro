import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { enviadasHoje, GUARD_PADRAO, RAMPA_AQUECIMENTO } from '@/lib/disparo-guard'
import { detectarNicho } from '@/lib/nichos'
import { situacaoDoLead } from '@/lib/playbook-local'

export const dynamic = 'force-dynamic'

/**
 * GET /api/fila — A FILA DE HOJE.
 *
 * Substitui o /api/disparo antigo, que lia uma lista de IDs CHUMBADA num
 * arquivo de abril (lib/disparo-analises.ts, era das LPs/Shopify). Os leads
 * novos nunca apareciam — a tela mostrava um mundo que não existe mais.
 *
 * Agora vem do BANCO, na ordem de ataque de verdade:
 *   1. quem foi ESTUDADO um a um (mensagem escrita pra ele)
 *   2. quem JÁ USA sistema concorrente (já paga por software, dor é o sistema)
 *   3. quem tem mais movimento
 *
 * E respeita o guard: teto do dia, rampa de aquecimento, quem já foi disparado.
 */

type Fila = {
  hoje: {
    enviadas: number
    teto: number
    restam: number
    janela: string
    dentroDaJanela: boolean
  }
  /**
   * Estado da conexão com o WhatsApp Business (Baileys, dispositivo vinculado).
   * Só existe rodando LOCAL — na Vercel o processo morre entre requisições e a
   * sessão do WhatsApp cai junto. Quando desconectado, a fila cai no wa.me
   * (abre o app com o texto pronto, você aperta enviar).
   */
  whatsapp: { conectado: boolean; numero: string | null; status: string }
  fila: any[]
  followups: any[]
  respondidos: any[]
}

export async function GET(_req: NextRequest) {
  const db = getClient()

  const enviadas = await enviadasHoje()

  // rampa: dia 1 = 10, e vai subindo. Se não estiver na rampa, teto cheio.
  const rampaDia = await (async () => {
    const r = await db.execute(
      `SELECT COUNT(DISTINCT date(criado_em)) AS d FROM disparos_log`
    )
    return Number((r.rows[0] as any)?.d ?? 0) + 1
  })().catch(() => 1)

  const teto = RAMPA_AQUECIMENTO[rampaDia] ?? GUARD_PADRAO.limiteDiario
  const agora = new Date()
  const hora = agora.getHours()
  const dentroDaJanela = hora >= GUARD_PADRAO.horaInicio && hora < GUARD_PADRAO.horaFim

  /* ── A FILA: quem ainda não recebeu nada ───────────────────────────── */
  const r = await db.execute(`
    SELECT id, nome, categoria, telefone, instagram, site_real,
           sistema_detectado, nivel_consciencia, nota, num_avaliacoes,
           script_json, mensagem, reviews_texto, notas
      FROM leads
     WHERE status != 'arquivado'
       AND telefone IS NOT NULL
       AND disparado_em IS NULL
       -- SÓ AgendaPRO. Sem isso, escritório de arquitetura e loja de cosmético
       -- (leads de LP/Shopify) caíam na fila e recebiam mensagem sobre comissão
       -- de barbeiro. Loja não tem agenda, nem comissão, nem ficha.
       AND tipo = 'agendapro'
     ORDER BY
       CASE WHEN script_json LIKE '%manual:estudado%' THEN 0 ELSE 1 END,
       CASE WHEN sistema_detectado IS NOT NULL THEN 0 ELSE 1 END,
       COALESCE(num_avaliacoes, 0) DESC
     LIMIT 120
  `)

  const fila = (r.rows as any[]).map((l) => montar(l))

  /* ── FOLLOW-UPS: disparado, não respondeu, e já passou o tempo ──────── */
  const f = await db.execute(`
    SELECT id, nome, categoria, telefone, sistema_detectado, nivel_consciencia,
           script_json, disparado_em,
           CAST(julianday('now','localtime') - julianday(disparado_em) AS INTEGER) AS dias
      FROM leads
     WHERE status != 'arquivado'
       AND disparado_em IS NOT NULL
       AND respondeu_em IS NULL
       AND CAST(julianday('now','localtime') - julianday(disparado_em) AS INTEGER) >= 3
     ORDER BY dias DESC
     LIMIT 60
  `)

  const followups = (f.rows as any[]).map((l) => {
    const pb = parse(l.script_json)
    const dias = Number(l.dias ?? 0)
    // D+7 é o breakup (devolve o controle). Entre 3 e 6, é o D+3.
    const qual = dias >= 7 ? 'd7' : 'd3'
    const texto = qual === 'd7' ? pb?.se_sumir_d7 : pb?.se_sumir_d3
    return {
      id: l.id,
      nome: l.nome,
      telefone: l.telefone,
      dias,
      qual,
      mensagem: texto ?? null,
      link: linkWa(l.telefone, texto),
    }
  })

  /* ── RESPONDERAM: precisam de resposta sua ─────────────────────────── */
  const q = await db.execute(`
    SELECT id, nome, telefone, respondeu_em, termometro, script_json
      FROM leads
     WHERE status != 'arquivado' AND respondeu_em IS NOT NULL AND fechou IS NULL
     ORDER BY respondeu_em DESC
     LIMIT 40
  `)

  const respondidos = (q.rows as any[]).map((l) => ({
    id: l.id,
    nome: l.nome,
    telefone: l.telefone,
    respondeu_em: l.respondeu_em,
    termometro: l.termometro,
    playbook: parse(l.script_json),
  }))

  // Estado do WhatsApp. NÃO chama conectar() — só lê. Se conectasse aqui, cada
  // refresh da fila tentaria subir socket, e na Vercel isso estoura.
  let whatsapp = { conectado: false, numero: null as string | null, status: 'indisponivel' }
  try {
    const { statusAtual } = await import('@/lib/whatsapp')
    const s = statusAtual()
    whatsapp = {
      conectado: s.status === 'conectado',
      numero: s.numero ?? null,
      status: s.status,
    }
  } catch {
    // sem Baileys no ambiente (Vercel) — segue no wa.me
  }

  const out: Fila = {
    hoje: {
      enviadas,
      teto,
      restam: Math.max(0, teto - enviadas),
      janela: `${GUARD_PADRAO.horaInicio}h–${GUARD_PADRAO.horaFim}h`,
      dentroDaJanela,
    },
    whatsapp,
    fila,
    followups,
    respondidos,
  }

  return NextResponse.json(out)
}

/* ── helpers ────────────────────────────────────────────────────────── */

function parse(raw: any): any | null {
  if (!raw) return null
  try { return JSON.parse(String(raw)) } catch { return null }
}

function linkWa(tel: string | null, texto?: string | null): string | null {
  if (!tel) return null
  const n = String(tel).replace(/\D/g, '')
  const cheio = n.startsWith('55') ? n : `55${n}`
  return texto
    ? `https://wa.me/${cheio}?text=${encodeURIComponent(texto)}`
    : `https://wa.me/${cheio}`
}

function montar(l: any) {
  const pb = parse(l.script_json)
  const msg = pb?.msg1 ?? l.mensagem ?? null

  // quantas avaliações negativas ele tem — é o tamanho da dor
  let negativas = 0
  let dorEscrita: string | null = null
  const rv = parse(l.reviews_texto)
  if (Array.isArray(rv)) {
    const ruins = rv.filter((v: any) => (v.nota ?? 5) <= 3)
    negativas = ruins.length
    if (ruins[0]?.texto) dorEscrita = String(ruins[0].texto).slice(0, 180)
  }

  return {
    id: l.id,
    nome: l.nome,
    categoria: l.categoria,
    telefone: l.telefone,
    nicho: detectarNicho(l.categoria ?? '', l.nome ?? '') ?? 'outro',
    situacao: situacaoDoLead(l),
    sistema_detectado: l.sistema_detectado ?? null,
    // estudado = mensagem escrita lead a lead, lendo as avaliações dele
    estudado: String(l.script_json ?? '').includes('manual:estudado'),
    gancho: pb?.gancho_do_estudo ?? null,
    negativas,
    dorEscrita,
    mensagem: msg,
    link: linkWa(l.telefone, msg),
    playbook: pb,
  }
}
