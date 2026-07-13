import { NextRequest, NextResponse } from 'next/server'
import { enviarMensagem, statusAtual } from '@/lib/whatsapp'
import { podeDisparar, registrarDisparo, enviadasHoje, GUARD_PADRAO } from '@/lib/disparo-guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/whatsapp/send { telefone, mensagem, leadId?, forcar? }
 *
 * Todo envio passa pela trava (lib/disparo-guard):
 * janela de horário · teto diário · anti-duplicado.
 * `forcar: true` pula só o anti-duplicado (reenvio consciente, 1 lead),
 * nunca o teto diário nem a janela de horário.
 */
export async function POST(req: NextRequest) {
  try {
    const { telefone, mensagem, leadId, forcar } = await req.json()
    if (!telefone || !mensagem) {
      return NextResponse.json({ error: 'telefone e mensagem obrigatórios' }, { status: 400 })
    }

    const s = statusAtual()
    if (s.status !== 'conectado') {
      return NextResponse.json({ error: 'WhatsApp desconectado', status: s.status }, { status: 409 })
    }

    const veredito = await podeDisparar(telefone, leadId)
    if (!veredito.pode) {
      const ignoravel = forcar === true && veredito.codigo === 'ja_abordado'
      if (!ignoravel) {
        return NextResponse.json(
          { error: veredito.motivo, codigo: veredito.codigo, enviadasHoje: await enviadasHoje() },
          { status: 429 },
        )
      }
    }

    const resultado = await enviarMensagem(telefone, mensagem)
    await registrarDisparo(telefone, leadId)

    const hoje = await enviadasHoje()
    return NextResponse.json({
      ...resultado,
      enviadasHoje: hoje,
      restamHoje: Math.max(0, GUARD_PADRAO.limiteDiario - hoje),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
