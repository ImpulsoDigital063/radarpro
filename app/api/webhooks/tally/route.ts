import { NextRequest, NextResponse } from 'next/server'
import { getClient, initDb } from '@/lib/db'
import crypto from 'crypto'

// ══════════════════════════════════════════════════════════════
// Webhook Tally — recebe submissões dos formulários da LP Impulso
// ══════════════════════════════════════════════════════════════

const FORM_DIAGNOSTICO = 'A76J90'  // LP pública, 8 perguntas
const FORM_BRIEFING    = 'yP0Dyp'  // pós-venda, 19 perguntas

type TallyField = {
  key: string
  label: string
  type: string
  value: string | number | string[] | null
  options?: Array<{ id: string; text: string }>
}

type TallyPayload = {
  eventId: string
  eventType: 'FORM_RESPONSE'
  createdAt: string
  data: {
    responseId: string
    submissionId: string
    formId: string
    formName: string
    createdAt: string
    fields: TallyField[]
  }
}

// ── Verificação de assinatura (HMAC-SHA256) ──────────────────────────────────
function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.TALLY_WEBHOOK_SECRET
  if (!secret) return true // dev mode: aceita sem assinatura
  if (!signature) return false

  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64')
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'utf8'),
      Buffer.from(expected, 'utf8'),
    )
  } catch {
    return false
  }
}

// ── Resolve labels legíveis em vez de IDs ────────────────────────────────────
function parseFields(fields: TallyField[]): Record<string, string | null> {
  const parsed: Record<string, string | null> = {}
  for (const f of fields) {
    let value: string | null = null

    if (Array.isArray(f.value)) {
      // Multiple choice / Checkboxes — traduz ID → text
      if (f.options && f.options.length > 0) {
        value = f.value
          .map((id) => f.options!.find((o) => o.id === id)?.text || String(id))
          .join(', ')
      } else {
        value = f.value.join(', ')
      }
    } else if (f.value !== null && f.value !== undefined) {
      value = String(f.value)
    }

    parsed[f.label] = value
  }
  return parsed
}

// ── Normalização de telefone brasileiro (13 dígitos com DDI 55) ──────────────
function normalizarTelefone(phone: string | null | undefined): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) return `55${digits}`
  if (digits.length === 13 && digits.startsWith('55')) return digits
  if (digits.length === 10) return `55${digits}` // fixo sem 9
  return digits
}

function nowSql(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// ── Mapeia "faixa de investimento" do formulário pra código curto ────────────
function mapFaixaInvestimento(texto: string | null): string | null {
  if (!texto) return null
  const t = texto.toLowerCase()
  if (t.includes('até r$500') || t.includes('ate r$500')) return 'ate-500'
  if (t.includes('r$500') && t.includes('r$1.000')) return '500-1000'
  if (t.includes('r$1.000') && t.includes('r$2.000')) return '1000-2000'
  if (t.includes('acima')) return 'acima-2000'
  return null
}

// ── Deduz serviço recomendado a partir do problema + onde vende ──────────────
function inferirServicoRecomendado(
  problema: string | null,
  ondeVende: string | null,
): string {
  const p = (problema || '').toLowerCase()
  const ov = (ondeVende || '').toLowerCase()

  if (p.includes('caótico') || p.includes('whatsapp')) return 'agendapro'
  if (p.includes('começar a vender online') || !ov.includes('site')) return 'lp'
  if (ov.includes('marketplace') || p.includes('google')) return 'shopify'
  if (p.includes('profissionalizar')) return 'lp'
  if (p.includes('converto')) return 'lp'
  return 'consultoria'
}

// ══════════════════════════════════════════════════════════════
// POST /api/webhooks/tally
// ══════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  await initDb()

  const rawBody = await req.text()
  const signature = req.headers.get('tally-signature')

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let payload: TallyPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const data = payload?.data
  if (!data || !data.formId) {
    return NextResponse.json({ error: 'missing data or formId' }, { status: 400 })
  }

  const formId = data.formId
  const fields = parseFields(data.fields || [])
  const now = nowSql()
  const db = getClient()

  // ─── Diagnóstico (lead novo da LP) ────────────────────────────────────────
  if (formId === FORM_DIAGNOSTICO) {
    const nome = fields['Seu nome'] || 'Lead Diagnóstico'
    const telefone = normalizarTelefone(fields['Seu WhatsApp'])
    const linkPerfil = fields['Link do seu Instagram ou site atual (opcional)'] || null
    const instagram =
      linkPerfil && (linkPerfil.startsWith('@') || linkPerfil.includes('instagram.com'))
        ? linkPerfil
        : null
    const site =
      linkPerfil && !instagram && linkPerfil.includes('.') ? linkPerfil : null
    const problema = fields['Qual o maior problema do seu negócio hoje?']
    const ondeVende = fields['Onde você vende hoje? (pode marcar mais de um)']
    const negocio = fields['Qual o seu negócio?']
    const faixa = mapFaixaInvestimento(fields['Faixa de investimento que cabe no seu momento:'])
    const servicoRec = inferirServicoRecomendado(problema, ondeVende)

    // Existe lead por telefone?
    const existente = telefone
      ? await db.execute({
          sql: `SELECT id FROM leads WHERE telefone = ? LIMIT 1`,
          args: [telefone],
        })
      : { rows: [] }

    if (existente.rows.length > 0) {
      const leadId = existente.rows[0].id as bigint
      await db.execute({
        sql: `UPDATE leads SET
          diagnostico_respondido_em = ?,
          diagnostico_respostas     = ?,
          faixa_investimento        = ?,
          servico_recomendado       = ?,
          status                    = 'respondeu',
          termometro                = 'quente',
          termometro_atualizado_em  = ?,
          atualizado_em             = ?
          WHERE id = ?`,
        args: [now, JSON.stringify(fields), faixa, servicoRec, now, now, leadId],
      })
      return NextResponse.json({ ok: true, action: 'diagnostico-updated', lead_id: Number(leadId) })
    }

    const result = await db.execute({
      sql: `INSERT INTO leads (
        nome, categoria, tipo, telefone, instagram, site,
        fonte, mensagem, status, termometro, termometro_atualizado_em,
        diagnostico_respondido_em, diagnostico_respostas,
        faixa_investimento, servico_recomendado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        nome,
        negocio || null,
        servicoRec === 'agendapro' ? 'agendapro' : 'lp',
        telefone || null,
        instagram,
        site,
        'tally-diagnostico',
        problema,
        'respondeu',
        'quente',
        now,
        now,
        JSON.stringify(fields),
        faixa,
        servicoRec,
      ],
    })

    return NextResponse.json({
      ok: true,
      action: 'diagnostico-created',
      lead_id: Number(result.lastInsertRowid),
      servico_recomendado: servicoRec,
    })
  }

  // ─── Briefing (lead pós-venda, já pagou 50%) ──────────────────────────────
  if (formId === FORM_BRIEFING) {
    const telefone = normalizarTelefone(fields['WhatsApp que vai receber os leads da LP'])
    const nomeNegocio = fields['Nome do seu negócio'] || null

    const existente = telefone
      ? await db.execute({
          sql: `SELECT id FROM leads WHERE telefone = ? LIMIT 1`,
          args: [telefone],
        })
      : { rows: [] }

    if (existente.rows.length > 0) {
      const leadId = existente.rows[0].id as bigint
      await db.execute({
        sql: `UPDATE leads SET
          briefing_respondido_em = ?,
          briefing_respostas     = ?,
          status                 = 'fechado',
          fechou                 = 1,
          atualizado_em          = ?
          WHERE id = ?`,
        args: [now, JSON.stringify(fields), now, leadId],
      })
      return NextResponse.json({ ok: true, action: 'briefing-updated', lead_id: Number(leadId) })
    }

    // Lead não existia — briefing caiu sem passar pelo diagnóstico (venda offline)
    const result = await db.execute({
      sql: `INSERT INTO leads (
        nome, tipo, telefone, fonte, status, fechou,
        briefing_respondido_em, briefing_respostas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        nomeNegocio || 'Cliente Briefing',
        'lp',
        telefone || null,
        'tally-briefing',
        'fechado',
        1,
        now,
        JSON.stringify(fields),
      ],
    })

    return NextResponse.json({
      ok: true,
      action: 'briefing-created',
      lead_id: Number(result.lastInsertRowid),
    })
  }

  return NextResponse.json(
    { error: 'unknown formId', formId, expected: [FORM_DIAGNOSTICO, FORM_BRIEFING] },
    { status: 400 },
  )
}

// ── Healthcheck pra saber se o endpoint tá up ──────────────────────────────
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'tally-webhook',
    accepts: [FORM_DIAGNOSTICO, FORM_BRIEFING],
    signed: !!process.env.TALLY_WEBHOOK_SECRET,
  })
}
