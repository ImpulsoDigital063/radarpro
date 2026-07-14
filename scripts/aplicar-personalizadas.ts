/**
 * Grava as mensagens personalizadas (escritas à mão, lead a lead) por cima do
 * playbook local. Só troca msg1 / se_sumir_d3 / o gancho — o resto do playbook
 * (objeções, fechamento) continua valendo.
 *
 * Entrada: JSON [{ id, msg1, d3?, gancho? }]
 *   npx tsx scripts/aplicar-personalizadas.ts --in=msgs-personalizadas.json
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { readFileSync } from 'fs'
import { getClient } from '../lib/db'
import { atualizarMensagem } from '../lib/db'

const ENTRADA = process.argv.find((a) => a.startsWith('--in='))?.split('=')[1]
if (!ENTRADA) { console.log('use --in=arquivo.json'); process.exit(1) }

type Item = { id: number; msg1: string; d3?: string; gancho?: string }

async function main() {
  const db = getClient()
  const itens: Item[] = JSON.parse(readFileSync(ENTRADA as string, 'utf8'))

  // trava λ.não-inventar: a mensagem NÃO pode citar nota nem nº de avaliações
  const PROIBIDO = /\b\d{2,}\s*(avalia|review|estrela)/i
  const suspeitos = itens.filter((i) => PROIBIDO.test(i.msg1) || (i.d3 && PROIBIDO.test(i.d3)))
  if (suspeitos.length) {
    console.log('🚫 BLOQUEADO — mensagem citando nº de avaliações (só vendedor lê isso):')
    for (const s of suspeitos) console.log(`   id ${s.id}: ${s.msg1.slice(0, 90)}`)
    process.exit(1)
  }

  let ok = 0
  for (const it of itens) {
    const r = await db.execute({ sql: `SELECT script_json FROM leads WHERE id = ?`, args: [it.id] })
    const raw = r.rows[0]?.script_json as string | undefined
    if (!raw) { console.log(`✗ id ${it.id}: sem playbook base`); continue }

    const pb = JSON.parse(raw)
    pb.msg1 = it.msg1
    if (it.d3) pb.se_sumir_d3 = it.d3
    pb.modelo = `manual:estudado`
    if (it.gancho) pb.gancho_do_estudo = it.gancho

    await db.execute({
      sql: `UPDATE leads SET script_json = ?, script_gerado_em = datetime('now','localtime'),
                 atualizado_em = datetime('now','localtime') WHERE id = ?`,
      args: [JSON.stringify(pb), it.id],
    })
    await atualizarMensagem(it.id, it.msg1)
    ok++
  }

  console.log(`✅ ${ok} mensagens personalizadas gravadas (de ${itens.length})`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
