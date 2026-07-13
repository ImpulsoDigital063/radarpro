/**
 * Testa a Msg 1 com a trava λ.não-inventar.
 * O teste anterior inventou o nome "Bruna" pra um lead que não tinha nome.
 *   npx tsx scripts/testar-msg1.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import Anthropic from '@anthropic-ai/sdk'

const SYS = `Você escreve a PRIMEIRA mensagem de WhatsApp pra um lead frio, em PT-BR.

🛑 λ.NÃO-INVENTAR (regra maior que todas): use SÓ os dados que vieram no lead.
NUNCA invente o NOME DA PESSOA. Se só veio o nome do NEGÓCIO, você NÃO sabe como a dona se chama —
não chute "Bruna", "Ana", nem nenhum outro. Se não tem o nome, comece sem nome.
Nunca invente nº de clientes, faturamento, "você perde cliente", "usa planilha". Você não sabe.

O job da Msg 1 NÃO é vender — é fazer o lead RESPONDER.
Máximo 3 linhas. Sem "Olá!", sem emoji, sem elogio genérico, sem preço, sem link.
Estrutura: saudação curta declarativa → observação real e específica → pergunta de baixo custo.
Se a mensagem servir pra qualquer lead, está errada.`

const LEAD = `Lead: "Studio Lash Palmas" — lash designer em Palmas-TO.
Agenda pela DM do Instagram. Nota 4.9 no Google, 34 avaliações. Sem site.
NÃO temos o nome da dona — só o nome do negócio.

Arma pro nicho: ficha de anamnese digital (perguntas de saúde, o mapping desenhado com o dedo,
marca/lote/validade da cola, termo assinado, PDF que vai pro WhatsApp da cliente).
Hoje ela guarda isso em pasta de papel.

Escreve a Msg 1.`

const NOMES_COMUNS = [
  'Bruna', 'Ana', 'Camila', 'Juliana', 'Larissa', 'Bianca', 'Fernanda',
  'Amanda', 'Carla', 'Paula', 'Mariana', 'Leticia', 'Letícia', 'Jessica', 'Jéssica',
]

async function main() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

  const r = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 300,
    system: SYS,
    messages: [{ role: 'user', content: LEAD }],
  })

  const b = r.content.find((x) => x.type === 'text')
  const txt = b && b.type === 'text' ? b.text : ''

  console.log('─'.repeat(60))
  console.log(txt)
  console.log('─'.repeat(60))

  const inventou = NOMES_COMUNS.filter((n) => new RegExp(`\\b${n}\\b`).test(txt))
  const temPreco = /R\$|reais|67|97/.test(txt)
  const temLink = /http|\.com|\.br\b/.test(txt)
  const linhas = txt.split('\n').filter((l) => l.trim()).length

  console.log('')
  console.log(inventou.length ? `❌ INVENTOU NOME: ${inventou.join(', ')}` : '✅ não inventou nome')
  console.log(temPreco ? '❌ citou preço (Msg 1 não cita)' : '✅ sem preço')
  console.log(temLink ? '❌ mandou link (Msg 1 não manda)' : '✅ sem link')
  console.log(linhas <= 4 ? `✅ ${linhas} linhas (curta)` : `⚠️ ${linhas} linhas (longa demais)`)

  const custo = (r.usage.input_tokens / 1e6) * 5 + (r.usage.output_tokens / 1e6) * 25
  console.log(`\ncusto: US$ ${custo.toFixed(4)} · 1.000 leads ≈ US$ ${(custo * 1000).toFixed(2)}`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
