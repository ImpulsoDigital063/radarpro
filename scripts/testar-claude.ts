/**
 * Prova que a ANTHROPIC_API_KEY funciona e mede o custo por lead.
 *   npx tsx scripts/testar-claude.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import Anthropic from '@anthropic-ai/sdk'

async function main() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    console.log('❌ ANTHROPIC_API_KEY não encontrada no .env.local')
    process.exit(1)
  }
  console.log('✅ Chave carregada (formato:', key.slice(0, 7) + '…' + ')')

  const client = new Anthropic({ apiKey: key })

  console.log('\nChamando a API (Opus 4.8)…\n')
  const t0 = Date.now()

  const r = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 300,
    system:
      'Você escreve a PRIMEIRA mensagem de WhatsApp pra um lead frio, em PT-BR. ' +
      'O job da Msg 1 NÃO é vender — é fazer o lead RESPONDER. ' +
      'Máximo 3 linhas. Sem "Olá!", sem emoji, sem elogio genérico, sem preço, sem link. ' +
      'Estrutura: saudação curta declarativa → observação real e específica → pergunta de baixo custo. ' +
      'Se a mensagem servir pra qualquer lead, está errada.',
    messages: [
      {
        role: 'user',
        content:
          'Lead: "Studio Lash Palmas" — lash designer em Palmas-TO. Agenda pela DM do Instagram. ' +
          'Nota 4.9 no Google com 34 avaliações. Não tem site.\n\n' +
          'Produto: AgendaPRO. A arma pra esse nicho é a ficha de anamnese digital ' +
          '(as perguntas de saúde, o mapping desenhado com o dedo, marca/lote/validade da cola, ' +
          'termo assinado, PDF que vai pro WhatsApp da cliente). Hoje ela guarda isso em pasta de papel.\n\n' +
          'Escreve a Msg 1.',
      },
    ],
  })

  const ms = Date.now() - t0
  const txt = r.content.find((b) => b.type === 'text')
  console.log('─'.repeat(60))
  console.log(txt && txt.type === 'text' ? txt.text : '(sem texto)')
  console.log('─'.repeat(60))

  const inTok = r.usage.input_tokens
  const outTok = r.usage.output_tokens
  const custoUSD = (inTok / 1e6) * 5 + (outTok / 1e6) * 25

  console.log(`\ntempo: ${(ms / 1000).toFixed(1)}s`)
  console.log(`tokens: ${inTok} entrada · ${outTok} saída`)
  console.log(`custo desta mensagem: US$ ${custoUSD.toFixed(4)} (~R$ ${(custoUSD * 5.4).toFixed(3)})`)
  console.log(`custo estimado p/ 1.000 leads: US$ ${(custoUSD * 1000).toFixed(2)} (~R$ ${(custoUSD * 1000 * 5.4).toFixed(0)})`)
}

main().catch((e) => {
  console.log('\n❌ ERRO:', e.message)
  if (String(e.message).includes('credit') || String(e.message).includes('billing')) {
    console.log('   → parece falta de crédito. Console → Settings → Billing.')
  }
  process.exit(1)
})
