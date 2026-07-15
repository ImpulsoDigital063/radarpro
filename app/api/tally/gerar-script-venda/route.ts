import { NextRequest, NextResponse } from 'next/server'
import { getClient, initDb } from '@/lib/db'
import { gerarScriptVenda as gerarComClaude } from '@/lib/claude'
import { gerarScriptVenda as gerarComGemini } from '@/lib/gemini'
import { gerarScriptVenda as gerarComOpenAI } from '@/lib/openai'

export const maxDuration = 60 // Script é menor que o plano, 30-45s típico

type ModeloIA = 'claude' | 'gemini' | 'openai'

function modelosDisponiveis(): ModeloIA[] {
  const disponiveis: ModeloIA[] = []
  if (process.env.ANTHROPIC_API_KEY) disponiveis.push('claude')
  if (process.env.GEMINI_API_KEY) disponiveis.push('gemini')
  if (process.env.OPENAI_API_KEY) disponiveis.push('openai')
  return disponiveis
}

export async function GET() {
  return NextResponse.json({
    disponiveis: modelosDisponiveis(),
    recomendado: process.env.ANTHROPIC_API_KEY ? 'claude' : 'gemini',
  })
}

export async function POST(req: NextRequest) {
  await initDb()

  const body = await req.json()
  const { id, modelo, regenerate = false } = body

  if (!id) {
    return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })
  }

  const disponiveis = modelosDisponiveis()
  const modeloEscolhido: ModeloIA =
    modelo && disponiveis.includes(modelo as ModeloIA)
      ? (modelo as ModeloIA)
      : (disponiveis[0] || 'claude')

  if (!disponiveis.includes(modeloEscolhido)) {
    return NextResponse.json({
      error: `Modelo ${modeloEscolhido} não está configurado`,
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

  if (!lead.diagnostico_respondido_em || !lead.diagnostico_respostas) {
    return NextResponse.json({
      error: 'Lead ainda não preencheu o Diagnóstico. Script precisa das respostas pra ser gerado.',
    }, { status: 400 })
  }

  // Cache hit
  if (lead.script_venda_md && !regenerate) {
    return NextResponse.json({
      ok: true,
      cached: true,
      markdown: lead.script_venda_md,
      gerado_em: lead.script_venda_gerado_em,
      modelo: lead.script_venda_modelo_ia,
    })
  }

  let diagnostico: Record<string, string | null> = {}
  try {
    diagnostico = JSON.parse(lead.diagnostico_respostas)
  } catch {
    return NextResponse.json({ error: 'diagnostico_respostas inválido' }, { status: 500 })
  }

  const dadosLead = {
    nome: lead.nome,
    categoria: lead.categoria,
    cidade: lead.cidade,
    instagram: lead.instagram,
    site: lead.site,
    telefone: lead.telefone,
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
      diagnosticoRespostas: diagnostico,
    })

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await db.execute({
      sql: `UPDATE leads SET
        script_venda_md = ?,
        script_venda_gerado_em = ?,
        script_venda_modelo_ia = ?,
        atualizado_em = ?
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
    console.error(`[gerar-script-venda] falhou no modelo ${modeloEscolhido}:`, e)
    return NextResponse.json({
      error: `Falha ao gerar script com ${modeloEscolhido}`,
      detalhes: String(e?.message ?? e),
    }, { status: 500 })
  }
}

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
      script_venda_md = ?,
      script_venda_revisado_em = ?,
      atualizado_em = ?
      WHERE id = ?`,
    args: [markdown, now, now, id],
  })

  return NextResponse.json({ ok: true, revisado_em: now })
}
