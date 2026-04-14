import { NextRequest, NextResponse } from 'next/server'
import { gerarAbordagem, calcularScoreIA, chat, gerarFollowup } from '@/lib/gemini'
import { analisarSiteLead } from '@/lib/site-analyzer'
import { analisarAvaliacoesGMaps } from '@/lib/reviews-analyzer'
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

    // Análise automática do site do lead
    if (action === 'analisar-site') {
      const { siteUrl, nome, leadId } = body
      if (!siteUrl || !nome) return NextResponse.json({ error: 'siteUrl e nome obrigatórios' }, { status: 400 })

      const analise = await analisarSiteLead(siteUrl, nome)

      // Salva a análise nas notas do lead
      if (leadId) {
        const notas = `[Análise do site — ${new Date().toLocaleDateString('pt-BR')}]\nNota: ${analise.nota}/10\n${analise.pontos_fracos}\nArgumento: ${analise.argumento}`
        db.prepare(`UPDATE leads SET notas = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`).run(notas, leadId)
      }

      return NextResponse.json(analise)
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

    // Gera follow-up personalizado
    if (action === 'followup') {
      const { lead } = body
      if (!lead) return NextResponse.json({ error: 'lead obrigatório' }, { status: 400 })

      const resultado = await gerarFollowup(lead)

      // Salva a nova mensagem e a data de follow-up no banco
      if (lead.id) {
        const hoje = new Date()
        hoje.setDate(hoje.getDate() + resultado.dias)
        const dataFollowup = hoje.toISOString().split('T')[0]

        db.prepare(`
          UPDATE leads
          SET mensagem = ?, proximo_followup = ?, atualizado_em = datetime('now','localtime')
          WHERE id = ?
        `).run(resultado.mensagem, dataFollowup, lead.id)
      }

      return NextResponse.json(resultado)
    }

    // Análise de avaliações do Google Maps
    if (action === 'avaliar-reviews') {
      const { mapsUrl, nome, leadId } = body
      if (!mapsUrl || !nome) return NextResponse.json({ error: 'mapsUrl e nome obrigatórios' }, { status: 400 })

      const analise = await analisarAvaliacoesGMaps(mapsUrl, nome)

      // Salva oportunidade nas notas do lead
      if (leadId && analise.oportunidade && analise.oportunidade !== 'Visitar o perfil do Google e ler as avaliações') {
        const nota = `[Avaliações Google — ${new Date().toLocaleDateString('pt-BR')}]\nDor: ${analise.dor_principal}\nElogio: ${analise.elogio_principal}\nOportunidade: ${analise.oportunidade}`
        db.prepare(`UPDATE leads SET notas = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`).run(nota, leadId)
      }

      return NextResponse.json(analise)
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
