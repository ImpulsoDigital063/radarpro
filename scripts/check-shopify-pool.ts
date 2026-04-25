// Diagnóstico rápido: quantos leads Shopify-solo no banco e
// quantos têm Instagram (qualificados pra entrar no top-20-perfeitos)?

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { detectarTipoOferta, categoriaEhNaoFit } from '../lib/mensagens'

async function main() {
  const db = getClient()
  const r = await db.execute(`
    SELECT id, nome, categoria, telefone, instagram, status
      FROM leads
     WHERE telefone IS NOT NULL AND telefone != ''
  `)
  const all = r.rows as unknown as Array<{
    id: number; nome: string; categoria: string; telefone: string;
    instagram: string | null; status: string;
  }>

  let shopifyTotal = 0
  let shopifyComIG = 0
  let shopifyStatusNovo = 0
  let shopifyComIGEStatusNovo = 0
  let naoFit = 0
  const exemplosShopifySemIG: string[] = []

  for (const lead of all) {
    const oferta = detectarTipoOferta(lead.categoria ?? '')
    if (oferta !== 'shopify-solo') continue

    if (categoriaEhNaoFit(lead.categoria ?? '')) {
      naoFit++
      continue
    }

    shopifyTotal++

    const temIG = lead.instagram && lead.instagram.trim() !== ''
    const ehNovo = lead.status === 'novo'

    if (temIG) shopifyComIG++
    if (ehNovo) shopifyStatusNovo++
    if (temIG && ehNovo) shopifyComIGEStatusNovo++

    if (!temIG && exemplosShopifySemIG.length < 10) {
      exemplosShopifySemIG.push(`  id=${lead.id} "${lead.nome}" (${lead.categoria}) — sem IG`)
    }
  }

  console.log('━━━ Pool de leads Shopify (FIT) ━━━')
  console.log(`Total Shopify FIT (excluindo NÃO-FIT): ${shopifyTotal}`)
  console.log(`  Com Instagram: ${shopifyComIG} (${Math.round((shopifyComIG/shopifyTotal)*100)}%)`)
  console.log(`  Status 'novo': ${shopifyStatusNovo}`)
  console.log(`  Com IG E status novo (entram no top-20-perfeitos): ${shopifyComIGEStatusNovo}`)
  console.log(`Categoria NÃO-FIT (descartados): ${naoFit}`)
  console.log('')
  console.log('Exemplos shopify SEM IG (precisam enriquecer):')
  exemplosShopifySemIG.forEach((e) => console.log(e))
}

main().catch(console.error)
