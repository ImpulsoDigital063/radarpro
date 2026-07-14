/**
 * REPARO — leads de LP e Shopify que receberam playbook de AgendaPRO por engano.
 *
 * O QUE EU FIZ DE ERRADO:
 *  1. `ehLeadDoNicho` tinha um bug: quando a categoria não era beleza, ele
 *     deixava o NOME decidir. E "studio", "make" e "unhas" estão na lista de
 *     nomes que entregam beleza. Então entraram:
 *       · "Studio Milhomem l Arquitetura"  (Escritório de Arquitetura)
 *       · "Universo das Makes & Unhas"     (Loja de cosmético)
 *       · "A&M Make up Boutique"           (Loja de produtos de beleza)
 *  2. `gerar-playbooks.ts` rodou em TODOS os leads com telefone, sem filtrar
 *     tipo. Esses 110 ganharam playbook de salão.
 *  3. `sincronizar-mensagens.ts` copiou esse msg1 pra coluna `mensagem`,
 *     APAGANDO a copy de LP/Shopify que estava lá.
 *
 * Um escritório de arquitetura ficou com mensagem sobre comissão de barbeiro.
 *
 * Este script devolve a eles o script certo da oferta deles.
 *
 *   npx tsx scripts/reparar-leads-lp-shopify.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { escolherScriptAbordagem, ehLeadDoNicho } from '../lib/mensagens'

async function main() {
  const db = getClient()

  const r = await db.execute(`
    SELECT id, nome, categoria, tipo
      FROM leads
     WHERE status != 'arquivado' AND tipo != 'agendapro'
  `)

  const rows = r.rows as any[]
  console.log(`${rows.length} leads de LP/Shopify a reparar\n`)

  let ok = 0
  const aindaNoNicho: string[] = []

  for (const l of rows) {
    // sanidade: com o bug corrigido, nenhum destes deve dar "é do nicho"
    if (ehLeadDoNicho(l.categoria ?? '', l.nome ?? '')) {
      aindaNoNicho.push(`${l.nome} (${l.categoria})`)
      continue
    }

    const { script } = escolherScriptAbordagem({
      nome: l.nome ?? '',
      categoria: l.categoria ?? '',
    })

    await db.execute({
      sql: `UPDATE leads
               SET mensagem = ?,
                   script_json = NULL,          -- o playbook de salão não serve pra loja
                   script_gerado_em = NULL,
                   notas = NULL,                -- o diagnóstico de salão também não
                   atualizado_em = datetime('now','localtime')
             WHERE id = ?`,
      args: [script.abertura, l.id],
    })
    ok++
  }

  console.log(`✅ ${ok} leads devolvidos pro script da oferta deles (LP/Shopify)`)
  if (aindaNoNicho.length) {
    console.log(`\n⚠️ ${aindaNoNicho.length} ainda batem como "do nicho" — conferir:`)
    for (const x of aindaNoNicho.slice(0, 10)) console.log(`   ${x}`)
  }

  // λ.prova-na-fonte
  const v = await db.execute(`
    SELECT COUNT(*) AS n FROM leads
     WHERE status != 'arquivado' AND tipo != 'agendapro' AND script_json IS NOT NULL
  `)
  const sobrou = Number((v.rows[0] as any).n)
  console.log(`\n${sobrou === 0 ? '✅' : '⚠️'} leads LP/Shopify ainda com playbook de AgendaPRO: ${sobrou}`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
