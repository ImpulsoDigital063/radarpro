/**
 * Auditoria de nicho: o que tem na base HOJE, por categoria.
 *   npx tsx scripts/auditar-nicho.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { detectarTipoOferta } from '../lib/mensagens'

async function main() {
  const db = getClient()

  const r = await db.execute(`
    SELECT categoria, COUNT(*) AS n,
           SUM(CASE WHEN telefone IS NOT NULL AND telefone != '' THEN 1 ELSE 0 END) AS com_tel
    FROM leads
    GROUP BY categoria
    ORDER BY n DESC
  `)

  const dentro: any[] = []
  const fora: any[] = []

  for (const row of r.rows) {
    const cat = String(row.categoria ?? '(sem categoria)')
    const item = { cat, n: Number(row.n), tel: Number(row.com_tel) }
    if (detectarTipoOferta(cat) === 'agendapro-solo') dentro.push(item)
    else fora.push(item)
  }

  const soma = (a: any[], k: string) => a.reduce((s, x) => s + x[k], 0)

  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║  ✅ DENTRO DO NICHO (AgendaPRO) — o roteador já reconhece    ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  for (const x of dentro) console.log(`  ${String(x.n).padStart(4)} leads (${String(x.tel).padStart(3)} c/ tel)  ${x.cat}`)
  console.log(`  ${'─'.repeat(58)}`)
  console.log(`  ${String(soma(dentro, 'n')).padStart(4)} TOTAL   (${soma(dentro, 'tel')} com telefone = acionáveis)`)

  console.log('\n╔══════════════════════════════════════════════════════════════╗')
  console.log('║  ❌ FORA DO NICHO — hoje caem em LP/Shopify                  ║')
  console.log('╚══════════════════════════════════════════════════════════════╝')
  for (const x of fora.slice(0, 40)) console.log(`  ${String(x.n).padStart(4)} leads (${String(x.tel).padStart(3)} c/ tel)  ${x.cat}`)
  if (fora.length > 40) console.log(`  ... e mais ${fora.length - 40} categorias`)
  console.log(`  ${'─'.repeat(58)}`)
  console.log(`  ${String(soma(fora, 'n')).padStart(4)} TOTAL`)

  console.log(`\n📊 BASE: ${soma(dentro, 'n') + soma(fora, 'n')} leads · ${soma(dentro, 'tel')} acionáveis no nicho\n`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
