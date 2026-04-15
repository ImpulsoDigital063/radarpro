/**
 * radarPRO — Analisador de links (axios + cheerio, sem Playwright)
 * Funciona em Vercel serverless
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import { calcularScore } from './score'
import { gerarMensagemLP, gerarMensagemShopify, gerarMensagemAgendaPRO } from './mensagens'

export type AnaliseResult = {
  nome: string
  categoria: string
  telefone: string | null
  instagram: string | null
  instagram_url: string | null
  instagram_bio: string | null
  instagram_seguidores: string | null
  site: string | null
  endereco: string | null
  nota: number | null
  num_avaliacoes: number | null
  tem_site: boolean
  tem_ecommerce: boolean
  tem_agendamento: boolean
  fonte: string
  tipo_detectado: 'lp' | 'shopify' | 'agendapro'
  score_lp: number
  score_shopify: number
  score_agendapro: number
  diagnostico: string[]
  mensagem_lp: string
  mensagem_shopify: string
  mensagem_agendapro: string
  raw_url: string
}

// ── Detectores ────────────────────────────────────────────────────────────────

function isInstagram(url: string) { return url.includes('instagram.com') }
function isGoogleMaps(url: string) {
  return url.includes('google.com/maps') || url.includes('maps.google') || url.includes('goo.gl/maps')
}

function temEcommerce(texto: string): boolean {
  const kw = ['shopify', 'nuvemshop', 'loja integrada', 'mercado shops', 'adicionar ao carrinho', 'comprar agora', 'carrinho', 'checkout', 'frete grátis']
  return kw.some(k => texto.toLowerCase().includes(k))
}

function temSistemaAgendamento(texto: string): boolean {
  const kw = ['agendar', 'agendamento', 'marcar horário', 'reservar', 'calendly', 'simplybook', 'book', 'appointment']
  return kw.some(k => texto.toLowerCase().includes(k))
}

async function fetchHtml(url: string): Promise<string> {
  const { data } = await axios.get(url, {
    timeout: 12000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
    maxRedirects: 5,
  })
  return typeof data === 'string' ? data : JSON.stringify(data)
}

// ── Scraper Instagram (meta tags) ─────────────────────────────────────────────

async function scrapeInstagram(url: string): Promise<Partial<AnaliseResult>> {
  const html = await fetchHtml(url)
  const $    = cheerio.load(html)

  const bio    = $('meta[name="description"]').attr('content') ?? ''
  const titulo = $('title').text()
  const handle = (url.split('instagram.com/')[1]?.replace(/\/$/, '').split('?')[0] ?? '').replace(/\/.*$/, '')
  const nomeDoTitulo = titulo.split('•')[0].trim().replace('@', '').split('(')[0].trim()
  // og:title genérico do IG vem literalmente como "Instagram" → cair no handle
  const GENERICOS = new Set(['Instagram', 'Instagram Login', 'Login • Instagram', ''])
  const nome   = (GENERICOS.has(nomeDoTitulo) ? handle : nomeDoTitulo) || handle || 'Perfil Instagram'

  const telMatch  = bio.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
  const telefone  = telMatch ? telMatch[0].replace(/\s/g, '') : null
  const segMatch  = bio.match(/(\d[\d,.]+)\s*(seguidores|followers)/i)
  const seguidores = segMatch ? segMatch[1] : null

  return {
    nome,
    instagram:            `@${handle}`,
    instagram_url:        url,
    instagram_bio:        bio || null,
    instagram_seguidores: seguidores,
    telefone,
    tem_site:             false,
    fonte:                'instagram',
  }
}

// ── Scraper Google Maps (extrai do HTML estático) ─────────────────────────────

async function scrapeGoogleMaps(url: string): Promise<Partial<AnaliseResult>> {
  // Google Maps precisa de JS — extrai o que dá do HTML estático
  const html = await fetchHtml(url).catch(() => '')
  const $    = cheerio.load(html)

  const titulo = $('title').text()
  const nome   = titulo.split('-')[0].trim() || titulo.split('·')[0].trim()

  // Tenta extrair telefone do HTML bruto
  const telMatch = html.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
  const telefone = telMatch ? telMatch[0].replace(/\s/g, '') : null

  // Tenta nota
  const notaMatch = html.match(/"aggregateRating"[^}]*"ratingValue":"?(\d+\.?\d*)"?/i)
  const nota = notaMatch ? parseFloat(notaMatch[1]) : null

  return {
    nome:      nome || 'Negócio no Google Maps',
    telefone,
    nota,
    site:      url,
    tem_site:  false,
    fonte:     'google_maps',
  }
}

// ── Scraper genérico (sites, landing pages) ───────────────────────────────────

async function scrapeGenerico(url: string): Promise<Partial<AnaliseResult>> {
  const html = await fetchHtml(url)
  const $    = cheerio.load(html)

  const titulo   = $('title').text()
  const descMeta = $('meta[name="description"]').attr('content') ?? ''
  const ogTitle  = $('meta[property="og:title"]').attr('content') ?? ''
  const conteudo = $('body').text().replace(/\s+/g, ' ')

  const telMatch = conteudo.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
  const telefone = telMatch ? telMatch[0].replace(/\s/g, '') : null

  // Instagram links
  const igLink = $('a[href*="instagram.com"]').first().attr('href') ?? null
  const igHandle = igLink ? '@' + igLink.split('instagram.com/')[1]?.replace(/\/$/, '') : null

  const ecommerce   = temEcommerce(conteudo)
  const agendamento = temSistemaAgendamento(conteudo)

  return {
    nome:          (ogTitle || titulo).split('|')[0].split('-')[0].trim(),
    site:          url,
    telefone,
    instagram:     igHandle,
    instagram_url: igLink,
    tem_site:      true,
    tem_ecommerce: ecommerce,
    tem_agendamento: agendamento,
    fonte:         'link_manual',
  }
}

// ── Diagnóstico ───────────────────────────────────────────────────────────────

function gerarDiagnostico(dados: Partial<AnaliseResult>): string[] {
  const obs: string[] = []
  if (!dados.telefone)        obs.push('⚠️ Sem telefone encontrado — busque no Instagram ou Google')
  if (!dados.instagram)       obs.push('❌ Sem Instagram identificado')
  else                        obs.push('✅ Tem Instagram ativo')
  if (!dados.tem_site)        obs.push('🎯 Sem site profissional — prospect quente para LP')
  if (dados.tem_site && !dados.tem_ecommerce) obs.push('🎯 Tem site mas sem loja — prospect para Shopify')
  if (!dados.tem_agendamento) obs.push('🎯 Sem sistema de agendamento — prospect para AgendaPRO')
  if (dados.nota && dados.nota >= 4.0) obs.push(`⭐ Nota ${dados.nota} no Google — negócio consolidado`)
  if (dados.num_avaliacoes && dados.num_avaliacoes >= 20) obs.push(`💬 ${dados.num_avaliacoes} avaliações — negócio ativo`)
  if (dados.instagram_seguidores) obs.push(`👥 ${dados.instagram_seguidores} seguidores no Instagram`)
  return obs
}

// ── Função principal ──────────────────────────────────────────────────────────

export async function analisarLink(url: string): Promise<AnaliseResult> {
  let dados: Partial<AnaliseResult> = {}

  if (isInstagram(url))       dados = await scrapeInstagram(url)
  else if (isGoogleMaps(url)) dados = await scrapeGoogleMaps(url)
  else                        dados = await scrapeGenerico(url)

  const nome      = dados.nome || 'Lead sem nome'
  const categoria = dados.categoria || 'Não identificado'
  const base      = { ...dados, nota: dados.nota ?? null, num_avaliacoes: dados.num_avaliacoes ?? null }

  const score_lp        = calcularScore({ ...base, tipo: 'lp' })
  const score_shopify   = calcularScore({ ...base, tipo: 'shopify' })
  const score_agendapro = calcularScore({ ...base, tipo: 'agendapro' })

  const maxScore = Math.max(score_lp, score_shopify, score_agendapro)
  const tipo_detectado: 'lp' | 'shopify' | 'agendapro' =
    maxScore === score_agendapro ? 'agendapro' :
    maxScore === score_shopify   ? 'shopify'   : 'lp'

  return {
    nome,
    categoria,
    telefone:             dados.telefone ?? null,
    instagram:            dados.instagram ?? null,
    instagram_url:        dados.instagram_url ?? null,
    instagram_bio:        dados.instagram_bio ?? null,
    instagram_seguidores: dados.instagram_seguidores ?? null,
    site:                 dados.site ?? null,
    endereco:             dados.endereco ?? null,
    nota:                 dados.nota ?? null,
    num_avaliacoes:       dados.num_avaliacoes ?? null,
    tem_site:             dados.tem_site ?? false,
    tem_ecommerce:        dados.tem_ecommerce ?? false,
    tem_agendamento:      dados.tem_agendamento ?? false,
    fonte:                dados.fonte ?? 'link_manual',
    tipo_detectado,
    score_lp,
    score_shopify,
    score_agendapro,
    diagnostico:          gerarDiagnostico(dados),
    mensagem_lp:          gerarMensagemLP(nome, categoria),
    mensagem_shopify:     gerarMensagemShopify(nome, categoria),
    mensagem_agendapro:   gerarMensagemAgendaPRO(nome, categoria),
    raw_url:              url,
  }
}
