/**
 * radarPRO — COLETOR DE AVALIAÇÕES (14/07/2026)
 *
 * POR QUE: pra personalizar a mensagem de verdade, eu preciso ter LIDO alguma
 * coisa sobre o negócio. O Instagram fechou (devolve página vazia sem login) e
 * a bio nunca foi capturada. Sobrou a fonte melhor: o TEXTO das avaliações do
 * Google — onde os clientes DELA escrevem, com as próprias palavras, o que está
 * quebrado no negócio dela.
 *
 * "não atende o telefone" · "demorei 40 min esperando" · "difícil marcar" —
 * isso é munição que nenhuma bio de Instagram daria.
 *
 * Uso:
 *   npx tsx scripts/coletar-reviews.ts --limite=40   → os 40 com mais avaliações
 *   npx tsx scripts/coletar-reviews.ts --todos
 *
 * ⚠️ ARMADILHA (já queimou antes): NUNCA declare função dentro de page.evaluate()
 * — o tsx/esbuild injeta o helper __name e quebra com "__name is not defined".
 * Tudo inline.
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { chromium } from 'playwright'
import { getClient } from '../lib/db'

const args = process.argv.slice(2)
const TODOS = args.includes('--todos')
const REFAZER = args.includes('--refazer')
const LIMITE = Number(args.find((a) => a.startsWith('--limite='))?.split('=')[1] ?? 40)

async function main() {
  const db = getClient()

  // colunas novas (idempotente)
  for (const sql of [
    `ALTER TABLE leads ADD COLUMN reviews_texto TEXT`,
    `ALTER TABLE leads ADD COLUMN reviews_coletadas_em TEXT`,
  ]) {
    try { await db.execute(sql) } catch { /* já existe */ }
  }

  const r = await db.execute(`
    SELECT id, nome, endereco, num_avaliacoes
    FROM leads
    WHERE status != 'arquivado' AND telefone IS NOT NULL
      AND num_avaliacoes > 0 ${REFAZER ? '' : 'AND reviews_texto IS NULL'}
    ORDER BY num_avaliacoes DESC
    ${TODOS ? '' : `LIMIT ${LIMITE}`}
  `)

  const leads = r.rows as any[]
  console.log(`coletando avaliações de ${leads.length} negócios...\n`)

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    locale: 'pt-BR',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  })
  const page = await ctx.newPage()

  let ok = 0
  let vazio = 0

  for (const [i, lead] of leads.entries()) {
    const busca = `${lead.nome} ${lead.endereco ?? 'Palmas TO'}`
    process.stdout.write(`[${i + 1}/${leads.length}] ${String(lead.nome).slice(0, 34).padEnd(35)}`)

    try {
      await page.goto(
        `https://www.google.com/maps/search/${encodeURIComponent(busca)}?hl=pt-BR`,
        { waitUntil: 'domcontentloaded', timeout: 45000 }
      )
      await page.waitForTimeout(3500)

      // Se caiu na lista (e não direto na ficha), abre o 1º resultado
      const naLista = await page.locator('a.hfpxzc').first().isVisible().catch(() => false)
      if (naLista) {
        await page.locator('a.hfpxzc').first().click().catch(() => {})
        await page.waitForTimeout(3000)
      }

      // Abre a aba de avaliações
      const abaReviews = page
        .locator('button[role="tab"][aria-label*="Avaliações"], button[jsaction*="reviewChart"]')
        .first()
      if (await abaReviews.isVisible().catch(() => false)) {
        await abaReviews.click().catch(() => {})
        await page.waitForTimeout(2500)
      }

      // Rola o painel de avaliações pra carregar mais
      for (let s = 0; s < 4; s++) {
        await page.evaluate(() => {
          const painel = document.querySelector('div[role="main"] div[tabindex="-1"]')
            ?? document.querySelector('div.m6QErb[aria-label]')
          if (painel) painel.scrollTop = painel.scrollHeight
        })
        await page.waitForTimeout(1200)
      }

      // Expande os "Mais" e extrai — TUDO INLINE (sem declarar função)
      await page.locator('button[aria-label="Ver mais"], button:has-text("Mais")').first()
        .click({ timeout: 1500 }).catch(() => {})

      const reviews = (await page.evaluate(() => {
        const out: { nota: number | null; texto: string }[] = []
        const cards = Array.from(document.querySelectorAll('div[data-review-id]'))
        for (const c of cards) {
          const el = c.querySelector('span.wiI7pd') ?? c.querySelector('[class*="MyEned"]')
          const texto = el && el.textContent ? el.textContent.trim() : ''
          if (!texto || texto.length < 12) continue
          const estrelaEl = c.querySelector('span[role="img"][aria-label*="estrela"]')
          const aria = estrelaEl ? estrelaEl.getAttribute('aria-label') ?? '' : ''
          const mm = aria.match(/(\d)/)
          out.push({ nota: mm ? parseInt(mm[1]) : null, texto: texto.slice(0, 400) })
        }
        return out
      })) as { nota: number | null; texto: string }[]

      // o Maps renderiza cada review 2x (lista + painel) — dedup pelo texto
      const vistos = new Set<string>()
      const unicos = reviews.filter((v) => {
        const k = v.texto.slice(0, 60)
        if (vistos.has(k)) return false
        vistos.add(k)
        return true
      })

      if (!unicos.length) {
        vazio++
        console.log('— sem texto')
        continue
      }

      // guarda as piores primeiro: a DOR é o que vende
      unicos.sort((a, b) => (a.nota ?? 5) - (b.nota ?? 5))
      const payload = JSON.stringify(unicos.slice(0, 25))

      await db.execute({
        sql: `UPDATE leads SET reviews_texto = ?, reviews_coletadas_em = datetime('now','localtime') WHERE id = ?`,
        args: [payload, lead.id],
      })

      const ruins = unicos.filter((x) => (x.nota ?? 5) <= 3).length
      ok++
      console.log(`✅ ${unicos.length} avaliações${ruins ? ` · ⚠️ ${ruins} negativa(s)` : ''}`)
    } catch (e: any) {
      console.log(`✗ ${String(e.message).slice(0, 40)}`)
    }

    await page.waitForTimeout(900)
  }

  await browser.close()
  console.log(`\n✅ ${ok} com avaliações · ${vazio} sem texto`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
