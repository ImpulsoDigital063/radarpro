// Lista 10 leads LP perfeitos + 10 Shopify perfeitos (excluindo os 14 que ja
// estao no /disparo).
//
// Filosofia: "perfeito" = QUEM TA NA DOR + DINHEIRO PRA RESOLVER, nao quem ja
// tem 5 anos de autoridade construida (esses defendem com "ja vendo pelo IG").
//
// Inclui INICIANTES tambem (sem reviews, ou poucos) — formularios servem pra
// quem tá começando também. Filtro Eduardo 25/04: nao excluir quem abriu agora.
//
// Criterios:
// - tem telefone valido
// - tem instagram (sinal de presenca digital)
// - tem_site = 0 (ou site so Google Maps)
// - status = 'novo'
// - SEM exigencia de nota minima ou aval minima (aceita iniciantes)
//
// Ranqueamento composto: leads com aval >= 20 PRIMEIRO (sinal de tração),
// depois leads novinhos sem reviews ainda mas com IG ativo.
//
// Uso: npx tsx scripts/top-20-perfeitos.ts

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { detectarTipoOferta } from '../lib/mensagens'
import { ANALISES } from '../lib/disparo-analises'

type Row = {
  id: number
  nome: string
  categoria: string
  telefone: string | null
  instagram: string | null
  site: string | null
  nota: number | null
  num_avaliacoes: number | null
  tem_site: number
  score: number | null
  status: string
}

function siteRealmenteVazio(r: Row): boolean {
  if (r.tem_site === 0) return true
  if (!r.site) return true
  if (/google\.com\/maps/i.test(r.site)) return true
  return false
}

async function buscarTudo(): Promise<Row[]> {
  const db = getClient()
  const res = await db.execute(
    `SELECT id, nome, categoria, telefone, instagram, site, nota, num_avaliacoes,
            tem_site, score, status
       FROM leads
      WHERE telefone IS NOT NULL AND telefone != ''
        AND instagram IS NOT NULL AND instagram != ''
        AND status = 'novo'`,
  )
  return res.rows as unknown as Row[]
}

// Score composto pra ranqueamento "iniciantes + tração":
// - Quem tem >=20 aval e nota >=4.5 = prioridade alta (cliente operando bem)
// - Quem tem 5-20 aval = prioridade média (operando, mas com volume baixo)
// - Quem tem 0-5 aval mas IG ativo = prioridade média-baixa (iniciante validado)
// Adicional: nicho específico (suplementos, moda fem, camisa time, esteta)
// recebe boost — combina com Erlane case + momentum Copa 2026.
function scoreComposto(r: Row): number {
  let s = 0
  // Tração
  const aval = r.num_avaliacoes ?? 0
  if (aval >= 20) s += 30
  else if (aval >= 5) s += 15
  else if (aval >= 1) s += 8
  else s += 5 // tem zero, mas é elegível (iniciante)

  // Nota (quando existe)
  const nota = r.nota ?? 0
  if (nota >= 4.5) s += 20
  else if (nota >= 4.0) s += 10
  else if (nota >= 3.5) s += 5

  // Score do banco (já calculado, varia 0-10)
  s += (r.score ?? 0) * 1.5

  // Boost de nicho-quente
  const cat = (r.categoria ?? '').toLowerCase()
  const nome = (r.nome ?? '').toLowerCase()
  const NICHOS_QUENTES = [
    'suplemento', 'whey', 'fitness', 'feminina', 'lingerie', 'moda',
    'time', 'esportiv', 'futebol', 'jóia', 'joia', 'esteta', 'esteticista',
    'sobrancelha', 'podolog', 'personal', 'cosmétic', 'cosmetic', 'beleza',
    'biomédic', 'biomedic', 'soroterapia', 'injetav',
  ]
  if (NICHOS_QUENTES.some((n) => cat.includes(n) || nome.includes(n))) s += 15

  // Penalidade pra cluster "difícil" (autoridade já construída demais)
  // Arquiteto autônomo, advogado autônomo, dentista solo são clientes
  // bons mas defendem mais — não vamos penalizar muito, só -5 pra não dominar
  const CLUSTERS_DIFICEIS = ['arquiteto', 'advoca']
  if (CLUSTERS_DIFICEIS.some((c) => cat.includes(c))) s -= 5

  return s
}

async function main() {
  const idsNoDisparo = new Set(Object.keys(ANALISES).map(Number))

  const todos = (await buscarTudo()).filter(
    (r) => siteRealmenteVazio(r) && !idsNoDisparo.has(r.id),
  )

  const ranqueado = todos
    .map((r) => ({ ...r, _score: scoreComposto(r) }))
    .sort((a, b) => b._score - a._score)

  const lp: Row[] = []
  const shopify: Row[] = []

  for (const r of ranqueado) {
    const oferta = detectarTipoOferta(r.categoria ?? '')
    if (oferta === 'lp-solo' && lp.length < 10) lp.push(r)
    else if (oferta === 'shopify-solo' && shopify.length < 10) shopify.push(r)
    if (lp.length === 10 && shopify.length === 10) break
  }

  function imprimir(titulo: string, leads: Row[]) {
    console.log(`\n${'='.repeat(70)}`)
    console.log(titulo)
    console.log('='.repeat(70))
    if (leads.length === 0) {
      console.log('  (nenhum)')
      return
    }
    leads.forEach((r, i) => {
      const ig = r.instagram ? `@${r.instagram.replace(/^@/, '')}` : '—'
      const aval = r.num_avaliacoes ?? 0
      const tag = aval >= 20 ? '🟢 operando' : aval >= 5 ? '🟡 tração' : '🟠 iniciante'
      console.log(
        `${String(i + 1).padStart(2, ' ')}. ${r.nome} ${tag}` +
          `\n    ${r.categoria}` +
          ` · ⭐ ${r.nota ?? '—'} (${aval} aval)` +
          `\n    📱 ${r.telefone}` +
          ` · ${ig}`,
      )
    })
  }

  imprimir(`📄 TOP 10 LP perfeitas (LP-solo, R$499)`, lp)
  imprimir(`🛒 TOP 10 Shopify perfeitas (Shopify-solo, R$599)`, shopify)

  console.log(`\n${'='.repeat(70)}`)
  console.log('Resumo')
  console.log('='.repeat(70))
  console.log(`LP: ${lp.length} leads · Shopify: ${shopify.length} leads`)
  console.log(`Total a abordar: ${lp.length + shopify.length}`)
  console.log(
    `Receita potencial bruta (100% conversao): ${
      lp.length * 499 + shopify.length * 599
    } reais`,
  )
  console.log(
    `Receita realista (20% conversao em 7 dias): ~R$${Math.round(
      (lp.length * 499 + shopify.length * 599) * 0.2,
    )}`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
