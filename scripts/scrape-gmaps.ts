/**
 * radarPRO — Scraper Google Maps
 * Extrai dados direto da lista de resultados (1 página só — rápido)
 *
 * Uso:
 *   npx tsx scripts/scrape-gmaps.ts "--query=nutricionista Palmas TO" --tipo lp
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { chromium } from 'playwright'
import { inserirLead, registrarBusca, estatisticas } from '../lib/db'
import { gerarMensagemLP, gerarMensagemShopify, gerarMensagemAgendaPRO } from '../lib/mensagens'
import { calcularScore } from '../lib/score'

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

  // Scroll para carregar mais resultados
  for (let i = 0; i < 8; i++) {
    try {
      await page.locator('[role="feed"]').evaluate(el => el.scrollBy(0, 1200))
      await page.waitForTimeout(1000)
    } catch {}
  }

  // Extrai tudo de uma vez da página via evaluate (rápido, sem cliques)
  const resultados = await page.evaluate(() => {
    const items: any[] = []

    // Cada card de resultado no feed
    document.querySelectorAll('[role="feed"] > div').forEach(card => {
      try {
        // Nome — link principal com aria-label
        const linkEl = card.querySelector('a[aria-label]')
        const nome = linkEl?.getAttribute('aria-label')?.trim()
        if (!nome) return

        // URL do negócio
        const href = (linkEl as HTMLAnchorElement)?.href ?? null

        // Texto completo do card para extrair outros dados
        const texto = card.textContent ?? ''

        // Categoria — geralmente aparece após o nome na segunda linha
        const spans = Array.from(card.querySelectorAll('span'))
        const categoria = spans.find(s => {
          const t = s.textContent?.trim() ?? ''
          if (t.length < 3 || t.length > 40) return false
          if (/^\d/.test(t)) return false              // começa com número
          if (/^\(\d+\)$/.test(t)) return false        // "(16)" = nº avaliações
          if (t.startsWith('(')) return false          // qualquer parêntese
          if (/^\d[,\.]\d/.test(t)) return false       // nota "4,5"
          if (t === 'Nenhuma avaliação') return false
          if (t.includes('R$') || t.includes('·')) return false
          if (s.getAttribute('aria-label') !== null) return false
          return true
        })?.textContent?.trim() ?? ''

        // Nota Google (formato: "4,5")
        const notaMatch = texto.match(/(\d[,\.]\d)\s*\(/)
        const nota = notaMatch ? parseFloat(notaMatch[1].replace(',', '.')) : null

        // Número de avaliações (formato: "4,5(123)")
        const avalMatch = texto.match(/\((\d[\d.,]+)\)/)
        const numAval = avalMatch ? parseInt(avalMatch[1].replace(/\D/g, '')) : 0

        // Telefone
        const telMatch = texto.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
        const telefone = telMatch ? telMatch[0].replace(/\s/g, '') : null

        // Verifica se tem site (ícone de globo no card)
        const temSiteCard = texto.includes('site') || texto.includes('www.') ||
          !!card.querySelector('[aria-label*="site"]')

        items.push({ nome, href, categoria, nota, numAval, telefone, temSiteCard, texto: texto.slice(0, 200) })
      } catch {}
    })

    return items
  })

  await browser.close()

  console.log(`   → ${resultados.length} resultados extraídos`)

  let total = 0
  let novos = 0
  const categoria = query.split(' ')[0]

  for (const r of resultados) {
    if (!r.nome) continue

    // Para LP: qualifica quem não tem site indicado no card
    // Para Shopify: qualifica quem não tem e-commerce
    // Para AgendaPRO: todos
    const qualificado =
      tipo === 'lp'       ? !r.temSiteCard :
      tipo === 'shopify'  ? !r.temSiteCard :
      true

    if (!qualificado) {
      console.log(`   ⏭  ${r.nome} — tem site`)
      continue
    }

    const mensagem =
      tipo === 'lp'      ? gerarMensagemLP(r.nome, r.categoria || categoria) :
      tipo === 'shopify' ? gerarMensagemShopify(r.nome, r.categoria || categoria) :
      gerarMensagemAgendaPRO(r.nome, r.categoria || categoria)

    const score = calcularScore({
      telefone:      r.telefone,
      nota:          r.nota,
      num_avaliacoes: r.numAval,
      tem_site:      r.temSiteCard,
      tipo,
    })

    const id = await inserirLead({
      nome:          r.nome,
      categoria:     r.categoria || categoria,
      tipo,
      telefone:      r.telefone ?? undefined,
      site:          r.href ?? undefined,
      nota:          r.nota ?? undefined,
      num_avaliacoes: r.numAval || undefined,
      tem_site:      r.temSiteCard,
      fonte:         'google_maps',
      mensagem,
      score,
    })

    total++
    if (id) {
      novos++
      console.log(`   ✅ ${r.nome} | ${r.telefone ?? 'sem tel'} | nota ${r.nota ?? '-'} | score ${score}`)
    } else {
      console.log(`   ↩  ${r.nome} — já existe`)
    }
  }

  await registrarBusca({ query, tipo, fonte: 'google_maps', total, novos })
  console.log(`\n   📊 Visitados: ${total} | Novos no banco: ${novos}`)
  return { total, novos }
}

// ── Main ──────────────────────────────────────────────────────────────────────
const QUERIES_PADRAO: Record<'lp'|'shopify'|'agendapro', string[]> = {
  lp: [
    'nutricionista Palmas TO',
    'advogado Palmas TO',
    'dentista Palmas TO',
    'arquiteto Palmas TO',
    'psicólogo Palmas TO',
    'fisioterapeuta Palmas TO',
  ],
  shopify: [
    'loja de roupas Palmas TO',
    'loja cosméticos Palmas TO',
    'perfumaria Palmas TO',
    'pet shop Palmas TO',
    'joalheria Palmas TO',
    'papelaria Palmas TO',
  ],
  agendapro: [
    'barbearia Palmas TO',
    'salão de beleza Palmas TO',
    'clínica estética Palmas TO',
    'manicure pedicure Palmas TO',
    'estúdio tatuagem Palmas TO',
    'massoterapia Palmas TO',
  ],
}

function readFlag(args: string[], name: string): string | null {
  const eq = args.find(a => a.startsWith(`--${name}=`))
  if (eq) return eq.slice(name.length + 3)
  const idx = args.indexOf(`--${name}`)
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1]
  return null
}

async function main() {
  const args = process.argv.slice(2)

  const tipoArg  = readFlag(args, 'tipo') || 'lp'
  const queryArg = readFlag(args, 'query')

  const tipo = (['shopify','agendapro'].includes(tipoArg) ? tipoArg : 'lp') as 'lp'|'shopify'|'agendapro'
  const queries = queryArg ? [queryArg] : QUERIES_PADRAO[tipo]

  console.log(`\n🚀 radarPRO — Google Maps Scraper`)
  console.log(`   Modo: ${tipo.toUpperCase()} | Query: ${queries[0]}`)
  console.log('─'.repeat(50))

  let tG = 0, nG = 0
  for (const q of queries) {
    const { total, novos } = await scrapeGoogleMaps(q, tipo)
    tG += total; nG += novos
  }

  console.log('\n' + '─'.repeat(50))
  console.log(`✅ Concluído — ${nG} novos leads salvos de ${tG} encontrados`)

  const stats = await estatisticas()
  console.log(`📊 Base: LP ${stats.lp} | Shopify ${stats.shopify} | AgendaPRO ${stats.agendapro} | Total ${stats.total}`)
}

main().catch(console.error)
