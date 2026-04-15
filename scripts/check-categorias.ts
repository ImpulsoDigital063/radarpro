import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'

async function main() {
  const db = getClient()

  // Categorias suspeitas: "(n)", só número, vazia
  const bad = await db.execute(
    `SELECT id, nome, categoria, tipo FROM leads
     WHERE categoria LIKE '(%)'
        OR categoria GLOB '[0-9]*'
        OR categoria IS NULL
        OR categoria = ''
        OR LENGTH(categoria) < 3`
  )
  console.log(`Leads com categoria ruim: ${bad.rows.length}`)
  for (const r of bad.rows.slice(0, 10)) {
    console.log(`  #${r.id} [${r.tipo}] cat="${r.categoria}" | ${r.nome}`)
  }
  if (bad.rows.length > 10) console.log(`  ... e mais ${bad.rows.length - 10}`)

  // Ver distribuição de categorias
  const dist = await db.execute(
    `SELECT categoria, COUNT(*) as n FROM leads GROUP BY categoria ORDER BY n DESC LIMIT 20`
  )
  console.log('\nTop 20 categorias:')
  for (const r of dist.rows) console.log(`  ${r.n}x "${r.categoria}"`)
}

main().catch(e => { console.error(e); process.exit(1) })
