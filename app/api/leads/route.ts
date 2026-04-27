import { NextRequest, NextResponse } from 'next/server'
import { listarLeads, atualizarStatus, atualizarNotas, atualizarFollowup, atualizarMensagem, estatisticas, toggleSelecionado } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tipo   = searchParams.get('tipo') as any
  const status = searchParams.get('status') as any
  const stats  = searchParams.get('stats')

  if (stats) return NextResponse.json(await estatisticas())

  const leads = await listarLeads({
    ...(tipo   && { tipo }),
    ...(status && { status }),
  })

  return NextResponse.json(leads)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, action } = body

  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 })

  if (action === 'status')   await atualizarStatus(id, body.status, {
    objecao_tipo:   body.objecao_tipo,
    fase_travou:    body.fase_travou,
    motivo_perdido: body.motivo_perdido,
  })
  if (action === 'notas')    await atualizarNotas(id, body.notas)
  if (action === 'followup') await atualizarFollowup(id, body.data)
  if (action === 'mensagem') await atualizarMensagem(id, body.mensagem)

  if (action === 'toggle_selecionado') {
    const r = await toggleSelecionado(id)
    return NextResponse.json({ ok: true, ...r })
  }

  if (!action && body.status) await atualizarStatus(id, body.status)

  return NextResponse.json({ ok: true })
}
