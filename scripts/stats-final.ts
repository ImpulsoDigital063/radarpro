import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'

async function main() {
  const db = getClient()

  const tipos = await db.execute(`SELECT
    tipo,
    COUNT(*) n,
    SUM(CASE WHEN instagram IS NOT NULL THEN 1 ELSE 0 END) com_ig,
    SUM(CASE WHEN telefone  IS NOT NULL THEN 1 ELSE 0 END) com_tel,
    SUM(CASE WHEN score >= 7 THEN 1 ELSE 0 END) quentes
  FROM leads GROUP BY tipo`)

  console.log('\n📊 Por tipo:')
  for (const r of tipos.rows as any[]) {
    console.log(`  ${r.tipo.padEnd(10)} | ${String(r.n).padStart(3)} total | ${String(r.com_ig).padStart(3)} com IG | ${String(r.com_tel).padStart(3)} com tel | ${String(r.quentes).padStart(3)} score≥7`)
  }

  const top = await db.execute(`SELECT id, nome, tipo, telefone, instagram, score, nota
    FROM leads WHERE score >= 7 AND telefone IS NOT NULL
    ORDER BY score DESC, nota DESC NULLS LAST LIMIT 10`)

  console.log('\n🔥 Top 10 leads quentes (score≥7 com telefone):')
  for (const r of top.rows as any[]) {
    const ig = r.instagram ? `· ${r.instagram}` : ''
    console.log(`  [${r.tipo}] #${r.id} score ${r.score} | ${r.nome} | ${r.telefone} ${ig}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
