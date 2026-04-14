/**
 * radarPRO — Analisador de site do lead
 * Visita o site, extrai conteúdo relevante e manda para o Gemini analisar
 */

import { chromium } from 'playwright'
import { analisarConteudoSite, AnaliseSite } from './gemini'

function isMapsUrl(url: string): boolean {
  return url.includes('google.com/maps') || url.includes('maps.google')
}

function isSocialUrl(url: string): boolean {
  return ['instagram.com', 'facebook.com', 'wa.me', 'whatsapp', 'linktr.ee'].some(d => url.includes(d))
}

export async function analisarSiteLead(siteUrl: string, nome: string): Promise<AnaliseSite> {
  if (isMapsUrl(siteUrl) || isSocialUrl(siteUrl)) {
    throw new Error('URL inválida para análise — use a URL do site real do cliente')
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(2000)

    // Extrai dados relevantes da página
    const dados = await page.evaluate(() => {
      const title       = document.title
      const metaDesc    = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
      const h1s         = Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim()).filter(Boolean).join(' | ')
      const h2s         = Array.from(document.querySelectorAll('h2')).slice(0, 5).map(h => h.textContent?.trim()).filter(Boolean).join(' | ')
      const bodyText    = document.body.innerText?.slice(0, 3000) ?? ''

      // Verifica indicadores de qualidade
      const temWhatsApp    = bodyText.toLowerCase().includes('whatsapp') || bodyText.includes('wa.me')
      const temTelefone    = !!bodyText.match(/\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}/)
      const temDepoimento  = ['depoimento', 'avaliação', 'cliente', 'resultado'].some(k => bodyText.toLowerCase().includes(k))
      const temCTA         = ['agendar', 'contratar', 'comprar', 'saiba mais', 'entre em contato', 'clique'].some(k => bodyText.toLowerCase().includes(k))
      const imagens        = document.querySelectorAll('img').length
      const temVideo       = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0

      return { title, metaDesc, h1s, h2s, bodyText, temWhatsApp, temTelefone, temDepoimento, temCTA, imagens, temVideo }
    })

    const conteudo = `
TÍTULO: ${dados.title}
META DESCRIÇÃO: ${dados.metaDesc}
H1: ${dados.h1s}
H2: ${dados.h2s}

INDICADORES:
- Tem botão WhatsApp: ${dados.temWhatsApp ? 'SIM' : 'NÃO'}
- Tem telefone visível: ${dados.temTelefone ? 'SIM' : 'NÃO'}
- Tem depoimentos/provas: ${dados.temDepoimento ? 'SIM' : 'NÃO'}
- Tem CTA claro: ${dados.temCTA ? 'SIM' : 'NÃO'}
- Número de imagens: ${dados.imagens}
- Tem vídeo: ${dados.temVideo ? 'SIM' : 'NÃO'}

TEXTO DA PÁGINA:
${dados.bodyText}
`

    return await analisarConteudoSite(siteUrl, conteudo, nome)

  } finally {
    await browser.close()
  }
}
