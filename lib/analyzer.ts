import { chromium } from 'playwright'
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
  diagnostico: string[]          // lista de observações
  mensagem_lp: string
  mensagem_shopify: string
  mensagem_agendapro: string
  raw_url: string
}

// ── Detectores ────────────────────────────────────────────────────────────────

function isInstagram(url: string) {
  return url.includes('instagram.com')
}
function isGoogleMaps(url: string) {
  return url.includes('google.com/maps') || url.includes('maps.google') || url.includes('goo.gl/maps')
}
function isWhatsApp(url: string) {
  return url.includes('wa.me') || url.includes('whatsapp.com')
}

function temEcommerce(texto: string): boolean {
  const kw = ['shopify', 'nuvemshop', 'loja integrada', 'mercado shops', 'adicionar ao carrinho', 'comprar agora', 'carrinho', 'checkout', 'frete grátis']
  return kw.some(k => texto.toLowerCase().includes(k))
}

function temSistemaAgendamento(texto: string): boolean {
  const kw = ['agendar', 'agendamento', 'marcar horário', 'reservar', 'calendly', 'simplybook', 'book', 'appointment']
  return kw.some(k => texto.toLowerCase().includes(k))
}

// ── Scraper Instagram ─────────────────────────────────────────────────────────

async function scrapeInstagram(url: string, page: any): Promise<Partial<AnaliseResult>> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(2000)

  const nome = await page.title().then((t: string) => t.split('•')[0].trim().replace('@', '').split('(')[0].trim())
  const bio  = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '')
  const handle = url.split('instagram.com/')[1]?.replace('/', '') ?? ''

  // Tenta pegar telefone da bio
  const telMatch = bio?.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
  const telefone = telMatch ? telMatch[0].replace(/\s/g, '') : null

  // Tenta pegar seguidores do meta
  const segMatch = bio?.match(/(\d[\d,.]+)\s*(seguidores|followers)/i)
  const seguidores = segMatch ? segMatch[1] : null

  // Verifica se tem link externo na bio
  const linkNaBio = await page.locator('a[href*="http"]').first().getAttribute('href').catch(() => null)
  const temSite = !!(linkNaBio && !linkNaBio.includes('instagram.com') && !linkNaBio.includes('linktree') && !linkNaBio.includes('linktr.ee'))

  return {
    nome: nome || handle,
    instagram: `@${handle}`,
    instagram_url: url,
    instagram_bio: bio ?? null,
    instagram_seguidores: seguidores,
    telefone,
    tem_site: temSite,
    fonte: 'instagram',
  }
}

// ── Scraper Google Maps ───────────────────────────────────────────────────────

async function scrapeGoogleMaps(url: string, page: any): Promise<Partial<AnaliseResult>> {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForTimeout(2000)

  const nome     = await page.locator('h1').first().textContent().catch(() => '')
  const telefone = await page.locator('[data-tooltip="Copiar número de telefone"]').textContent().catch(() => null)
  const siteUrl  = await page.locator('a[data-item-id="authority"]').getAttribute('href').catch(() => null)
  const endereco = await page.locator('[data-item-id="address"] .fontBodyMedium').textContent().catch(() => null)
  const notaText = await page.locator('.MW4etd').first().textContent().catch(() => null)
  const avalText = await page.locator('.UY7F9').first().textContent().catch(() => null)

  const nota = notaText ? parseFloat(notaText.replace(',', '.')) : null
  const numAval = avalText ? parseInt(avalText.replace(/\D/g, '')) : 0

  // Tenta achar Instagram no painel
  const igLink = await page.locator('a[href*="instagram.com"]').first().getAttribute('href').catch(() => null)
  const igHandle = igLink ? '@' + igLink.split('instagram.com/')[1]?.replace('/', '') : null

  // Categoria
  const categoria = await page.locator('.DkEaL').first().textContent().catch(() => '')

  const temSite = !!(siteUrl && !siteUrl.includes('instagram.com') && !siteUrl.includes('facebook.com'))

  return {
    nome: nome?.trim() ?? '',
    categoria: categoria?.trim() ?? '',
    telefone: telefone?.replace(/\s/g, '') ?? null,
    site: siteUrl,
    endereco,
    nota,
    num_avaliacoes: numAval,
    instagram: igHandle,
    instagram_url: igLink,
    tem_site: temSite,
    fonte: 'google_maps',
  }
}

// ── Scraper genérico ──────────────────────────────────────────────────────────

async function scrapeGenerico(url: string, page: any): Promise<Partial<AnaliseResult>> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(1500)

  const titulo   = await page.title()
  const desc     = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '')
  const conteudo = await page.locator('body').textContent().catch(() => '')

  // Tenta achar telefone na página
  const telMatch = conteudo?.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
  const telefone = telMatch ? telMatch[0].replace(/\s/g, '') : null

  // Tenta achar Instagram
  const igLink = await page.locator('a[href*="instagram.com"]').first().getAttribute('href').catch(() => null)
  const igHandle = igLink ? '@' + igLink.split('instagram.com/')[1]?.replace('/', '') : null

  const ecommerce   = temEcommerce(conteudo ?? '')
  const agendamento = temSistemaAgendamento(conteudo ?? '')

  return {
    nome: titulo?.split('|')[0]?.split('-')[0]?.trim() ?? '',
    site: url,
    telefone,
    instagram: igHandle,
    instagram_url: igLink,
    tem_site: true,
    tem_ecommerce: ecommerce,
    tem_agendamento: agendamento,
    fonte: 'link_manual',
  }
}

// ── Gerador de diagnóstico ────────────────────────────────────────────────────

function gerarDiagnostico(dados: Partial<AnaliseResult>): string[] {
  const obs: string[] = []

  if (!dados.telefone)         obs.push('⚠️ Sem telefone encontrado — tente buscar no Instagram ou Google')
  if (!dados.instagram)        obs.push('❌ Sem Instagram identificado')
  if (dados.instagram)         obs.push('✅ Tem Instagram ativo')
  if (!dados.tem_site)         obs.push('🎯 Não tem site profissional — prospect quente para LP')
  if (dados.tem_site && !dados.tem_ecommerce) obs.push('🎯 Tem site mas sem loja online — prospect para Shopify')
  if (!dados.tem_agendamento)  obs.push('🎯 Sem sistema de agendamento — prospect para AgendaPRO')
  if (dados.nota && dados.nota >= 4.0) obs.push(`⭐ Nota ${dados.nota} no Google — negócio consolidado`)
  if (dados.num_avaliacoes && dados.num_avaliacoes >= 20) obs.push(`💬 ${dados.num_avaliacoes} avaliações — negócio ativo`)
  if (dados.instagram_seguidores) obs.push(`👥 ${dados.instagram_seguidores} seguidores no Instagram`)

  return obs
}

// ── Função principal ──────────────────────────────────────────────────────────

export async function analisarLink(url: string): Promise<AnaliseResult> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  let dados: Partial<AnaliseResult> = {}

  try {
    if (isInstagram(url))   dados = await scrapeInstagram(url, page)
    else if (isGoogleMaps(url)) dados = await scrapeGoogleMaps(url, page)
    else                    dados = await scrapeGenerico(url, page)
  } finally {
    await browser.close()
  }

  const nome      = dados.nome || 'Lead sem nome'
  const categoria = dados.categoria || 'Não identificado'

  // Calcula score para os 3 tipos
  const base = { ...dados, nota: dados.nota ?? null, num_avaliacoes: dados.num_avaliacoes ?? null }

  const score_lp        = calcularScore({ ...base, tipo: 'lp' })
  const score_shopify   = calcularScore({ ...base, tipo: 'shopify' })
  const score_agendapro = calcularScore({ ...base, tipo: 'agendapro' })

  // Detecta tipo mais provável
  const maxScore = Math.max(score_lp, score_shopify, score_agendapro)
  const tipo_detectado: 'lp' | 'shopify' | 'agendapro' =
    maxScore === score_agendapro ? 'agendapro' :
    maxScore === score_shopify   ? 'shopify'   : 'lp'

  const diagnostico = gerarDiagnostico(dados)

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
    diagnostico,
    mensagem_lp:        gerarMensagemLP(nome, categoria),
    mensagem_shopify:   gerarMensagemShopify(nome, categoria),
    mensagem_agendapro: gerarMensagemAgendaPRO(nome, categoria),
    raw_url: url,
  }
}
