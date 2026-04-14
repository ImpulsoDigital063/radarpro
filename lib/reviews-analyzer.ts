/**
 * radarPRO — Leitor de avaliações do Google Maps
 * Raspa as avaliações do negócio e identifica padrões de dor
 */

import { chromium } from 'playwright'
import { GoogleGenerativeAI } from '@google/generative-ai'

function getGemini() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY não configurada')
  return new GoogleGenerativeAI(key)
}

export type AnaliseAvaliacoes = {
  total:          number
  media:          number
  dor_principal:  string   // maior reclamação recorrente
  elogio_principal: string // o que mais elogiam
  oportunidade:   string   // argumento de venda baseado nas avaliações
  avaliacoes:     string[] // textos das avaliações coletadas
}

export async function analisarAvaliacoesGMaps(mapsUrl: string, nome: string): Promise<AnaliseAvaliacoes> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  let avaliacoes: string[] = []
  let media = 0
  let total = 0

  try {
    await page.goto(mapsUrl, { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(3000)

    // Pega nota e total de avaliações
    const notaText = await page.locator('span[aria-hidden="true"]')
      .filter({ hasText: /^\d[,\.]\d$/ }).first().textContent().catch(() => null)
    const avalText = await page.locator('span[aria-label*="avaliações"]')
      .first().getAttribute('aria-label').catch(() => null)

    media = notaText ? parseFloat(notaText.replace(',', '.')) : 0
    total = avalText ? parseInt(avalText.replace(/\D/g, '')) : 0

    // Clica na aba de avaliações
    const botaoAval = page.locator('button[aria-label*="valiaç"]').first()
    if (await botaoAval.count() > 0) {
      await botaoAval.click()
      await page.waitForTimeout(2000)
    }

    // Expande avaliações longas clicando em "mais"
    const botoesMore = await page.locator('button[aria-label="Ver mais"]').all()
    for (const btn of botoesMore.slice(0, 5)) {
      await btn.click().catch(() => {})
      await page.waitForTimeout(300)
    }

    // Scroll para carregar mais avaliações
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 1000))
      await page.waitForTimeout(1000)
    }

    // Coleta textos das avaliações
    const textos = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[data-review-id] span.wiI7pd'))
      return els.map(el => el.textContent?.trim()).filter(Boolean).slice(0, 20) as string[]
    })

    avaliacoes = textos

  } finally {
    await browser.close()
  }

  if (avaliacoes.length === 0) {
    return {
      total, media,
      dor_principal:    'Não foi possível coletar avaliações',
      elogio_principal: 'Verificar manualmente',
      oportunidade:     'Visitar o perfil do Google e ler as avaliações',
      avaliacoes:       [],
    }
  }

  // Manda para Gemini analisar
  const genAI = getGemini()
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Analise as avaliações do Google do negócio "${nome}" e identifique padrões.

Nota média: ${media} (${total} avaliações)

Avaliações dos clientes:
${avaliacoes.map((a, i) => `${i + 1}. "${a}"`).join('\n')}

Com base nisso, identifique:
1. Qual é a maior DOR ou reclamação recorrente? (ex: "difícil de agendar", "não respondem no WhatsApp")
2. O que mais elogiam? (ex: "atendimento excelente", "resultado incrível")
3. Qual oportunidade de venda isso gera para nós? (ex: "um sistema de agendamento online resolveria a reclamação de espera")

Responda EXATAMENTE neste JSON (sem markdown):
{
  "dor_principal": "<reclamação mais recorrente em 1 frase>",
  "elogio_principal": "<elogio mais frequente em 1 frase>",
  "oportunidade": "<como usamos isso para vender nosso produto em 1 frase direta>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    const data = JSON.parse(texto)
    return { total, media, avaliacoes, ...data }
  } catch {
    return { total, media, avaliacoes,
      dor_principal:    'Análise não disponível',
      elogio_principal: 'Verificar manualmente',
      oportunidade:     avaliacoes[0] ?? 'Sem avaliações',
    }
  }
}
