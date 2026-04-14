/**
 * radarPRO — Scraper Instagram
 * Busca perfis por hashtag e qualifica como prospect LP, Shopify ou AgendaPRO
 *
 * Uso:
 *   npx tsx scripts/scrape-instagram.ts --tipo lp
 *   npx tsx scripts/scrape-instagram.ts --tipo shopify
 *   npx tsx scripts/scrape-instagram.ts --tipo agendapro
 *   npx tsx scripts/scrape-instagram.ts --tipo lp --hashtag nutricionistapalmas
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
  HASHTAGS_INSTAGRAM_LP,
  HASHTAGS_INSTAGRAM_SHOPIFY,
  HASHTAGS_INSTAGRAM_AGENDAPRO,
} from '../lib/mensagens'
import { calcularScore } from '../lib/score'

// ── Helpers ───────────────────────────────────────────────────────────────────

function extrairTelefone(texto: string): string | null {
  const match = texto.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
  return match ? match[0].replace(/\s/g, '') : null
}

function extrairSeguidores(bio: string): string | null {
  // Bio do Instagram às vezes traz "X seguidores" na meta description
  const match = bio.match(/(\d[\d,.]+)\s*(seguidores|followers)/i)
  return match ? match[1] : null
}

// ── Scraper de perfis de uma hashtag ─────────────────────────────────────────

async function scrapeHashtag(
  hashtag: string,
  tipo: 'lp' | 'shopify' | 'agendapro',
  page: any
): Promise<{ total: number; novos: number }> {
  console.log(`\n📸 Hashtag: #${hashtag} [${tipo.toUpperCase()}]`)

  const url = `https://www.instagram.com/explore/tags/${hashtag}/`
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(3000)

  // Pega os links de posts da hashtag
  const postLinks = await page.locator('a[href*="/p/"]').all()
  const hrefs: string[] = []
  for (const link of postLinks.slice(0, 20)) {
    const href = await link.getAttribute('href').catch(() => null)
    if (href && !hrefs.includes(href)) hrefs.push(href)
  }

  console.log(`   → ${hrefs.length} posts encontrados`)

  let total = 0
  let novos = 0

  for (const postPath of hrefs.slice(0, 15)) {
    try {
      // Acessa o post para pegar o perfil do dono
      const postUrl = `https://www.instagram.com${postPath}`
      await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForTimeout(2000)

      // Pega o handle do autor do post
      const autorLink = await page
        .locator('a[href*="/"][role="link"]')
        .first()
        .getAttribute('href')
        .catch(() => null)

      if (!autorLink || autorLink.includes('/p/') || autorLink.includes('/explore/')) continue

      const handle = autorLink.replace(/\//g, '')
      if (!handle || handle.length < 2) continue

      const profileUrl = `https://www.instagram.com/${handle}/`

      // Acessa o perfil
      await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 15000 })
      await page.waitForTimeout(2000)

      const titulo = await page.title()
      const bio    = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '')
      const nome   = titulo.split('•')[0].trim().replace('@', '').split('(')[0].trim() || handle

      const telefone    = bio ? extrairTelefone(bio) : null
      const seguidores  = bio ? extrairSeguidores(bio) : null

      // Verifica se tem link externo na bio (site real)
      const linkNaBio = await page
        .locator('a[href*="http"]')
        .first()
        .getAttribute('href')
        .catch(() => null)

      const temSite = !!(
        linkNaBio &&
        !linkNaBio.includes('instagram.com') &&
        !linkNaBio.includes('linktree') &&
        !linkNaBio.includes('linktr.ee') &&
        !linkNaBio.includes('bio.link')
      )

      // Qualificação por tipo
      const qualificado =
        tipo === 'lp'       ? !temSite    : // sem site = dor clara
        tipo === 'shopify'  ? !temSite    : // sem loja online
                              true          // agendapro: todos qualificam

      if (!qualificado) {
        console.log(`   ⏭  @${handle} — já tem site/loja`)
        continue
      }

      // Categoria = hashtag sem "palmas" no final
      const categoria = hashtag.replace(/palmas$/i, '').replace(/[0-9]/g, '').trim()

      const mensagem =
        tipo === 'lp'       ? gerarMensagemLP(nome, categoria)
        : tipo === 'shopify'  ? gerarMensagemShopify(nome, categoria)
                              : gerarMensagemAgendaPRO(nome, categoria)

      const score = calcularScore({
        telefone,
        instagram: `@${handle}`,
        instagram_seguidores: seguidores,
        tem_site: temSite,
        tipo,
      })

      const id = inserirLead({
        nome,
        categoria,
        tipo,
        telefone:             telefone ?? undefined,
        instagram:            `@${handle}`,
        instagram_url:        profileUrl,
        instagram_bio:        bio ?? undefined,
        instagram_seguidores: seguidores ?? undefined,
        tem_site:             temSite,
        fonte:                'instagram',
        mensagem,
        score,
      })

      total++
      if (id) {
        novos++
        console.log(`   ✅ @${handle} | ${nome} | ${telefone ?? 'sem tel'} | score ${score}`)
      } else {
        console.log(`   ↩  @${handle} — já existe no banco`)
      }

      // Pausa entre perfis para não ser bloqueado
      await page.waitForTimeout(2000)

    } catch {
      // Post/perfil sem dados suficientes — pula
    }
  }

  registrarBusca({ query: `#${hashtag}`, tipo, fonte: 'instagram', total, novos })
  console.log(`   📊 Total: ${total} | Novos qualificados: ${novos}`)

  return { total, novos }
}

// ── Execução ──────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const tipoArg = args.find(a => a.startsWith('--tipo='))?.split('=')[1]
               || (args[args.indexOf('--tipo') + 1])
               || 'lp'

  const hashtagArg = args.find(a => a.startsWith('--hashtag='))?.split('=')[1]
                  || (args[args.indexOf('--hashtag') + 1])

  const tipo = (['shopify', 'agendapro'].includes(tipoArg)
    ? tipoArg
    : 'lp') as 'lp' | 'shopify' | 'agendapro'

  const hashtags = hashtagArg
    ? [hashtagArg]
    : tipo === 'lp'
      ? HASHTAGS_INSTAGRAM_LP
      : tipo === 'shopify'
        ? HASHTAGS_INSTAGRAM_SHOPIFY
        : HASHTAGS_INSTAGRAM_AGENDAPRO

  console.log(`\n🚀 radarPRO — Instagram Scraper`)
  console.log(`   Modo: ${tipo.toUpperCase()}`)
  console.log(`   Hashtags: ${hashtags.length}`)
  console.log('─'.repeat(50))
  console.log('   ⚠️  Instagram pode pedir login — se travar, use conta logada')

  const browser = await chromium.launch({ headless: false }) // headless: false para Instagram (anti-bot)
  const context = await browser.newContext({
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  })
  const page = await context.newPage()

  // Fecha popups de login se aparecer
  page.on('dialog', dialog => dialog.dismiss().catch(() => {}))

  let totalGeral = 0
  let novosGeral = 0

  for (const hashtag of hashtags) {
    try {
      const { total, novos } = await scrapeHashtag(hashtag, tipo, page)
      totalGeral += total
      novosGeral += novos
    } catch (err: any) {
      console.log(`   ❌ Erro em #${hashtag}: ${err.message}`)
    }
    // Pausa entre hashtags para não ser bloqueado
    await new Promise(r => setTimeout(r, 5000))
  }

  await browser.close()

  console.log('\n' + '─'.repeat(50))
  console.log(`✅ Busca concluída`)
  console.log(`   Encontrados: ${totalGeral}`)
  console.log(`   Novos leads qualificados: ${novosGeral}`)

  const stats = estatisticas()
  console.log(`\n📊 Base total:`)
  console.log(`   LP:        ${stats.lp} leads`)
  console.log(`   Shopify:   ${stats.shopify} leads`)
  console.log(`   AgendaPRO: ${stats.agendapro} leads`)
  console.log(`   Total:     ${stats.total} leads`)
}

main().catch(console.error)
