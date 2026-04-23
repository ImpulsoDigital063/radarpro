import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/licoes?status=pendente|aprovada|rejeitada|todas
export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status') ?? 'pendente'
    const db = getClient()

    const sql = status === 'todas'
      ? `SELECT * FROM licoes ORDER BY criado_em DESC LIMIT 200`
      : `SELECT * FROM licoes WHERE status = ? ORDER BY criado_em DESC LIMIT 200`

    const r = status === 'todas'
      ? await db.execute(sql)
      : await db.execute({ sql, args: [status] })

    return NextResponse.json({ licoes: r.rows })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
