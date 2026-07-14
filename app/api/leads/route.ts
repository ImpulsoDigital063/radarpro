import { NextRequest, NextResponse } from 'next/server'
import { listarLeads, atualizarStatus, atualizarNotas, atualizarFollowup, atualizarMensagem, estatisticas, toggleSelecionado, getClient } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tipo   = searchParams.get('tipo') as any
  const status = searchParams.get('status') as any
  const stats  = searchParams.get('stats')
  const id     = searchParams.get('id')

  if (stats) return NextResponse.json(await estatisticas())

  /**
   * BUG QUE ISSO CONSERTA: /abordar/[id] chamava `/api/leads?id=X` e pegava
   * data[0] — mas esta rota NUNCA lia `id`. Devolvia a lista inteira, e a tela
   * sempre mostrava o PRIMEIRO lead do ranking, fosse qual fosse o id da URL.
   * Ou seja: /abordar/55 e /abordar/999 abriam o mesmo lead.
   */
  if (id) {
    const db = getClient()
    const r = await db.execute({
      sql: `SELECT * FROM leads WHERE id = ?`,
      args: [Number(id)],
    })
    return NextResponse.json(r.rows)
  }

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
