import { NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import {
  gerarMensagemLP,
  gerarMensagemShopify,
  gerarMensagemAgendaPRO,
} from '@/lib/mensagens'
import { ANALISES } from '@/lib/disparo-analises'

export const dynamic = 'force-dynamic'

// Regenera o campo `mensagem` de TODOS os leads do banco usando os
// geradores atuais (CORE_SYSTEM_V2). Pula leads com playbook customizado
// em disparo-analises.ts — esses têm `abertura` própria que sobrescreve
// em runtime via /api/disparo.
//
// Use 1x após qualquer mudança nos templates de lib/mensagens.ts pra
// alinhar leads ANTIGOS no banco com a versão nova.

type LeadRow = {
  id: number
  nome: string | null
  categoria: string | null
  tipo: string | null
}

export async function POST() {
  const db = getClient()
  const idsCustomizados = new Set(Object.keys(ANALISES).map(Number))

  const res = await db.execute({
    sql: `SELECT id, nome, categoria, tipo FROM leads`,
    args: [],
  })

  let atualizados = 0
  let pulados_customizados = 0
  let pulados_sem_dado = 0
  const erros: { id: number; erro: string }[] = []

  for (const r of res.rows as unknown as LeadRow[]) {
    const id = Number(r.id)
    if (idsCustomizados.has(id)) {
      pulados_customizados++
      continue
    }
    const nome = (r.nome ?? '').trim()
    const categoria = (r.categoria ?? '').trim()
    if (!nome || !categoria) {
      pulados_sem_dado++
      continue
    }
    const tipo = (r.tipo ?? 'lp').toLowerCase()

    let novaMsg = ''
    if (tipo === 'shopify') {
      novaMsg = gerarMensagemShopify(nome, categoria)
    } else if (tipo === 'agendapro') {
      novaMsg = gerarMensagemAgendaPRO(nome, categoria)
    } else {
      novaMsg = gerarMensagemLP(nome, categoria)
    }

    try {
      await db.execute({
        sql: `UPDATE leads
                SET mensagem = ?, atualizado_em = datetime('now','localtime')
              WHERE id = ?`,
        args: [novaMsg, id],
      })
      atualizados++
    } catch (e) {
      erros.push({ id, erro: e instanceof Error ? e.message : String(e) })
    }
  }

  return NextResponse.json({
    ok: true,
    total_leads: res.rows.length,
    atualizados,
    pulados_customizados,
    pulados_sem_dado,
    erros: erros.length,
    erros_detalhe: erros.slice(0, 5),
  })
}

// GET pra preview rápido sem mexer no banco
export async function GET() {
  const db = getClient()
  const idsCustomizados = new Set(Object.keys(ANALISES).map(Number))
  const res = await db.execute({
    sql: `SELECT id, tipo FROM leads`,
    args: [],
  })
  const total = res.rows.length
  const customizados = (res.rows as unknown as { id: number }[])
    .filter(r => idsCustomizados.has(Number(r.id))).length
  const por_tipo: Record<string, number> = {}
  for (const r of res.rows as unknown as { tipo: string | null }[]) {
    const t = (r.tipo ?? 'lp').toLowerCase()
    por_tipo[t] = (por_tipo[t] ?? 0) + 1
  }
  return NextResponse.json({
    total_leads: total,
    com_playbook_customizado: customizados,
    seriam_regenerados: total - customizados,
    por_tipo,
  })
}
