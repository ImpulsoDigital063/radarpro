import { NextRequest, NextResponse } from 'next/server'
import { getClient, initDb } from '@/lib/db'
import { gerarPlanoNegocio as gerarComClaude } from '@/lib/claude'
import { gerarPlanoNegocio as gerarComGemini } from '@/lib/gemini'
import { gerarPlanoNegocio as gerarComOpenAI } from '@/lib/openai'

export const maxDuration = 120

// Modelos disponíveis (só aparecem os que têm API key configurada)
type ModeloIA = 'claude' | 'gemini' | 'openai'

function modelosDisponiveis(): ModeloIA[] {
  const disponiveis: ModeloIA[] = []
  if (process.env.ANTHROPIC_API_KEY) disponiveis.push('claude')
  if (process.env.GEMINI_API_KEY) disponiveis.push('gemini')
  if (process.env.OPENAI_API_KEY) disponiveis.push('openai')
  return disponiveis
}

// GET — lista modelos disponíveis pra UI saber quais oferecer
export async function GET() {
  return NextResponse.json({
    disponiveis: modelosDisponiveis(),
    recomendado: process.env.ANTHROPIC_API_KEY ? 'claude' : 'gemini',
  })
}

// POST /api/tally/gerar-plano
// body: { id: number, modelo?: 'claude' | 'gemini' | 'openai', regenerate?: boolean }
export async function POST(req: NextRequest) {
  await initDb()

  const body = await req.json()
  const { id, modelo, regenerate = false } = body

  if (!id) {
    return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })
  }

  // Modelo default: claude se tiver key, senão gemini
  const disponiveis = modelosDisponiveis()
  const modeloEscolhido: ModeloIA =
    modelo && disponiveis.includes(modelo as ModeloIA)
      ? (modelo as ModeloIA)
      : (disponiveis[0] || 'claude')

  if (!disponiveis.includes(modeloEscolhido)) {
    return NextResponse.json({
      error: `Modelo ${modeloEscolhido} não está configurado (falta API key)`,
      disponiveis,
    }, { status: 400 })
  }

  const db = getClient()

  const r = await db.execute({
    sql: `SELECT * FROM leads WHERE id = ? LIMIT 1`,
    args: [id],
  })

  if (r.rows.length === 0) {
    return NextResponse.json({ error: 'lead não encontrado' }, { status: 404 })
  }

  const lead = r.rows[0] as any

  if (!lead.briefing_respondido_em || !lead.briefing_respostas) {
    return NextResponse.json({
      error: 'Lead ainda não preencheu o Briefing.',
    }, { status: 400 })
  }

  // Cache hit se já tem plano e não pediu regenerate
  if (lead.plano_negocio_md && !regenerate) {
    return NextResponse.json({
      ok: true,
      cached: true,
      markdown: lead.plano_negocio_md,
      gerado_em: lead.plano_gerado_em,
      modelo: lead.plano_modelo_ia,
    })
  }

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

  const dadosLead = {
    nome: lead.nome,
    categoria: lead.categoria,
    cidade: lead.cidade,
    instagram: lead.instagram,
    site: lead.site,
    telefone: lead.telefone,
    mensagem: lead.mensagem,
    servicoRecomendado: lead.servico_recomendado,
    faixaInvestimento: lead.faixa_investimento,
  }

  try {
    const gerador = {
      claude: gerarComClaude,
      gemini: gerarComGemini,
      openai: gerarComOpenAI,
    }[modeloEscolhido]

    const { markdown, modelo: modeloUsado } = await gerador({
      dadosLead,
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
      args: [markdown, now, modeloUsado, now, id],
    })

    return NextResponse.json({
      ok: true,
      cached: false,
      markdown,
      gerado_em: now,
      modelo: modeloUsado,
    })
  } catch (e: any) {
    console.error(`[gerar-plano] falhou no modelo ${modeloEscolhido}:`, e)
    return NextResponse.json({
      error: `Falha ao gerar plano com ${modeloEscolhido}`,
      detalhes: String(e?.message ?? e),
    }, { status: 500 })
  }
}

// PATCH — salva revisão manual do Eduardo
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
