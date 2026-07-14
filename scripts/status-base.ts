/**
 * Estado real da base — lido do banco, não do log.
 *   npx tsx scripts/status-base.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
import { getClient } from '../lib/db'

async function main() {
  const db = getClient()

  const q = async (sql: string) => (await db.execute(sql)).rows

  const totais = await q(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'arquivado' THEN 1 ELSE 0 END) AS arquivados,
      SUM(CASE WHEN status != 'arquivado' THEN 1 ELSE 0 END) AS ativos,
      SUM(CASE WHEN status != 'arquivado' AND telefone IS NOT NULL AND telefone != '' THEN 1 ELSE 0 END) AS com_tel,
      SUM(CASE WHEN status != 'arquivado' AND telefone IS NOT NULL AND telefone != '' AND disparado_em IS NULL THEN 1 ELSE 0 END) AS prontos
    FROM leads
  `)
  const t = totais[0] as any

  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║           ESTADO REAL DA BASE (do banco)         ║')
  console.log('╚══════════════════════════════════════════════════╝')
  console.log(`  Total no banco    : ${t.total}`)
  console.log(`  Arquivados        : ${t.arquivados}  (loja, tatuagem, pet shop…)`)
  console.log(`  Ativos (nicho)    : ${t.ativos}`)
  console.log(`  Com telefone      : ${t.com_tel}`)
  console.log(`  🎯 PRONTOS PRA DISPARO: ${t.prontos}`)

  console.log('\n── POR NÍVEL DE CONSCIÊNCIA (decide a mensagem) ──')
  const niveis = await q(`
    SELECT nivel_consciencia AS nivel, COUNT(*) AS n
    FROM leads
    WHERE status != 'arquivado' AND telefone IS NOT NULL AND telefone != ''
      AND disparado_em IS NULL AND nivel_consciencia IS NOT NULL
    GROUP BY nivel_consciencia ORDER BY n DESC
  `)
  for (const r of niveis as any[]) console.log(`  ${String(r.n).padStart(4)}  ${r.nivel}`)

  console.log('\n── 🔥 JÁ USAM SISTEMA (os furiosos) ──')
  const sis = await q(`
    SELECT sistema_detectado AS s, COUNT(*) AS n
    FROM leads
    WHERE status != 'arquivado' AND sistema_detectado IS NOT NULL
      AND telefone IS NOT NULL AND telefone != '' AND disparado_em IS NULL
    GROUP BY sistema_detectado ORDER BY n DESC
  `)
  for (const r of sis as any[]) console.log(`  ${String(r.n).padStart(4)}  ${r.s}`)

  console.log('\n── OS 11 DO TRINKS (o lead mais quente da base) ──')
  const trinks = await q(`
    SELECT nome, telefone, nota, num_avaliacoes FROM leads
    WHERE sistema_detectado = 'Trinks' AND status != 'arquivado'
      AND telefone IS NOT NULL AND disparado_em IS NULL
    ORDER BY num_avaliacoes DESC
  `)
  for (const r of trinks as any[]) {
    console.log(`  ${String(r.nome).slice(0, 32).padEnd(32)} ${r.telefone}  ★${r.nota ?? '-'}·${r.num_avaliacoes ?? 0}`)
  }
  console.log('')
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
