import { NextRequest, NextResponse } from 'next/server'
import { enviarMensagem, statusAtual } from '@/lib/whatsapp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST /api/whatsapp/send { telefone, mensagem, leadId? }
export async function POST(req: NextRequest) {
  try {
    const { telefone, mensagem } = await req.json()
    if (!telefone || !mensagem) {
      return NextResponse.json({ error: 'telefone e mensagem obrigatórios' }, { status: 400 })
    }
    const s = statusAtual()
    if (s.status !== 'conectado') {
      return NextResponse.json(
        { error: 'WhatsApp desconectado', status: s.status },
        { status: 409 },
      )
    }
    const resultado = await enviarMensagem(telefone, mensagem)
    return NextResponse.json(resultado)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
