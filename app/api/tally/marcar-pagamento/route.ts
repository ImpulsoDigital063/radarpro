import { NextRequest, NextResponse } from 'next/server'
import { getClient, initDb } from '@/lib/db'

// POST /api/tally/marcar-pagamento
// body: { id: number, tipo: 'entrada' | 'final', when?: string }

export async function POST(req: NextRequest) {
  await initDb()

  const body = await req.json()
  const { id, tipo, when } = body

  if (!id || !tipo) {
    return NextResponse.json({ error: 'id e tipo obrigatórios' }, { status: 400 })
  }

  const campo = tipo === 'entrada' ? 'pagamento_50_em' : 'pagamento_final_em'
  const agora = when || new Date().toISOString().slice(0, 19).replace('T', ' ')

  const db = getClient()
  await db.execute({
    sql: `UPDATE leads SET ${campo} = ?, atualizado_em = ? WHERE id = ?`,
    args: [agora, agora, id],
  })

  return NextResponse.json({ ok: true, id, campo, valor: agora })
}
