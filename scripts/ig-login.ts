/**
 * radarPRO — Login no Instagram (1 vez só)
 *
 * Abre Chromium, você loga manualmente no Instagram,
 * aperta ENTER no terminal → salva cookies em .ig-session.json
 *
 * Uso:
 *   npm run ig:login
 *
 * Depois disso, scrape-instagram.ts reusa a session salva.
 */

import { chromium } from 'playwright'
import { resolve } from 'path'
import { existsSync } from 'fs'

const SESSION_PATH = resolve(process.cwd(), '.ig-session.json')

async function main() {
  console.log('\n🔐 radarPRO — Login Instagram')
  console.log('─'.repeat(50))

  if (existsSync(SESSION_PATH)) {
    console.log('⚠️  Já existe .ig-session.json — vamos sobrescrever.')
  }

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  })
  const page = await context.newPage()

  await page.goto('https://www.instagram.com/accounts/login/')

  console.log('\n✋ Faz o login no navegador que abriu.')
  console.log('   - Usa sua conta @impulsodigital063 ou equivalente')
  console.log('   - Se pedir 2FA, faz normal')
  console.log('   - Se aparecer "Salvar login?" → aperta "Não agora"')
  console.log('   - Quando estiver no feed/home do Instagram, volta aqui e aperta ENTER\n')

  // Espera ENTER no terminal
  await new Promise<void>(resolveP => {
    process.stdin.resume()
    process.stdin.once('data', () => resolveP())
  })

  // Salva cookies + localStorage
  await context.storageState({ path: SESSION_PATH })

  console.log(`\n✅ Sessão salva em ${SESSION_PATH}`)
  console.log('   A partir de agora, scrape-instagram.ts roda logado.')
  console.log('   Se algum dia pedir login de novo, roda npm run ig:login outra vez.\n')

  await browser.close()
  process.exit(0)
}

main().catch(err => {
  console.error('Erro:', err.message)
  process.exit(1)
})
