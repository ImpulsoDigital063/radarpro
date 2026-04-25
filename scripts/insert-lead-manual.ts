// Insere leads manualmente no banco via JSON.
// Caso de uso principal: integrar achados do Claude in Chrome (prospecção
// IG-only). Aceita JSON via --file ou stdin.
//
// Uso:
//   npx tsx scripts/insert-lead-manual.ts --file leads.json
//   echo '[{...}]' | npx tsx scripts/insert-lead-manual.ts
//
// Formato JSON aceito (campos opcionais marcados):
// [
//   {
//     "nome": "Mary Fashion Palmas",            // OBRIGATÓRIO
//     "categoria": "Loja de roupas",            // opcional, default ''
//     "telefone": "(63)98419-8501",             // opcional
//     "instagram": "@maryfashionpalmas",        // opcional (mas recomendado)
//     "instagram_url": "https://...",           // opcional, default monta de @
//     "instagram_bio": "...",                   // opcional
//     "instagram_seguidores": 4862,             // opcional
//     "site": null,                             // opcional
//     "nota": null,                             // opcional (Google review)
//     "num_avaliacoes": null,                   // opcional
//     "tipo": "shopify",                        // opcional, default detecta
//     "fonte": "instagram-cic",                 // opcional, default 'instagram-cic'
//     "observacao": "..."                       // opcional, vai pra mensagem
//   }
// ]
//
// Dedup automático:
//   - Se instagram já cadastrado → pula
//   - Se telefone já cadastrado → pula

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { readFileSync } from 'fs'
import { getClient, initDb } from '../lib/db'
import { detectarTipoOferta } from '../lib/mensagens'

type LeadInput = {
  nome: string
  categoria?: string
  telefone?: string
  instagram?: string
  instagram_url?: string
  instagram_bio?: string
  instagram_seguidores?: number
  site?: string
  nota?: number
  num_avaliacoes?: number
  tipo?: 'lp' | 'shopify' | 'agendapro'
  fonte?: string
  observacao?: string
}

async function readInput(): Promise<LeadInput[]> {
  const idx = process.argv.indexOf('--file')
  let raw: string
  if (idx !== -1 && process.argv[idx + 1]) {
    raw = readFileSync(process.argv[idx + 1], 'utf-8')
  } else {
    const chunks: Buffer[] = []
    for await (const chunk of process.stdin) chunks.push(chunk as Buffer)
    raw = Buffer.concat(chunks).toString('utf-8')
  }
  const parsed = JSON.parse(raw)
  return Array.isArray(parsed) ? parsed : [parsed]
}

function normalizarTelefone(tel: string): string {
  const d = tel.replace(/\D/g, '')
  if (d.length < 10) return d
  if (d.length === 13 && d.startsWith('55')) return d
  if (d.length === 11 || d.length === 10) return `55${d}`
  return d
}

function normalizarInstagram(handle: string): string {
  return handle.trim().replace(/^@/, '').toLowerCase()
}

function inferirTipoBanco(categoria: string): 'lp' | 'shopify' | 'agendapro' {
  const oferta = detectarTipoOferta(categoria)
  if (oferta === 'shopify-solo') return 'shopify'
  if (oferta === 'agendapro-solo') return 'agendapro'
  return 'lp'
}

async function main() {
  await initDb()
  const db = getClient()
  const leads = await readInput()

  console.log(`Lendo ${leads.length} leads do input...`)
  console.log('')

  let novos = 0
  let duplicados = 0
  let erros = 0
  const log: string[] = []

  for (const lead of leads) {
    try {
      if (!lead.nome || lead.nome.trim() === '') {
        erros++
        log.push(`❌ lead sem nome: ${JSON.stringify(lead).slice(0, 80)}`)
        continue
      }

      const igNorm = lead.instagram ? normalizarInstagram(lead.instagram) : null
      const telNorm = lead.telefone ? normalizarTelefone(lead.telefone) : null

      // Dedup por Instagram
      if (igNorm) {
        const existe = await db.execute({
          sql: `SELECT id, nome FROM leads WHERE LOWER(REPLACE(instagram, '@', '')) = ? LIMIT 1`,
          args: [igNorm],
        })
        if (existe.rows.length > 0) {
          const r = existe.rows[0] as unknown as { id: number; nome: string }
          duplicados++
          log.push(`⏭  ja existe (IG): @${igNorm} — id=${r.id} ${r.nome}`)
          continue
        }
      }

      // Dedup por telefone
      if (telNorm) {
        const existe = await db.execute({
          sql: `SELECT id, nome FROM leads WHERE telefone = ? LIMIT 1`,
          args: [telNorm],
        })
        if (existe.rows.length > 0) {
          const r = existe.rows[0] as unknown as { id: number; nome: string }
          duplicados++
          log.push(`⏭  ja existe (tel): ${telNorm} — id=${r.id} ${r.nome}`)
          continue
        }
      }

      const tipo = lead.tipo ?? inferirTipoBanco(lead.categoria ?? '')
      const fonte = lead.fonte ?? 'instagram-cic'

      const result = await db.execute({
        sql: `INSERT INTO leads
                (nome, categoria, tipo, telefone, instagram, instagram_url,
                 instagram_bio, instagram_seguidores, site, nota, num_avaliacoes,
                 fonte, status, score, mensagem)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'novo', 0, ?)`,
        args: [
          lead.nome,
          lead.categoria ?? '',
          tipo,
          telNorm,
          igNorm ? `@${igNorm}` : null,
          lead.instagram_url ?? (igNorm ? `https://instagram.com/${igNorm}` : null),
          lead.instagram_bio ?? null,
          lead.instagram_seguidores ?? null,
          lead.site ?? null,
          lead.nota ?? null,
          lead.num_avaliacoes ?? null,
          fonte,
          lead.observacao ?? '',
        ],
      })

      novos++
      const insertedId = result.lastInsertRowid?.toString() ?? '?'
      log.push(`✅ id=${insertedId} ${lead.nome} (@${igNorm ?? '—'}) tipo=${tipo} fonte=${fonte}`)
    } catch (e) {
      erros++
      log.push(`❌ erro ao inserir "${lead.nome}": ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  console.log(log.join('\n'))
  console.log('')
  console.log('━━━ Resumo ━━━')
  console.log(`✅ Novos: ${novos}`)
  console.log(`⏭  Duplicados: ${duplicados}`)
  console.log(`❌ Erros: ${erros}`)
  console.log(`Total processado: ${leads.length}`)
}

main().catch((e) => {
  console.error('Erro fatal:', e)
  process.exit(1)
})
