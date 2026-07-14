/**
 * Gera a Msg 1 dos leads mais quentes da base — com o arsenal + Claude.
 *   npx tsx scripts/testar-msg-real.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { gerarMensagemComArsenal, LeadCompleto } from '../lib/claude-copy'

async function main() {
  const db = getClient()

  // os 3 mais quentes: quem já usa sistema, ordenado por tamanho
  const r = await db.execute(`
    SELECT nome, categoria, telefone, nota, num_avaliacoes, site_real,
           instagram, instagram_bio, endereco, sistema_detectado, nivel_consciencia, tem_site
    FROM leads
    WHERE status != 'arquivado' AND telefone IS NOT NULL AND disparado_em IS NULL
      AND (sistema_detectado IS NOT NULL OR nivel_consciencia = 'MOVIMENTO_ALTO_MANUAL')
    ORDER BY (sistema_detectado IS NULL), num_avaliacoes DESC
    LIMIT 3
  `)

  let custo = 0

  for (const row of r.rows) {
    const lead = row as unknown as LeadCompleto
    console.log('\n' + '═'.repeat(66))
    console.log(`${lead.nome}  ·  ★${lead.nota ?? '-'} (${lead.num_avaliacoes ?? 0} aval.)`)
    console.log(`${lead.sistema_detectado ? `🔥 USA ${lead.sistema_detectado}` : lead.nivel_consciencia}  ·  ${lead.telefone}`)
    console.log('═'.repeat(66))

    const g = await gerarMensagemComArsenal(lead)
    custo += g.custoUSD

    console.log('\n' + g.mensagem + '\n')
    console.log(`   └─ ângulo: ${g.angulo}`)

    // auditoria
    const m = g.mensagem
    const erros: string[] = []
    if (/\b4[.,]\d\b|avaliaç/i.test(m)) erros.push('citou nota/avaliações')
    if (/R\$/.test(m)) erros.push('citou preço')
    if (/https?:|\.com\b/i.test(m)) erros.push('mandou link')
    if (/trinks|booksy|avec|gendo|appbarber/i.test(m)) erros.push('CITOU O CONCORRENTE PELO NOME')
    if (/furou|furo de agenda|deu bolo/i.test(m)) erros.push('usou furo de agenda (proibido)')
    if (/d{3}s*(sul|norte)|quadra|bQ[Ii]s*d|rua |avenida /i.test(m)) erros.push('CITOU ENDEREÇO (proibido — inventa onde o Eduardo mora)')
    if (m.split('\n').filter((l) => l.trim()).length > 5) erros.push('mais de 5 linhas')
    console.log(erros.length ? `   ⚠️  ${erros.join(' · ')}` : '   ✅ passou no checklist')
  }

  console.log('\n' + '─'.repeat(66))
  console.log(`custo dos 3: US$ ${custo.toFixed(4)} · por lead: US$ ${(custo / 3).toFixed(4)} (~R$ ${((custo / 3) * 5.4).toFixed(2)})\n`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
