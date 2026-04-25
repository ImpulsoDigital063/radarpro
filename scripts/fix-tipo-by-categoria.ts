// Corrige campo `tipo` no banco baseado na CATEGORIA do lead.
//
// Problema: scrape-gmaps.ts insere com `tipo` = flag passada na CLI
// (--tipo lp), mesmo se a categoria for "Loja de roupas". Função
// detectarTipoOferta() já lida com isso na hora do disparo, mas pra
// filtros do /Painel funcionarem (?tipo=shopify) o campo precisa
// estar correto.
//
// Uso: npx tsx scripts/fix-tipo-by-categoria.ts
// (modo dry-run): npx tsx scripts/fix-tipo-by-categoria.ts --dry

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { detectarTipoOferta } from '../lib/mensagens'

type Lead = {
  id: number
  nome: string
  categoria: string
  tipo: string
}

async function main() {
  const dryRun = process.argv.includes('--dry')

  const db = getClient()
  const res = await db.execute(`SELECT id, nome, categoria, tipo FROM leads`)
  const leads = res.rows as unknown as Lead[]

  let toFix = 0
  let lpToShopify = 0
  let preservados = 0
  const exemplos: string[] = []

  for (const lead of leads) {
    const tipoOferta = detectarTipoOferta(lead.categoria ?? '')
    const tipoBanco = lead.tipo

    // Mapping: 'shopify-solo' → 'shopify', 'lp-solo' → 'lp'
    const tipoEsperado =
      tipoOferta === 'shopify-solo' ? 'shopify' :
      tipoOferta === 'agendapro-solo' ? 'agendapro' :
      'lp'

    // REGRA: só fazer UPGRADE lp → shopify. Nunca downgrade shopify → lp.
    // Se scraper marcou shopify originalmente (passando --tipo shopify na CLI),
    // confiamos nele — categoria genérica do Maps ("Comércio local", "Loja")
    // não é motivo pra rebaixar. Quem entra como shopify, fica como shopify.
    const deveAtualizar = tipoBanco === 'lp' && tipoEsperado === 'shopify'

    if (deveAtualizar) {
      toFix++
      lpToShopify++

      if (exemplos.length < 10) {
        exemplos.push(`  id=${lead.id} "${lead.nome}" (${lead.categoria}): ${tipoBanco} → ${tipoEsperado}`)
      }

      if (!dryRun) {
        await db.execute({
          sql: `UPDATE leads SET tipo = ? WHERE id = ?`,
          args: [tipoEsperado, lead.id],
        })
      }
    } else if (tipoBanco !== tipoEsperado) {
      // Caso preservado (shopify → lp seria downgrade, mantemos shopify)
      preservados++
    }
  }

  console.log(`Total leads: ${leads.length}`)
  console.log(`Upgrades aplicados (lp → shopify): ${toFix}`)
  console.log(`Preservados (shopify mantido apesar de categoria genérica): ${preservados}`)
  console.log('')
  console.log('Exemplos (primeiros 10):')
  exemplos.forEach((e) => console.log(e))
  console.log('')
  if (dryRun) {
    console.log('🔵 DRY RUN — nada foi alterado. Rode sem --dry pra aplicar.')
  } else {
    console.log(`✅ ${toFix} leads atualizados.`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
