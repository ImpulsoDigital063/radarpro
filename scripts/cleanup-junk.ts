import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'

async function main() {
  const db = getClient()
  const before = await db.execute(`SELECT id, nome, tipo FROM leads WHERE nome = 'Residência tipo Casa'`)
  console.log(`Leads a remover: ${before.rows.length}`)
  for (const r of before.rows) console.log(`  - #${r.id} [${r.tipo}] ${r.nome}`)

  const del = await db.execute(`DELETE FROM leads WHERE nome = 'Residência tipo Casa'`)
  console.log(`Removidos: ${del.rowsAffected}`)

  const delBuscas = await db.execute(`DELETE FROM buscas WHERE query = '--tipo'`)
  console.log(`Buscas lixo removidas: ${delBuscas.rowsAffected}`)

  const stats = await db.execute(
    `SELECT tipo, COUNT(*) as n FROM leads GROUP BY tipo`
  )
  console.log('\nBase atual:')
  for (const r of stats.rows) console.log(`  ${r.tipo}: ${r.n}`)
}

main().catch(e => { console.error(e); process.exit(1) })
