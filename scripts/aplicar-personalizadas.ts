/**
 * Grava as mensagens personalizadas (escritas à mão, lead a lead) por cima do
 * playbook local. Só troca msg1 / se_sumir_d3 / o gancho — o resto do playbook
 * (objeções, fechamento) continua valendo.
 *
 * Entrada: JSON [{ id, msg1, d3?, gancho? }]
 *   npx tsx scripts/aplicar-personalizadas.ts --in=msgs-personalizadas.json
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { readFileSync } from 'fs'
import { getClient } from '../lib/db'
import { atualizarMensagem } from '../lib/db'

const ENTRADA = process.argv.find((a) => a.startsWith('--in='))?.split('=')[1]
if (!ENTRADA) { console.log('use --in=arquivo.json'); process.exit(1) }

type Item = { id: number; msg1: string; d3?: string; gancho?: string }

async function main() {
  const db = getClient()
  const itens: Item[] = JSON.parse(readFileSync(ENTRADA as string, 'utf8'))

  /**
   * TRAVAS. Cada uma nasceu de um erro real que quase foi pro WhatsApp.
   */
  const TRAVAS: [RegExp, string][] = [
    // só vendedor lê contagem de review — entrega o robô na primeira linha
    [/\b\d{2,}\s*(avalia|review|estrela)|nota\s*[45][,.]\d/i,
      'cita nota ou nº de avaliações do Google'],

    // a comissão desconta CUPOM, não taxa de maquininha (conferido no código)
    [/comiss[ãa]o[^.!?]{0,120}(maquininha|taxa do cart)|(maquininha|taxa do cart)[^.!?]{0,80}comiss[ãa]o/i,
      'promete comissão descontando taxa de maquininha — O SISTEMA NÃO FAZ ISSO'],

    // anunciar-se vendedor na linha 1 é dar permissão pra ser descartado
    [/mensagem de vendedor|sou vendedor|aviso que (é|e) (uma )?venda/i,
      'anuncia que é vendedor (tiro no pé — caiu na v2)'],

    // não existe
    [/nota fiscal|emitir nota|disparo autom[áa]tico|lembrete autom[áa]tico no whats/i,
      'promete o que não existe (nota fiscal / disparo automático)'],
  ]

  let bloqueou = false
  for (const it of itens) {
    const texto = `${it.msg1}\n${it.d3 ?? ''}`
    for (const [re, motivo] of TRAVAS) {
      if (re.test(texto)) {
        console.log(`🚫 id ${it.id} — ${motivo}`)
        console.log(`   "${texto.replace(/\n/g, ' ').slice(0, 110)}…"`)
        bloqueou = true
      }
    }
  }
  if (bloqueou) {
    console.log('\nNADA foi gravado. Corrija as mensagens acima.')
    process.exit(1)
  }

  let ok = 0
  for (const it of itens) {
    const r = await db.execute({ sql: `SELECT script_json FROM leads WHERE id = ?`, args: [it.id] })
    const raw = r.rows[0]?.script_json as string | undefined
    if (!raw) { console.log(`✗ id ${it.id}: sem playbook base`); continue }

    const pb = JSON.parse(raw)
    pb.msg1 = it.msg1
    if (it.d3) pb.se_sumir_d3 = it.d3
    pb.modelo = `manual:estudado`
    if (it.gancho) pb.gancho_do_estudo = it.gancho

    await db.execute({
      sql: `UPDATE leads SET script_json = ?, script_gerado_em = datetime('now','localtime'),
                 atualizado_em = datetime('now','localtime') WHERE id = ?`,
      args: [JSON.stringify(pb), it.id],
    })
    await atualizarMensagem(it.id, it.msg1)
    ok++
  }

  console.log(`✅ ${ok} mensagens personalizadas gravadas (de ${itens.length})`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
