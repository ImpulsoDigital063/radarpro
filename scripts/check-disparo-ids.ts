import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'

async function main() {
  const db = getClient()
  const ids = [55, 24, 146, 116, 9, 11, 108, 111, 30, 32, 17, 148, 115, 153]
  const r = await db.execute({
    sql: 'SELECT id, nome, telefone FROM leads WHERE id IN (' + ids.map(() => '?').join(',') + ')',
    args: ids,
  })
  console.log(`Encontrados: ${r.rows.length} / esperado 14`)
  r.rows.forEach((l: unknown) => {
    const row = l as { id: number; nome: string; telefone: string | null }
    console.log(` ✅ id=${row.id} ${row.nome} (${row.telefone ?? 'sem tel'})`)
  })
  const encontradosIds = new Set((r.rows as unknown as { id: number }[]).map((l) => l.id))
  const faltam = ids.filter((id) => !encontradosIds.has(id))
  if (faltam.length > 0) {
    console.log(`\n❌ FALTAM ${faltam.length} ids: ${faltam.join(', ')}`)
  }
}
main().catch(console.error)
