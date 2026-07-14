import { NextRequest, NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { registrarDisparo } from '@/lib/disparo-guard'

export const dynamic = 'force-dynamic'

/**
 * POST /api/fila/marcar { leadId, acao }
 *
 * O buraco que isso fecha: hoje o Eduardo clica no wa.me, manda a mensagem, e
 * o banco NÃO FICA SABENDO. Sem disparado_em gravado, o guard anti-duplicata
 * não enxerga, o teto diário não conta e a fila de follow-up nunca enche.
 * Resultado: ele não tem como saber quem já recebeu.
 *
 * acao:
 *   'disparado'  → msg 1 enviada (conta no teto do dia)
 *   'followup'   → D+3 ou D+7 enviado (conta no teto também — é mensagem)
 *   'respondeu'  → ele respondeu (sai da fila de follow-up)
 *   'pular'      → não serve / não quero (arquiva, não some do banco)
 *   'fechou'     → VENDEU
 *   'perdido'    → morreu
 */
export async function POST(req: NextRequest) {
  try {
    const { leadId, acao, motivo } = await req.json()
    if (!leadId || !acao) {
      return NextResponse.json({ error: 'leadId e acao obrigatórios' }, { status: 400 })
    }

    const db = getClient()

    const r = await db.execute({
      sql: `SELECT id, nome, telefone, disparado_em FROM leads WHERE id = ?`,
      args: [leadId],
    })
    const lead = r.rows[0] as any
    if (!lead) return NextResponse.json({ error: 'lead não encontrado' }, { status: 404 })

    switch (acao) {
      case 'disparado': {
        await db.execute({
          sql: `UPDATE leads
                   SET disparado_em = COALESCE(disparado_em, datetime('now','localtime')),
                       status = CASE WHEN status IN ('novo','') OR status IS NULL
                                     THEN 'abordado' ELSE status END,
                       atualizado_em = datetime('now','localtime')
                 WHERE id = ?`,
          args: [leadId],
        })
        // registra no log — é o que faz o teto diário e o anti-duplicata funcionarem
        if (lead.telefone) {
          await registrarDisparo(String(lead.telefone), leadId).catch(() => {})
        }
        break
      }

      case 'followup': {
        if (lead.telefone) {
          await registrarDisparo(String(lead.telefone), leadId).catch(() => {})
        }
        await db.execute({
          sql: `UPDATE leads SET proximo_followup = datetime('now','localtime','+4 days'),
                     atualizado_em = datetime('now','localtime') WHERE id = ?`,
          args: [leadId],
        })
        break
      }

      case 'respondeu': {
        await db.execute({
          sql: `UPDATE leads
                   SET respondeu_em = COALESCE(respondeu_em, datetime('now','localtime')),
                       status = 'respondeu',
                       tempo_resposta_horas = CAST(
                         (julianday('now','localtime') - julianday(disparado_em)) * 24 AS INTEGER),
                       atualizado_em = datetime('now','localtime')
                 WHERE id = ?`,
          args: [leadId],
        })
        break
      }

      case 'pular': {
        // arquiva, NÃO deleta — lead descartado hoje pode servir amanhã
        await db.execute({
          sql: `UPDATE leads SET status = 'arquivado',
                     notas = COALESCE(notas,'') || ?,
                     atualizado_em = datetime('now','localtime')
                 WHERE id = ?`,
          args: [`\n[pulado na fila${motivo ? ': ' + motivo : ''}]`, leadId],
        })
        break
      }

      case 'fechou': {
        await db.execute({
          sql: `UPDATE leads SET fechou = 1, status = 'fechado',
                     atualizado_em = datetime('now','localtime') WHERE id = ?`,
          args: [leadId],
        })
        break
      }

      case 'perdido': {
        await db.execute({
          sql: `UPDATE leads SET fechou = 0, status = 'perdido',
                     motivo_perdido = ?, atualizado_em = datetime('now','localtime')
                 WHERE id = ?`,
          args: [motivo ?? null, leadId],
        })
        break
      }

      default:
        return NextResponse.json({ error: `ação desconhecida: ${acao}` }, { status: 400 })
    }

    // λ.prova-na-fonte: lê a row DEPOIS de escrever e devolve o que ficou.
    // UI verde não é prova — a prova é o banco.
    const depois = await db.execute({
      sql: `SELECT id, nome, status, disparado_em, respondeu_em, fechou FROM leads WHERE id = ?`,
      args: [leadId],
    })

    return NextResponse.json({ ok: true, lead: depois.rows[0] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
