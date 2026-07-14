/**
 * Migration: colunas pra guardar o que o scraper v2 descobre na ficha do lead.
 *   npx tsx scripts/migrar-sistema-detectado.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
import { getClient } from '../lib/db'

const COLUNAS = [
  // qual sistema de agendamento ele já usa (Trinks, Booksy, Avec…) ou null
  ['sistema_detectado', 'TEXT'],
  // site REAL do negócio (antes o campo `site` guardava a URL do Google Maps — bug)
  ['site_real', 'TEXT'],
  // dados da ficha do Maps
  ['whatsapp_maps', 'TEXT'],
  ['horario_maps', 'TEXT'],
  // nível de consciência (Schwartz) inferido dos dados — decide a mensagem
  ['nivel_consciencia', 'TEXT'],
]

async function main() {
  const db = getClient()
  for (const [nome, tipo] of COLUNAS) {
    try {
      await db.execute(`ALTER TABLE leads ADD COLUMN ${nome} ${tipo}`)
      console.log(`✅ coluna criada: ${nome}`)
    } catch (e: any) {
      if (/duplicate column/i.test(e.message)) console.log(`↩  já existe: ${nome}`)
      else throw e
    }
  }

  // prova na fonte
  const r = await db.execute(`SELECT * FROM leads LIMIT 1`)
  const cols = r.columns.filter((c) => COLUNAS.some(([n]) => n === c))
  console.log(`\n✅ PROVA: colunas no banco → ${cols.join(', ')}\n`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
