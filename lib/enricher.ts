/**
 * radarPRO — Enriquecedor automático de leads
 * Busca Instagram do negócio via Google e extrai dados do perfil
 */

import { chromium } from 'playwright'
import { getClient } from './db'

type EnrichResult = {
  instagram:            string | null
  instagram_url:        string | null
  instagram_bio:        string | null
  instagram_seguidores: string | null
  telefone:             string | null
}

// ── Busca Instagram via Google Maps ──────────────────────────────────────────

async function buscarInstagramNoMaps(mapsUrl: string, page: any): Promise<string | null> {
  try {
    await page.goto(mapsUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    const igUrl = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a')).map((a: any) => a.href as string)
      for (const href of allLinks) {
        if (!href) continue
        if (href.includes('instagram.com/') &&
            !href.includes('/p/') && !href.includes('/explore/') &&
            !href.includes('/reel/') && !href.includes('/stories/') &&
            !href.includes('instagram.com/instagram') &&
            !href.includes('instagram.com/accounts') &&
            href.match(/instagram\.com\/[a-zA-Z0-9_.]{2,30}\/?/)) {
          return href.split('?')[0].replace(/\/$/, '')
        }
      }
      return null
    })
    return igUrl
  } catch {
    return null
  }
}

// ── Busca direto na pesquisa do Instagram ────────────────────────────────────

async function buscarInstagramDireto(nome: string, page: any): Promise<string | null> {
  try {
    const query = nome.replace(/[-|–—]/g, ' ').replace(/\s+/g, ' ').trim().split(' ').slice(0, 3).join(' ')
    await page.goto(
      `https://www.instagram.com/web/search/topsearch/?query=${encodeURIComponent(query)}`,
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    )
    await page.waitForTimeout(1500)

    const json = await page.evaluate(() => {
      try { return JSON.parse(document.body.innerText) } catch { return null }
    })

    if (!json?.users?.length) return null

    const user = json.users[0]?.user
    if (!user?.username) return null

    return `https://www.instagram.com/${user.username}`
  } catch {
    return null
  }
}

// ── Extrai dados do perfil Instagram ─────────────────────────────────────────

async function extrairDadosInstagram(url: string, page: any): Promise<Partial<EnrichResult>> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(2000)

  const titulo = await page.title()
  const bio    = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '')

  const handle = url.split('instagram.com/')[1]?.replace(/\/$/, '') ?? ''

  const telMatch = bio?.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)
  const telefone = telMatch ? telMatch[0].replace(/\s/g, '') : null

  const segMatch = bio?.match(/(\d[\d.,]+)\s*(seguidores|followers)/i)
  const seguidores = segMatch ? segMatch[1] : null

  return {
    instagram:            `@${handle}`,
    instagram_url:        url,
    instagram_bio:        bio ?? null,
    instagram_seguidores: seguidores,
    telefone,
  }
}

// ── Enriquece um lead pelo id ─────────────────────────────────────────────────

export async function enriquecerLead(leadId: number): Promise<EnrichResult | null> {
  const db = getClient()
  const result = await db.execute({ sql: 'SELECT * FROM leads WHERE id = ?', args: [leadId] })
  const lead = result.rows[0] as any
  if (!lead) return null

  if (lead.instagram) return null

  console.log(`\n🔍 Enriquecendo: ${lead.nome}`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  try {
    let igUrl: string | null = null
    if (lead.site) {
      igUrl = await buscarInstagramNoMaps(lead.site, page)
    }

    if (!igUrl) {
      igUrl = await buscarInstagramDireto(lead.nome, page)
    }

    if (!igUrl) {
      console.log(`   ❌ Instagram não encontrado`)
      return null
    }

    const dados = await extrairDadosInstagram(igUrl, page)

    await db.execute({
      sql: `UPDATE leads SET
        instagram            = ?,
        instagram_url        = ?,
        instagram_bio        = ?,
        instagram_seguidores = ?,
        telefone             = COALESCE(telefone, ?),
        atualizado_em        = datetime('now','localtime')
      WHERE id = ?`,
      args: [
        dados.instagram ?? null,
        dados.instagram_url ?? null,
        dados.instagram_bio ?? null,
        dados.instagram_seguidores ?? null,
        dados.telefone ?? null,
        leadId,
      ],
    })

    console.log(`   ✅ ${dados.instagram} | ${dados.instagram_seguidores ?? '?'} seguidores`)
    return dados as EnrichResult

  } catch (err: any) {
    console.log(`   ❌ Erro: ${err.message?.slice(0, 80)}`)
    return null
  } finally {
    await browser.close()
  }
}

// ── Enriquece todos os leads sem Instagram ────────────────────────────────────

export async function enriquecerTodos(tipo?: string) {
  const db = getClient()
  const where = tipo ? `WHERE instagram IS NULL AND tipo = '${tipo}'` : `WHERE instagram IS NULL`
  const result = await db.execute({ sql: `SELECT id, nome FROM leads ${where} ORDER BY score DESC`, args: [] })
  const leads = result.rows as any[]

  console.log(`\n🚀 Enriquecimento em massa — ${leads.length} leads sem Instagram`)
  console.log('─'.repeat(50))

  let enriquecidos = 0
  for (const lead of leads) {
    const res = await enriquecerLead(lead.id)
    if (res?.instagram) enriquecidos++
    await new Promise(r => setTimeout(r, 2000))
  }

  console.log(`\n✅ ${enriquecidos} de ${leads.length} leads enriquecidos`)
}
