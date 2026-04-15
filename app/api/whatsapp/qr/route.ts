import { NextResponse } from 'next/server'
import { conectar, statusAtual } from '@/lib/whatsapp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/whatsapp/qr → { status, qr?, numero? }
export async function GET() {
  try {
    // Dispara conexão se ainda não iniciou — idempotente
    await conectar()
    const s = statusAtual()
    return NextResponse.json(s)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
