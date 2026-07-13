/**
 * Testa o ARSENAL_COPY com LEADS REAIS do Turso.
 *   npx tsx scripts/testar-arsenal.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import Anthropic from '@anthropic-ai/sdk'
import { getClient } from '../lib/db'
import { ARSENAL_COPY, contextoDoLead, LeadParaCopy } from '../lib/copy-prompt'

const PROIBIDO = [
  'no-show', 'solução', 'plataforma', 'otimizar', 'democratizar', 'exatamente',
  'potencializar', 'minhas meninas', 'desculpa incomodar', 'tudo bem?',
  'últimas vagas', 'nota fiscal automática',
]
const NOMES = ['Bruna', 'Ana', 'Camila', 'Juliana', 'Larissa', 'Bianca', 'Fernanda', 'Amanda', 'Carla', 'Paula', 'Mariana']

async function main() {
  const db = getClient()
  const r = await db.execute(`
    SELECT nome, categoria, nota, num_avaliacoes, tem_site, site, instagram, instagram_bio, endereco
    FROM leads
    WHERE tipo = 'agendapro' AND telefone IS NOT NULL AND telefone != ''
    ORDER BY num_avaliacoes DESC
    LIMIT 3
  `)

  console.log(`\n=== ${r.rows.length} LEADS REAIS DO BANCO ===\n`)

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  let custoTotal = 0

  for (const row of r.rows) {
    const lead = row as unknown as LeadParaCopy
    const ctx = contextoDoLead(lead)

    console.log('━'.repeat(64))
    console.log(ctx.split('\n').slice(0, 4).join(' | '))
    console.log('━'.repeat(64))

    const resp = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 400,
      system: ARSENAL_COPY,
      messages: [{ role: 'user', content: `${ctx}\n\nEscreva a Msg 1. Só a mensagem, nada de explicação.` }],
    })

    const b = resp.content.find((x) => x.type === 'text')
    const msg = b && b.type === 'text' ? b.text.trim() : ''
    console.log('\n' + msg + '\n')

    // auditoria automática
    const low = msg.toLowerCase()
    const erros: string[] = []
    for (const p of PROIBIDO) if (low.includes(p.toLowerCase())) erros.push(`palavra proibida: "${p}"`)

    // Nome inventado: só conta se NÃO fizer parte do nome do negócio.
    // ("Amanda Bronze" é o nome do negócio — citar "Amanda" ali não é invenção.)
    const nomeNegocio = (lead.nome ?? '').toLowerCase()
    for (const n of NOMES) {
      if (new RegExp(`\\b${n}\\b`, 'i').test(msg) && !nomeNegocio.includes(n.toLowerCase())) {
        erros.push(`INVENTOU NOME: ${n}`)
      }
    }
    if (/R\$|\breais\b/i.test(msg)) erros.push('citou preço')
    if (/https?:|\.com\b|\.br\b/i.test(msg)) erros.push('mandou link')
    if (/\b4[.,]\d\b|\bavaliaç/i.test(msg)) erros.push('citou nota/avaliações (elogio que denuncia)')
    if (/furou|furo de agenda|deu bolo|não apareceu/i.test(msg)) erros.push('usou furo de agenda como problema central (PROIBIDO)')
    const linhas = msg.split('\n').filter((l) => l.trim()).length
    if (linhas > 5) erros.push(`${linhas} linhas (máx 5)`)

    console.log(erros.length ? '❌ ' + erros.join(' · ') : '✅ passou no checklist')

    custoTotal += (resp.usage.input_tokens / 1e6) * 5 + (resp.usage.output_tokens / 1e6) * 25
    console.log('')
  }

  console.log('━'.repeat(64))
  console.log(`custo dos 3: US$ ${custoTotal.toFixed(4)} · por lead: US$ ${(custoTotal / 3).toFixed(4)}`)
  console.log(`1.000 leads ≈ US$ ${((custoTotal / 3) * 1000).toFixed(2)} (~R$ ${((custoTotal / 3) * 1000 * 5.4).toFixed(0)})`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
