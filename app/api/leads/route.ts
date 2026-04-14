import { NextRequest, NextResponse } from 'next/server'
import { listarLeads, atualizarStatus, atualizarNotas, atualizarFollowup, atualizarMensagem, estatisticas } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tipo   = searchParams.get('tipo') as any
  const status = searchParams.get('status') as any
  const stats  = searchParams.get('stats')

  if (stats) return NextResponse.json(estatisticas())

  const leads = listarLeads({
    ...(tipo   && { tipo }),
    ...(status && { status }),
  })

  return NextResponse.json(leads)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, action } = body

  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

  if (action === 'status')   atualizarStatus(id, body.status, body.observacao)
  if (action === 'notas')    atualizarNotas(id, body.notas)
  if (action === 'followup') atualizarFollowup(id, body.data)
  if (action === 'mensagem') atualizarMensagem(id, body.mensagem)

  // Compatibilidade com chamadas antigas
  if (!action && body.status) atualizarStatus(id, body.status, body.observacao)

  return NextResponse.json({ ok: true })
}
