/**
 * Limpa a base: arquiva quem está FORA do nicho do AgendaPRO.
 *
 * NÃO DELETA — marca status='arquivado'. Os dados ficam. Se um dia voltar a
 * vender site/loja, a lista está lá (são 62 lojas de roupa com telefone).
 *
 *   npx tsx scripts/limpar-base.ts          → simulação (não grava nada)
 *   npx tsx scripts/limpar-base.ts --gravar → executa
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { ehLeadDoNicho } from '../lib/mensagens'

const GRAVAR = process.argv.includes('--gravar')

async function main() {
  const db = getClient()

  const r = await db.execute(`
    SELECT id, nome, categoria, telefone, status
    FROM leads
    WHERE status != 'arquivado' OR status IS NULL
  `)

  const manter: number[] = []
  const arquivar: number[] = []
  const porCategoria = new Map<string, number>()

  for (const row of r.rows) {
    const id = Number(row.id)
    const cat = String(row.categoria ?? '')
    const nome = String(row.nome ?? '')

    // lead de teste sai também
    const ehTeste = /teste|test\b|asdsad|espaco$/i.test(nome) || /teste/i.test(cat)

    if (!ehTeste && ehLeadDoNicho(cat, nome)) {
      manter.push(id)
    } else {
      arquivar.push(id)
      porCategoria.set(cat || '(sem categoria)', (porCategoria.get(cat || '(sem categoria)') ?? 0) + 1)
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log(`║  MANTER (nicho AgendaPRO): ${String(manter.length).padStart(4)} leads`.padEnd(57) + '║')
  console.log(`║  ARQUIVAR (fora do nicho): ${String(arquivar.length).padStart(4)} leads`.padEnd(57) + '║')
  console.log('╚════════════════════════════════════════════════════════╝')

  console.log('\nTop categorias que vão pro arquivo:')
  const top = [...porCategoria.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)
  for (const [cat, n] of top) console.log(`  ${String(n).padStart(4)}  ${cat}`)

  // quantos acionáveis sobram?
  const acionaveis = await db.execute({
    sql: `SELECT COUNT(*) AS n FROM leads
          WHERE id IN (${manter.map(() => '?').join(',') || '0'})
            AND telefone IS NOT NULL AND telefone != ''
            AND (disparado_em IS NULL)`,
    args: manter,
  })
  console.log(`\n🎯 ACIONÁVEIS AGORA: ${acionaveis.rows[0]?.n ?? 0} leads do nicho, com telefone, nunca abordados.`)

  if (!GRAVAR) {
    console.log('\n⚠️  SIMULAÇÃO — nada foi gravado.')
    console.log('   Pra executar: npx tsx scripts/limpar-base.ts --gravar\n')
    return
  }

  // arquiva em lotes
  console.log('\nArquivando...')
  const LOTE = 200
  let n = 0
  for (let i = 0; i < arquivar.length; i += LOTE) {
    const chunk = arquivar.slice(i, i + LOTE)
    await db.execute({
      sql: `UPDATE leads SET status = 'arquivado' WHERE id IN (${chunk.map(() => '?').join(',')})`,
      args: chunk,
    })
    n += chunk.length
    process.stdout.write(`\r  ${n}/${arquivar.length}`)
  }
  console.log('')

  // PROVA NA FONTE — lê de volta
  const dep = await db.execute(`
    SELECT
      SUM(CASE WHEN status = 'arquivado' THEN 1 ELSE 0 END) AS arquivados,
      SUM(CASE WHEN status != 'arquivado' THEN 1 ELSE 0 END) AS ativos
    FROM leads
  `)
  const ativos = await db.execute(`
    SELECT COUNT(*) AS n FROM leads
    WHERE status != 'arquivado' AND telefone IS NOT NULL AND telefone != '' AND disparado_em IS NULL
  `)

  console.log('\n✅ PROVA NA FONTE (lido do banco depois de gravar):')
  console.log(`   arquivados : ${dep.rows[0]?.arquivados}`)
  console.log(`   ativos     : ${dep.rows[0]?.ativos}`)
  console.log(`   🎯 prontos pra disparo: ${ativos.rows[0]?.n}\n`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
