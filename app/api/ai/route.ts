import { NextRequest, NextResponse } from 'next/server'
import { gerarAbordagem, calcularScoreIA, chat } from '@/lib/gemini'
import { atualizarMensagem } from '@/lib/db'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'cole_sua_chave_aqui') {
    return NextResponse.json({ error: 'GEMINI_API_KEY não configurada' }, { status: 400 })
  }

  try {
    // Gera abordagem personalizada para um lead
    if (action === 'abordagem') {
      const { lead } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      const resposta = await gerarAbordagem(lead)

      // Salva a mensagem gerada no banco automaticamente
      if (lead.id && resposta.mensagem) {
        atualizarMensagem(lead.id, resposta.mensagem)
      }

      return NextResponse.json(resposta)
    }

    // Score inteligente via IA
    if (action === 'score') {
      const { lead } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      const resultado = await calcularScoreIA(lead)

      // Atualiza o score no banco
      if (lead.id) {
        db.prepare(`UPDATE leads SET score = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`)
          .run(resultado.score, lead.id)
      }

      return NextResponse.json(resultado)
    }

    // Chat livre com o agente
    if (action === 'chat') {
      const { historico = [], pergunta } = body
      if (!pergunta) return NextResponse.json({ error: 'pergunta obrigatória' }, { status: 400 })

      const resposta = await chat(historico, pergunta)
      return NextResponse.json({ resposta })
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
