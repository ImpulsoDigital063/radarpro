/**
 * Gera o playbook de TODOS os leads e grava no banco. CUSTO ZERO — sem API.
 * O painel lê de script_json e não chama mais a Anthropic.
 *   npx tsx scripts/gerar-playbooks.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { gerarPlaybookLocal, gerarDiagnosticoLocal, situacaoDoLead } from '../lib/playbook-local'
import { detectarNicho } from '../lib/nichos'

async function main() {
  const db = getClient()

  const r = await db.execute(`
    SELECT id, nome, categoria, sistema_detectado, nivel_consciencia
    FROM leads
    WHERE status != 'arquivado' AND telefone IS NOT NULL
      -- SÓ AgendaPRO. Rodar isso em lead de LP/Shopify entrega playbook de
      -- salão pra escritório de arquitetura. Já aconteceu.
      AND tipo = 'agendapro'
  `)

  console.log(`gerando playbook pra ${r.rows.length} leads...\n`)

  const porCombo = new Map<string, number>()

  for (const row of r.rows as any[]) {
    const pb = gerarPlaybookLocal(row)
    const dg = gerarDiagnosticoLocal(row)

    const notas = [
      `[Diagnóstico — local, sem API]`,
      `Dor: ${dg.dor_central}`,
      `Arma certa: ${dg.arma_certa}`,
      `NÃO oferecer: ${dg.o_que_nao_oferecer}`,
    ].join('\n')

    await db.execute({
      sql: `UPDATE leads
            SET script_json = ?, script_gerado_em = datetime('now','localtime'),
                notas = ?, atualizado_em = datetime('now','localtime')
            WHERE id = ?`,
      args: [JSON.stringify(pb), notas, row.id],
    })

    const k = `${detectarNicho(row.categoria ?? '', row.nome ?? '') ?? 'OUTRO'} × ${situacaoDoLead(row)}`
    porCombo.set(k, (porCombo.get(k) ?? 0) + 1)
  }

  console.log('gravado:')
  for (const [k, v] of [...porCombo.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(4)}  ${k}`)
  }
  console.log(`\n✅ ${r.rows.length} playbooks no banco. Custo: R$ 0,00`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
