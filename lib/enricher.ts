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

async function buscarInstagramViaDDG(nome: string): Promise<string | null> {
  try {
    const q = `${nome.split(/[-|–—]/)[0].trim()} instagram palmas`
    const { data } = await axios.post(
      'https://html.duckduckgo.com/html/',
      new URLSearchParams({ q }).toString(),
      {
        timeout: 10000,
        headers: {
          'User-Agent': UA,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept-Language': 'pt-BR,pt;q=0.9',
        },
      },
    )

    const $ = cheerio.load(data)
    const candidatos: string[] = []

    $('a').each((_, el) => {
      const href = $(el).attr('href') ?? ''
      if (href.includes('instagram.com/')) candidatos.push(href)
    })

    for (const raw of candidatos) {
      // DDG envolve em /l/?uddg=<url-encoded>
      let url = raw
      const m = raw.match(/uddg=([^&]+)/)
      if (m) url = decodeURIComponent(m[1])

      const handle = extrairHandleDeUrl(url)
      if (handle) return `https://www.instagram.com/${handle}`
    }

    return null
  } catch {
    return null
  }
}

async function extrairDadosInstagram(url: string): Promise<Partial<EnrichResult>> {
  const handle = url.split('instagram.com/')[1]?.replace(/\/$/, '').split('?')[0] ?? ''

  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR,pt;q=0.9' },
    })

    const $ = cheerio.load(html)
    const ogDesc =
      $('meta[property="og:description"]').attr('content') ??
      $('meta[name="description"]').attr('content') ??
      ''

    // Formato típico: "123K Followers, 45 Following, 678 Posts - <bio>"
    // ou em PT: "123 seguidores, 45 seguindo, 678 publicações - ..."
    const segMatch = ogDesc.match(/([\d.,]+\s*[KMkm]?)\s*(Followers|seguidores)/i)
    const telMatch = ogDesc.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/)

    return {
      instagram:            `@${handle}`,
      instagram_url:        url,
      instagram_bio:        ogDesc || null,
      instagram_seguidores: segMatch ? segMatch[1].trim() : null,
      telefone:             telMatch ? telMatch[0].replace(/\s/g, '') : null,
    }
  } catch {
    // Profile exists mas Instagram bloqueou o fetch — salva só a URL mesmo
    return {
      instagram:     `@${handle}`,
      instagram_url: url,
      instagram_bio: null,
      instagram_seguidores: null,
      telefone:      null,
    }
  }
}

export async function enriquecerLead(leadId: number): Promise<EnrichResult | null> {
  const db = getClient()
  const result = await db.execute({ sql: 'SELECT * FROM leads WHERE id = ?', args: [leadId] })
  const lead = result.rows[0] as any
  if (!lead) return null
  if (lead.instagram) return null

  const igUrl = await buscarInstagramViaDDG(lead.nome)
  if (!igUrl) return null

  const dados = await extrairDadosInstagram(igUrl)

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
