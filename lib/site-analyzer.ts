/**
 * radarPRO — Analisador de site do lead
 * Usa axios + cheerio (sem Playwright) — funciona na Vercel
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
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

  const { data: html } = await axios.get(siteUrl, {
    timeout: 12000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
    maxRedirects: 5,
  })

  const $ = cheerio.load(html)

  const title      = $('title').text().trim()
  const metaDesc   = $('meta[name="description"]').attr('content') ?? ''
  const h1s        = $('h1').map((_, el) => $(el).text().trim()).get().filter(Boolean).join(' | ')
  const h2s        = $('h2').slice(0, 5).map((_, el) => $(el).text().trim()).get().filter(Boolean).join(' | ')
  const bodyText   = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 3000)

  const temWhatsApp   = bodyText.toLowerCase().includes('whatsapp') || bodyText.includes('wa.me')
  const temTelefone   = !!bodyText.match(/\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}/)
  const temDepoimento = ['depoimento', 'avaliação', 'cliente', 'resultado'].some(k => bodyText.toLowerCase().includes(k))
  const temCTA        = ['agendar', 'contratar', 'comprar', 'saiba mais', 'entre em contato', 'clique'].some(k => bodyText.toLowerCase().includes(k))
  const imagens       = $('img').length
  const temVideo      = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0

  const conteudo = `
TÍTULO: ${title}
META DESCRIÇÃO: ${metaDesc}
H1: ${h1s}
H2: ${h2s}

INDICADORES:
- Tem botão WhatsApp: ${temWhatsApp ? 'SIM' : 'NÃO'}
- Tem telefone visível: ${temTelefone ? 'SIM' : 'NÃO'}
- Tem depoimentos/provas: ${temDepoimento ? 'SIM' : 'NÃO'}
- Tem CTA claro: ${temCTA ? 'SIM' : 'NÃO'}
- Número de imagens: ${imagens}
- Tem vídeo: ${temVideo ? 'SIM' : 'NÃO'}

TEXTO DA PÁGINA:
${bodyText}
`

  return await analisarConteudoSite(siteUrl, conteudo, nome)
}
