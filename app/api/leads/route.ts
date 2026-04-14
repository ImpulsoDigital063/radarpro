import { NextRequest, NextResponse } from 'next/server'
import { listarLeads, atualizarStatus, estatisticas } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tipo      = searchParams.get('tipo') as any
  const status    = searchParams.get('status') as any
  const stats     = searchParams.get('stats')

  if (stats) {
    return NextResponse.json(estatisticas())
  }

  const leads = listarLeads({
    ...(tipo   && { tipo }),
    ...(status && { status }),
  })

  return NextResponse.json(leads)
}

export async function PATCH(req: NextRequest) {
  const { id, status, observacao } = await req.json()
  if (!id || !status) return NextResponse.json({ error: 'id e status obrigatórios' }, { status: 400 })
  atualizarStatus(id, status, observacao)
  return NextResponse.json({ ok: true })
}
