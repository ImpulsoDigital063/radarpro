/**
 * radarPRO — Leitor de avaliações do Google Maps
 * Usa axios + cheerio (sem Playwright) — funciona na Vercel
 * Extrai avaliações do HTML estático do Maps
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import { GoogleGenerativeAI } from '@google/generative-ai'

function getGemini() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY não configurada')
  return new GoogleGenerativeAI(key)
}

export type AnaliseAvaliacoes = {
  total:            number
  media:            number
  dor_principal:    string
  elogio_principal: string
  oportunidade:     string
  avaliacoes:       string[]
}

export async function analisarAvaliacoesGMaps(mapsUrl: string, nome: string): Promise<AnaliseAvaliacoes> {
  let media = 0
  let total = 0
  let avaliacoes: string[] = []

  try {
    const { data: html } = await axios.get(mapsUrl, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
    })

    const $ = cheerio.load(html)

    // Tenta extrair nota e total do HTML
    const texto = $('body').text()
    const notaMatch = texto.match(/(\d[,\.]\d)\s*\(/)
    const avalMatch = texto.match(/\((\d[\d.,]+)\s*avalia/)
    media = notaMatch ? parseFloat(notaMatch[1].replace(',', '.')) : 0
    total = avalMatch ? parseInt(avalMatch[1].replace(/\D/g, '')) : 0

    // Tenta extrair avaliações de spans/divs comuns no Maps
    $('span, div').each((_, el) => {
      const t = $(el).text().trim()
      if (t.length > 40 && t.length < 500 && !t.includes('©') && !t.includes('Termos')) {
        avaliacoes.push(t)
      }
    })
    avaliacoes = [...new Set(avaliacoes)].slice(0, 15)
  } catch {
    // fallback silencioso
  }

  if (avaliacoes.length === 0) {
    return {
      total, media,
      dor_principal:    'Não foi possível coletar avaliações via web',
      elogio_principal: 'Verificar manualmente no Google Maps',
      oportunidade:     `Visitar o perfil do Google de "${nome}" e ler as avaliações`,
      avaliacoes:       [],
    }
  }

  // Manda para Gemini analisar
  const genAI = getGemini()
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Analise as avaliações do Google do negócio "${nome}" e identifique padrões.

Nota média: ${media} (${total} avaliações)

Trechos coletados da página:
${avaliacoes.slice(0, 10).map((a, i) => `${i + 1}. "${a.slice(0, 200)}"`).join('\n')}

Com base nisso, identifique:
1. Qual é a maior DOR ou reclamação recorrente?
2. O que mais elogiam?
3. Qual oportunidade de venda isso gera para nós?

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
    return {
      total, media, avaliacoes,
      dor_principal:    'Análise não disponível',
      elogio_principal: 'Verificar manualmente',
      oportunidade:     avaliacoes[0]?.slice(0, 100) ?? 'Sem avaliações coletadas',
    }
  }
}
