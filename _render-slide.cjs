const { chromium } = require('playwright')
;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => console.log('PAGEERR:', e.message))
  await page.goto(process.argv[2], { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(1500) // espera fontes
  await page.screenshot({ path: process.argv[3], fullPage: false, omitBackground: false })
  await browser.close()
})().catch(e => { console.error('FATAL:', e.message); process.exit(1) })
