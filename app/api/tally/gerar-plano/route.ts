import { NextRequest, NextResponse } from 'next/server'
import { getClient, initDb } from '@/lib/db'
import { gerarPlanoNegocio } from '@/lib/claude'

export const maxDuration = 120 // Claude Sonnet 4.6 streaming pode levar 60-90s

// POST /api/tally/gerar-plano
// body: { id: number, regenerate?: boolean }

export async function POST(req: NextRequest) {
  await initDb()

  const body = await req.json()
  const { id, regenerate = false } = body

  if (!id) {
    return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })
  }

  const db = getClient()

  // Busca o lead completo
  const r = await db.execute({
    sql: `SELECT * FROM leads WHERE id = ? LIMIT 1`,
    args: [id],
  })

  if (r.rows.length === 0) {
    return NextResponse.json({ error: 'lead não encontrado' }, { status: 404 })
  }

  const lead = r.rows[0] as any

  // Verifica que tem briefing respondido
  if (!lead.briefing_respondido_em || !lead.briefing_respostas) {
    return NextResponse.json({
      error: 'Lead ainda não preencheu o Briefing. Plano precisa do briefing pra ser gerado.',
    }, { status: 400 })
  }

  // Se já tem plano e não pediu regenerate, retorna o existente
  if (lead.plano_negocio_md && !regenerate) {
    return NextResponse.json({
      ok: true,
      cached: true,
      markdown: lead.plano_negocio_md,
      gerado_em: lead.plano_gerado_em,
      modelo: lead.plano_modelo_ia,
    })
  }

  // Parse das respostas
  let briefing: Record<string, string | null> = {}
  let diagnostico: Record<string, string | null> | undefined

  try {
    briefing = JSON.parse(lead.briefing_respostas)
  } catch {
    return NextResponse.json({ error: 'briefing_respostas inválido' }, { status: 500 })
  }

  if (lead.diagnostico_respostas) {
    try {
      diagnostico = JSON.parse(lead.diagnostico_respostas)
    } catch {
      diagnostico = undefined
    }
  }

  // Gera o plano via Gemini
  try {
    const { markdown, modelo } = await gerarPlanoNegocio({
      dadosLead: {
        nome: lead.nome,
        categoria: lead.categoria,
        cidade: lead.cidade,
        instagram: lead.instagram,
        site: lead.site,
        telefone: lead.telefone,
        mensagem: lead.mensagem,
        servicoRecomendado: lead.servico_recomendado,
        faixaInvestimento: lead.faixa_investimento,
      },
      briefingRespostas: briefing,
      diagnosticoRespostas: diagnostico,
    })

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await db.execute({
      sql: `UPDATE leads SET
        plano_negocio_md = ?,
        plano_gerado_em  = ?,
        plano_modelo_ia  = ?,
        atualizado_em    = ?
        WHERE id = ?`,
      args: [markdown, now, modelo, now, id],
    })

    return NextResponse.json({
      ok: true,
      cached: false,
      markdown,
      gerado_em: now,
      modelo,
    })
  } catch (e: any) {
    console.error('[gerar-plano] falhou:', e)
    return NextResponse.json({
      error: 'Falha ao gerar plano',
      detalhes: String(e?.message ?? e),
    }, { status: 500 })
  }
}

// PATCH — salva revisão manual do Eduardo no markdown
export async function PATCH(req: NextRequest) {
  await initDb()

  const body = await req.json()
  const { id, markdown } = body

  if (!id || typeof markdown !== 'string') {
    return NextResponse.json({ error: 'id e markdown obrigatórios' }, { status: 400 })
  }

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const db = getClient()

  await db.execute({
    sql: `UPDATE leads SET
      plano_negocio_md = ?,
      plano_revisado_em = ?,
      atualizado_em = ?
      WHERE id = ?`,
    args: [markdown, now, now, id],
  })

  return NextResponse.json({ ok: true, revisado_em: now })
}
