/**
 * Testa playbook + diagnóstico com Claude, em nichos DIFERENTES.
 * Prova que fala com cada um como se fosse único.
 *   npx tsx scripts/testar-playbook.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { diagnosticarComClaude, playbookComClaude, LeadInfo } from '../lib/claude-playbook'
import { detectarNicho } from '../lib/nichos'

async function main() {
  const db = getClient()

  // pega 1 lead de cada nicho diferente
  const r = await db.execute(`
    SELECT id, nome, categoria, telefone, nota, num_avaliacoes, instagram, instagram_bio,
           site_real, sistema_detectado, nivel_consciencia, notas
    FROM leads
    WHERE status != 'arquivado' AND telefone IS NOT NULL AND disparado_em IS NULL
    ORDER BY num_avaliacoes DESC
    LIMIT 40
  `)

  const vistos = new Set<string>()
  const escolhidos: LeadInfo[] = []
  for (const row of r.rows) {
    const l = row as unknown as LeadInfo
    const n = detectarNicho(l.categoria ?? '', l.nome ?? '') ?? 'outro'
    if (!vistos.has(n) && escolhidos.length < 2) {
      vistos.add(n)
      escolhidos.push(l)
    }
  }

  let custo = 0

  for (const lead of escolhidos) {
    const nicho = detectarNicho(lead.categoria ?? '', lead.nome ?? '')
    console.log('\n' + '█'.repeat(70))
    console.log(`  ${lead.nome}`)
    console.log(`  nicho: ${nicho ?? '?'} · ${lead.sistema_detectado ? `🔥 usa ${lead.sistema_detectado}` : lead.nivel_consciencia}`)
    console.log('█'.repeat(70))

    const d = await diagnosticarComClaude(lead)
    custo += d.custoUSD
    console.log('\n▸ DIAGNÓSTICO')
    console.log(`  Dor central : ${d.dor_central}`)
    console.log(`  Custo da dor: ${d.custo_da_dor}`)
    console.log(`  ARMA CERTA  : ${d.arma_certa}`)
    console.log(`  NÃO oferecer: ${d.o_que_nao_oferecer}`)

    const p = await playbookComClaude(lead)
    custo += p.custoUSD
    console.log('\n▸ MSG 1')
    console.log(`  ${p.msg1.replace(/\n/g, '\n  ')}`)
    console.log('\n▸ SE DISSER "JÁ TENHO SISTEMA"')
    console.log(`  ${p.se_disser_ja_tenho_sistema.replace(/\n/g, '\n  ')}`)
    console.log('\n▸ SE DISSER "NÃO TENHO TEMPO"')
    console.log(`  ${p.se_disser_nao_tenho_tempo.replace(/\n/g, '\n  ')}`)
    console.log('\n▸ SE PERGUNTAR DO WHATSAPP AUTOMÁTICO (não temos)')
    console.log(`  ${p.se_perguntar_whatsapp_automatico.replace(/\n/g, '\n  ')}`)
    console.log('\n▸ BREAKUP (D+7)')
    console.log(`  ${p.se_sumir_d7.replace(/\n/g, '\n  ')}`)
  }

  console.log('\n' + '─'.repeat(70))
  console.log(`custo total: US$ ${custo.toFixed(4)} · por lead (diag+playbook): US$ ${(custo / escolhidos.length).toFixed(4)} (~R$ ${((custo / escolhidos.length) * 5.4).toFixed(2)})\n`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
