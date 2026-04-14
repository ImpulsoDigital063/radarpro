import { NextRequest, NextResponse } from 'next/server'
import { enriquecerLead, enriquecerTodos } from '@/lib/enricher'

export async function POST(req: NextRequest) {
  const { id, tipo } = await req.json()

  if (id) {
    const resultado = await enriquecerLead(Number(id))
    return NextResponse.json({ ok: true, resultado })
  }

  // Roda em background para não travar
  enriquecerTodos(tipo).catch(console.error)
  return NextResponse.json({ ok: true, message: 'Enriquecimento iniciado em background' })
}
