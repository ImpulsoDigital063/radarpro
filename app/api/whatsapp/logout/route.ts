import { NextResponse } from 'next/server'
import { desconectar } from '@/lib/whatsapp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/whatsapp/logout → limpa sessão + desconecta
export async function POST() {
  try {
    const r = await desconectar()
    return NextResponse.json(r)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
