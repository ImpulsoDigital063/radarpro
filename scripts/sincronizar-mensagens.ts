/**
 * Sincroniza a coluna `mensagem` com o msg1 do playbook.
 *
 * O BURACO QUE ISSO FECHA: o painel principal lê a coluna `mensagem` — não o
 * script_json. Quando gerei os 567 playbooks, gravei em script_json e deixei
 * `mensagem` intacta. Resultado: a tela seguia mostrando (e o botão "Enviar
 * direto" seguia mandando) a copy VELHA da era das LPs.
 *
 * Um dos leads tinha engatilhado: "vi a nota 4.9 com 77 avaliações" — que é
 * exatamente o que o arsenal PROÍBE (só vendedor lê contagem de review).
 *
 *   npx tsx scripts/sincronizar-mensagens.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'

// a mensagem NUNCA pode citar nota/nº de avaliações do Google
const PROIBIDO = /\b\d{2,}\s*avalia|nota\s*[45][,.]\d|Google Business/i

async function main() {
  const db = getClient()

  const r = await db.execute(`
    SELECT id, nome, mensagem, script_json
      FROM leads
     WHERE status != 'arquivado' AND script_json IS NOT NULL
  `)

  let trocadas = 0
  let iguais = 0
  let semMsg1 = 0
  const perigosas: string[] = []

  for (const row of r.rows as any[]) {
    let pb: any
    try { pb = JSON.parse(row.script_json) } catch { continue }
    const msg1 = pb?.msg1
    if (!msg1) { semMsg1++; continue }

    if (row.mensagem === msg1) { iguais++; continue }

    if (row.mensagem && PROIBIDO.test(String(row.mensagem))) {
      perigosas.push(`${row.nome}: "${String(row.mensagem).replace(/\n/g, ' ').slice(0, 70)}…"`)
    }

    await db.execute({
      sql: `UPDATE leads SET mensagem = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
      args: [msg1, row.id],
    })
    trocadas++
  }

  console.log(`✅ ${trocadas} mensagens sincronizadas com o playbook`)
  console.log(`   ${iguais} já estavam certas · ${semMsg1} sem msg1`)

  if (perigosas.length) {
    console.log(`\n🚨 estas citavam nota/avaliação do Google e foram SUBSTITUÍDAS:`)
    for (const p of perigosas) console.log(`   ${p}`)
  }

  // λ.prova-na-fonte: confere no banco DEPOIS de escrever
  const v = await db.execute(`
    SELECT COUNT(*) AS n FROM leads
     WHERE status != 'arquivado' AND script_json IS NOT NULL
       AND (mensagem IS NULL OR mensagem != json_extract(script_json,'$.msg1'))
  `)
  const fora = Number((v.rows[0] as any).n)
  console.log(`\n${fora === 0 ? '✅' : '⚠️'} leads com mensagem fora de sincronia: ${fora}`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
