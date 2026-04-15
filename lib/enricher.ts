/**
 * radarPRO — Enriquecedor de leads (serverless / Vercel)
 * Busca Instagram via DuckDuckGo HTML + parse do perfil via og:description
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import { getClient } from './db'

type EnrichResult = {
  instagram:            string | null
  instagram_url:        string | null
  instagram_bio:        string | null
  instagram_seguidores: string | null
  telefone:             string | null
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Lista de paths inválidos (não são perfis reais)
const RESERVADOS = new Set([
  'p', 'explore', 'reel', 'reels', 'stories', 'accounts', 'about',
  'developer', 'legal', 'directory', 'web', 'instagram',
])

function extrairHandleDeUrl(raw: string): string | null {
  const m = raw.match(/instagram\.com\/([a-zA-Z0-9_.]{2,30})(?:\/|\?|$)/)
  if (!m) return null
  const handle = m[1]
  if (RESERVADOS.has(handle.toLowerCase())) return null
  return handle
}

async function buscarEmMecanismo(url: string): Promise<string | null> {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 12000,
      headers: {
        'User-Agent': UA,
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'Accept': 'text/html,application/xhtml+xml',
      },
      maxRedirects: 5,
    })

    // Busca por todos os handles do Instagram no HTML via regex
    const matches = String(html).match(/instagram\.com\/([a-zA-Z0-9_.]{2,30})(?:\/|")/g) ?? []
    for (const raw of matches) {
      const handle = extrairHandleDeUrl(raw)
      if (handle) return `https://www.instagram.com/${handle}`
    }
    return null
  } catch {
    return null
  }
}

async function buscarInstagram(nome: string): Promise<string | null> {
  const q = encodeURIComponent(`${nome.split(/[-|–—]/)[0].trim()} instagram palmas`)

  // Brave Search é o mais tolerante com scraping e tem boa qualidade
  const brave = await buscarEmMecanismo(`https://search.brave.com/search?q=${q}`)
  if (brave) return brave

  // Startpage como fallback
  const sp = await buscarEmMecanismo(`https://www.startpage.com/do/search?q=${q}`)
  if (sp) return sp

  return null
}

function dadosBasicos(url: string): Partial<EnrichResult> {
  const handle = url.split('instagram.com/')[1]?.replace(/\/$/, '').split('?')[0] ?? ''
  return {
    instagram:            `@${handle}`,
    instagram_url:        url,
    instagram_bio:        null,
    instagram_seguidores: null,
    telefone:             null,
  }
}

export async function enriquecerLead(leadId: number): Promise<EnrichResult | null> {
  const db = getClient()
  const result = await db.execute({ sql: 'SELECT * FROM leads WHERE id = ?', args: [leadId] })
  const lead = result.rows[0] as any
  if (!lead) return null
  if (lead.instagram) return null

  const igUrl = await buscarInstagram(lead.nome)
  if (!igUrl) return null

  const dados = dadosBasicos(igUrl)

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

  return dados as EnrichResult
}

export async function enriquecerTodos(tipo?: string) {
  const db = getClient()
  const where = tipo ? `WHERE instagram IS NULL AND tipo = ?` : `WHERE instagram IS NULL`
  const result = await db.execute({
    sql: `SELECT id, nome FROM leads ${where} ORDER BY score DESC`,
    args: tipo ? [tipo] : [],
  })
  const leads = result.rows as any[]

  let enriquecidos = 0
  for (const lead of leads) {
    const res = await enriquecerLead(lead.id as number)
    if (res?.instagram) enriquecidos++
    await new Promise(r => setTimeout(r, 1500))
  }
  return { total: leads.length, enriquecidos }
}
