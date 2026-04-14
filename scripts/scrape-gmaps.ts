/**
 * radarPRO — Scraper Google Maps
 * Busca negócios por categoria em Palmas-TO e qualifica como prospect LP ou Shopify
 *
 * Uso:
 *   npx tsx scripts/scrape-gmaps.ts --tipo lp
 *   npx tsx scripts/scrape-gmaps.ts --tipo shopify
 *   npx tsx scripts/scrape-gmaps.ts --tipo lp --query "nutricionista Palmas TO"
 */

import { chromium } from 'playwright'
import {
  inserirLead,
  registrarBusca,
  estatisticas,
} from '../lib/db'
import {
  gerarMensagemLP,
  gerarMensagemShopify,
  gerarMensagemAgendaPRO,
  QUERIES_GMAPS_LP,
  QUERIES_GMAPS_SHOPIFY,
  QUERIES_GMAPS_AGENDAPRO,
} from '../lib/mensagens'

// ── Qualificador de site ──────────────────────────────────────────────────────
// Retorna true se o site parece uma LP/e-commerce real
// Retorna false se for só Instagram/Facebook/WhatsApp ou não tiver site
function temSiteReal(site: string | null): boolean {
  if (!site) return false
  const s = site.toLowerCase()
  // Sites que NÃO qualificam como LP real
  const descartados = [
    'instagram.com',
    'facebook.com',
    'wa.me',
    'whatsapp',
    'linktr.ee',
    'linktree',
    'bio.link',
    'beacons.ai',
    'taplink',
  ]
  return !descartados.some(d => s.includes(d))
}

// Verifica se o site parece e-commerce (para qualificar Shopify)
function temEcommerce(site: string | null): boolean {
  if (!site) return false
  const s = site.toLowerCase()
  const ecommerces = [
    'shopify',
    'nuvemshop',
    'loja',
    'store',
    'shop',
    'mercadoshops',
    'wix.com',
    'lojaintegrada',
  ]
  return ecommerces.some(d => s.includes(d))
}

// ── Extrator de telefone da string ────────────────────────────────────────────
function extrairTelefone(texto: string): string | null {
  const match = texto.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
  return match ? match[0].replace(/\s/g, '') : null
}

// ── Scraper principal ─────────────────────────────────────────────────────────
async function scrapeGoogleMaps(query: string, tipo: 'lp' | 'shopify' | 'agendapro') {
  console.log(`\n🔍 Buscando: "${query}" [${tipo.toUpperCase()}]`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(3000)

  let total = 0
  let novos  = 0
  const resultados: Array<{
    nome: string
    telefone: string | null
    site: string | null
    endereco: string | null
    nota: number | null
    categoria: string
  }> = []

  // Scroll para carregar mais resultados
  const painel = page.locator('[role="feed"]')
  for (let i = 0; i < 5; i++) {
    try {
      await painel.evaluate(el => el.scrollBy(0, 1500))
      await page.waitForTimeout(1500)
    } catch {}
  }

  // Pega todos os cards de resultado
  const cards = await page.locator('[role="feed"] > div').all()
  console.log(`   → ${cards.length} resultados encontrados`)

  for (const card of cards.slice(0, 30)) {
    try {
      const nomeEl = await card.locator('a[aria-label]').first()
      const nome = await nomeEl.getAttribute('aria-label')
      if (!nome) continue

      // Clica no card para abrir detalhes
      await nomeEl.click()
      await page.waitForTimeout(1500)

      // Extrai dados do painel lateral
      const telefoneText = await page.locator('[data-tooltip="Copiar número de telefone"]').textContent().catch(() => null)
      const siteEl       = await page.locator('a[data-item-id="authority"]').getAttribute('href').catch(() => null)
      const enderecoText = await page.locator('[data-item-id="address"] .fontBodyMedium').textContent().catch(() => null)
      const notaText     = await page.locator('.MW4etd').first().textContent().catch(() => null)

      const telefone = telefoneText ? extrairTelefone(telefoneText) : null
      const nota     = notaText ? parseFloat(notaText.replace(',', '.')) : null

      // Categoria baseada na query
      const categoria = query.split(' ')[0]

      resultados.push({ nome, telefone, site: siteEl, endereco: enderecoText, nota, categoria })
      total++

    } catch {
      // Card sem dados suficientes — pula
    }
  }

  await browser.close()

  // ── Qualificação e inserção ───────────────────────────────────────────────
  for (const r of resultados) {
    const siteReal    = temSiteReal(r.site)
    const ecommerce   = temEcommerce(r.site)

    // LP: qualificado se NÃO tem site real
    // Shopify: qualificado se NÃO tem e-commerce
    // AgendaPRO: qualifica todos — qualquer um que agenda pelo WhatsApp/telefone é prospect
    const qualificado = tipo === 'lp'
      ? !siteReal
      : tipo === 'shopify'
        ? !ecommerce
        : true // AgendaPRO: todos qualificam, o pitch é pra quem agenda pelo WhatsApp

    if (!qualificado) {
      console.log(`   ⏭  ${r.nome} — já tem ${tipo === 'lp' ? 'site' : 'e-commerce'}`)
      continue
    }

    const mensagem = tipo === 'lp'
      ? gerarMensagemLP(r.nome, r.categoria)
      : tipo === 'shopify'
        ? gerarMensagemShopify(r.nome, r.categoria)
        : gerarMensagemAgendaPRO(r.nome, r.categoria)

    const id = inserirLead({
      nome:      r.nome,
      categoria: r.categoria,
      tipo,
      telefone:  r.telefone ?? undefined,
      site:      r.site ?? undefined,
      endereco:  r.endereco ?? undefined,
      nota:      r.nota ?? undefined,
      tem_site:  siteReal,
      fonte:     'google_maps',
      mensagem,
    })

    if (id) {
      novos++
      console.log(`   ✅ ${r.nome} | ${r.telefone ?? 'sem tel'} | ${r.site ?? 'sem site'}`)
    } else {
      console.log(`   ↩  ${r.nome} — já existe no banco`)
    }
  }

  registrarBusca({ query, tipo, fonte: 'google_maps', total, novos })
  console.log(`   📊 Total: ${total} | Novos qualificados: ${novos}`)

  return { total, novos }
}

// ── Execução ──────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const tipoArg = args.find(a => a.startsWith('--tipo='))?.split('=')[1]
               || (args[args.indexOf('--tipo') + 1])
               || 'lp'

  const queryArg = args.find(a => a.startsWith('--query='))?.split('=')[1]
                || (args[args.indexOf('--query') + 1])

  const tipo = (['shopify', 'agendapro'].includes(tipoArg)
    ? tipoArg
    : 'lp') as 'lp' | 'shopify' | 'agendapro'

  const queries = queryArg
    ? [queryArg]
    : tipo === 'lp'
      ? QUERIES_GMAPS_LP
      : tipo === 'shopify'
        ? QUERIES_GMAPS_SHOPIFY
        : QUERIES_GMAPS_AGENDAPRO

  console.log(`\n🚀 radarPRO — Google Maps Scraper`)
  console.log(`   Modo: ${tipo.toUpperCase()}`)
  console.log(`   Queries: ${queries.length}`)
  console.log('─'.repeat(50))

  let totalGeral = 0
  let novosGeral = 0

  for (const query of queries) {
    const { total, novos } = await scrapeGoogleMaps(query, tipo)
    totalGeral += total
    novosGeral += novos
    // Pausa entre buscas para não ser bloqueado
    await new Promise(r => setTimeout(r, 3000))
  }

  console.log('\n' + '─'.repeat(50))
  console.log(`✅ Busca concluída`)
  console.log(`   Encontrados: ${totalGeral}`)
  console.log(`   Novos leads qualificados: ${novosGeral}`)

  const stats = estatisticas()
  console.log(`\n📊 Base total:`)
  console.log(`   LP:      ${stats.lp} leads`)
  console.log(`   Shopify: ${stats.shopify} leads`)
  console.log(`   Total:   ${stats.total} leads`)
}

main().catch(console.error)
