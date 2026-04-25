// Calculadora pra Bloco 3 do template "Análise Express" da campanha
// Migração Nuvemshop → Shopify (Impulso Digital).
//
// Uso: npx tsx scripts/calc-analise-nuvemshop.ts <leadId>
// Ou: npx tsx scripts/calc-analise-nuvemshop.ts --manual
//
// Output: nums prontos pra colar no PDF do lead.

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'

type Lead = {
  id: number
  nome: string
  categoria: string
  nota: number | null
  num_avaliacoes: number | null
  instagram: string | null
}

// Premissas razoáveis pra estimativa (ajustar com tempo conforme aprende)
const TICKET_MEDIO_POR_CATEGORIA: Record<string, number> = {
  'loja de roupas':           180,
  'moda feminina':            180,
  'moda masculina':           220,
  'moda fitness':             140,
  'lingerie':                 110,
  'boutique':                 250,
  'perfumaria':               280,
  'cosméticos':               90,
  'cosmeticos':               90,
  'suplemento':               130,
  'whey protein':             170,
  'semi joias':               180,
  'semijoias':                180,
  'artigos esportivos':       150,
  'camisa de time':           120,
  'sapato':                   200,
  'calçado':                  200,
}

// Mensalidade Nuvemshop por nivel (referência 2025)
const PLANOS_NUVEMSHOP = {
  iniciar:   { custo: 0,    limite_vendas: 50 },
  empreender:{ custo: 59,   limite_vendas: 250 },
  evoluir:   { custo: 129,  limite_vendas: 1000 },
  avancar:   { custo: 199,  limite_vendas: 5000 },
  profissional: { custo: 299, limite_vendas: Infinity },
}

const TAXA_NUVEMPAGO = 0.02 // 2% sobre vendas que NÃO usam Nuvem Pago
const SHOPIFY_BASIC_BRL = 100 // ~US$19 = R$100 médio
const CONVERSAO_PERDIDA_PCT = 0.25 // 25% — checkout transparente vs plataforma

function detectarTicket(categoria: string): number {
  const cat = (categoria ?? '').toLowerCase()
  for (const [key, valor] of Object.entries(TICKET_MEDIO_POR_CATEGORIA)) {
    if (cat.includes(key)) return valor
  }
  return 150 // default
}

function detectarPlanoNuvemshop(vendasMensais: number): keyof typeof PLANOS_NUVEMSHOP {
  if (vendasMensais < 50) return 'iniciar'
  if (vendasMensais < 250) return 'empreender'
  if (vendasMensais < 1000) return 'evoluir'
  if (vendasMensais < 5000) return 'avancar'
  return 'profissional'
}

// Estimativa heurística: # avaliações Google é proxy fraco de # vendas.
// Regra da unha: vendas mensais ≈ avaliações × 10 / tempo_meses_operacao
// Ajustar com dados reais conforme valida.
function estimarVendasMensais(numAvaliacoes: number, mesesOperacao: number = 24): number {
  const total = numAvaliacoes * 10 // estimativa de vendas totais (1 review a cada 10 compras)
  return Math.round(total / mesesOperacao)
}

function calcular(opts: {
  nome: string
  categoria: string
  numAvaliacoes: number
  mesesOperacao?: number
  ticketCustom?: number
  vendasMensaisCustom?: number
}) {
  const ticket = opts.ticketCustom ?? detectarTicket(opts.categoria)
  const vendasMensais = opts.vendasMensaisCustom ?? estimarVendasMensais(opts.numAvaliacoes, opts.mesesOperacao ?? 24)
  const faturamentoMensal = vendasMensais * ticket
  const planoKey = detectarPlanoNuvemshop(vendasMensais)
  const plano = PLANOS_NUVEMSHOP[planoKey]

  const custoMensalidadeAnual = plano.custo * 12
  const taxaNuvemPagoAnual = faturamentoMensal * TAXA_NUVEMPAGO * 12
  const conversaoPerdidaAnual = faturamentoMensal * CONVERSAO_PERDIDA_PCT * 12
  const totalSaindo = custoMensalidadeAnual + taxaNuvemPagoAnual + conversaoPerdidaAnual

  const custoShopifyAnual = SHOPIFY_BASIC_BRL * 12
  const economiaAnual = totalSaindo - custoShopifyAnual

  return {
    nome: opts.nome,
    categoria: opts.categoria,
    ticket,
    vendasMensais,
    faturamentoMensal,
    plano: planoKey,
    custoMensalidadeAnual,
    taxaNuvemPagoAnual,
    conversaoPerdidaAnual,
    totalSaindo,
    custoShopifyAnual,
    economiaAnual,
  }
}

function formatarBRL(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function imprimir(r: ReturnType<typeof calcular>) {
  console.log('\n' + '='.repeat(70))
  console.log(`📊 Análise Express — ${r.nome}`)
  console.log('='.repeat(70))
  console.log(`Categoria: ${r.categoria}`)
  console.log(`Ticket médio estimado: ${formatarBRL(r.ticket)}`)
  console.log(`Vendas mensais estimadas: ${r.vendasMensais}`)
  console.log(`Faturamento mensal estimado: ${formatarBRL(r.faturamentoMensal)}`)
  console.log(`Plano Nuvemshop estimado: ${r.plano} (R$ ${PLANOS_NUVEMSHOP[r.plano as keyof typeof PLANOS_NUVEMSHOP].custo}/mês)`)
  console.log('')
  console.log('━━━ BLOCO 3 DO PDF (cola direto no template) ━━━')
  console.log('')
  console.log('| Item                         | Valor anual       |')
  console.log('|------------------------------|-------------------|')
  console.log(`| Mensalidade Nuvemshop        | ${formatarBRL(r.custoMensalidadeAnual).padEnd(17)} |`)
  console.log(`| Taxa 2% sobre vendas         | ${formatarBRL(r.taxaNuvemPagoAnual).padEnd(17)} |`)
  console.log(`| Conversão perdida (checkout) | ${formatarBRL(r.conversaoPerdidaAnual).padEnd(17)} |`)
  console.log(`| **Total que pode estar saindo** | **${formatarBRL(r.totalSaindo)}** |`)
  console.log('')
  console.log(`Custo Shopify + Yampi (anual): ${formatarBRL(r.custoShopifyAnual)}`)
  console.log(`💰 Economia anual estimada: ${formatarBRL(r.economiaAnual)}`)
  console.log('='.repeat(70))
  console.log('')
  console.log('⚠️  Validar antes de mandar:')
  console.log(`   1. Ticket de ${formatarBRL(r.ticket)} bate com o que você vê na loja?`)
  console.log(`   2. ${r.vendasMensais} vendas/mês é plausível pro tamanho da loja?`)
  console.log(`   3. Lead realmente está em Nuvemshop? (verificar pelo footer da loja)`)
  console.log('')
}

async function main() {
  const args = process.argv.slice(2)

  if (args[0] === '--manual') {
    // Modo manual: aceita inputs via env vars ou interativo
    const nome = process.env.NOME ?? 'Loja Exemplo'
    const categoria = process.env.CATEGORIA ?? 'moda feminina'
    const aval = parseInt(process.env.AVALIACOES ?? '80', 10)
    const meses = parseInt(process.env.MESES ?? '24', 10)
    const ticketCustom = process.env.TICKET ? parseFloat(process.env.TICKET) : undefined

    const r = calcular({ nome, categoria, numAvaliacoes: aval, mesesOperacao: meses, ticketCustom })
    imprimir(r)
    return
  }

  const leadId = args[0] ? parseInt(args[0], 10) : null
  if (!leadId) {
    console.log('Uso: npx tsx scripts/calc-analise-nuvemshop.ts <leadId>')
    console.log('     npx tsx scripts/calc-analise-nuvemshop.ts --manual')
    console.log('')
    console.log('Modo manual via env vars:')
    console.log('     NOME="Bella Mode" CATEGORIA="moda feminina" AVALIACOES=89 MESES=24 \\')
    console.log('       npx tsx scripts/calc-analise-nuvemshop.ts --manual')
    console.log('')
    console.log('Exemplos rápidos pros 5 Shopify perfeitos atuais (run --manual):')
    process.exit(1)
  }

  const db = getClient()
  const r = await db.execute({
    sql: `SELECT id, nome, categoria, nota, num_avaliacoes, instagram FROM leads WHERE id = ?`,
    args: [leadId],
  })
  if (r.rows.length === 0) {
    console.error(`Lead id=${leadId} não encontrado.`)
    process.exit(1)
  }
  const lead = r.rows[0] as unknown as Lead
  const calc = calcular({
    nome: lead.nome,
    categoria: lead.categoria,
    numAvaliacoes: lead.num_avaliacoes ?? 30,
  })
  imprimir(calc)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
