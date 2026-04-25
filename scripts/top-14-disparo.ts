// Playbook de disparo — 14 leads priorizados (7 LP + 7 Shopify) com análise
// cirúrgica feita no Claude (hardcoded). Puxa do banco, filtra, ranqueia por
// tier A/B/C (aposta forte, provável, red flag) e gera markdown pronto pra
// disparo manual no WhatsApp com link wa.me pré-preenchido por lead.
//
// Uso: `npx tsx scripts/top-14-disparo.ts`
// Saída: top-14-disparo.md na raiz do projeto.
//
// Análise é hardcoded neste arquivo (ANALISES, indexada por lead id). Pra
// atualizar análise de um lead, edita aqui — NÃO usa mais Gemini em lote
// (cota FREE 20/dia estourava fácil em rajadas de 14).

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { writeFileSync } from 'fs'
import { getClient } from '../lib/db'
import {
  detectarTipoOferta,
  escolherScriptAbordagem,
  pickDiagnostico,
  gerarLinkWhatsApp,
} from '../lib/mensagens'
import { ANALISES, type Analise } from '../lib/disparo-analises'

type Row = {
  id: number
  nome: string
  categoria: string
  telefone: string
  instagram: string | null
  instagram_url: string | null
  instagram_bio: string | null
  site: string | null
  nota: number | null
  num_avaliacoes: number | null
  tem_site: number
  tem_agendamento: number
  tipo: string
  status: string
}

function resolverSite(r: Row): string {
  if (!r.site) return 'NÃO TEM'
  if (/google\.com\/maps/i.test(r.site)) return 'NÃO TEM (só Google Maps)'
  return r.site
}

function blocoLead(r: Row, a: Analise): string[] {
  const script = escolherScriptAbordagem({ nome: r.nome, categoria: r.categoria }).script
  const diag = pickDiagnostico(script, r.telefone)
  const link = gerarLinkWhatsApp(r.telefone, a.abertura)
  const oferta = detectarTipoOferta(r.categoria)

  const ig = r.instagram ? `@${r.instagram.replace(/^@/, '')}` : '—'
  const lines: string[] = []
  lines.push(`**Ficha:** ${r.categoria} · Google ${r.nota ?? '—'} (${r.num_avaliacoes ?? 0} aval) · IG ${ig} · Site: ${resolverSite(r)}`)
  lines.push(`**Telefone:** \`${r.telefone}\` · **Oferta:** \`${oferta}\``)
  lines.push('')
  lines.push(`**Dor real:** ${a.dor}`)
  lines.push('')
  lines.push(`**Gancho da oferta:** ${a.gancho}`)
  lines.push('')
  lines.push(`**Objeção esperada:** ${a.objecao}`)
  lines.push('')
  lines.push(`**Como responder:** ${a.resposta_objecao}`)
  lines.push('')
  lines.push(`**Razão do ranking:** ${a.razao_ranking}`)
  lines.push('')
  lines.push(`#### Msg 1 — Abertura cirúrgica`)
  lines.push('```')
  lines.push(a.abertura)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 2 — Diagnóstico (variante ${diag.variante}, escolhida por hash do telefone)`)
  lines.push('```')
  lines.push(diag.texto)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 3A — Pitch se "só tenho Instagram"`)
  lines.push('```')
  lines.push(script.pitch_se_so_ig)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 3B — Pitch se "tenho site"`)
  lines.push('```')
  lines.push(script.pitch_se_tem_site)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 4 — Fechamento`)
  lines.push('```')
  lines.push(script.fechamento)
  lines.push('```')
  if (script.call_alinhamento) {
    lines.push('')
    lines.push(`#### Arma de travamento — Call de alinhamento`)
    lines.push('```')
    lines.push(script.call_alinhamento)
    lines.push('```')
  }
  lines.push('')
  lines.push(`**→ Disparar no WhatsApp (abertura já pré-preenchida):** ${link}`)
  lines.push('')
  return lines
}

async function main() {
  const db = getClient()
  const res = await db.execute(
    `SELECT id, nome, categoria, telefone, instagram, instagram_url, instagram_bio,
            site, nota, num_avaliacoes, tem_site, tem_agendamento, tipo, status
       FROM leads
      WHERE status = 'novo'
        AND telefone IS NOT NULL AND telefone != ''
        AND (instagram IS NOT NULL AND instagram != '' OR instagram_url IS NOT NULL AND instagram_url != '')
      ORDER BY num_avaliacoes DESC NULLS LAST, nota DESC NULLS LAST`,
  )
  const rows = res.rows as unknown as Row[]
  console.error(`Total candidatos (novo + tel + IG): ${rows.length}`)

  const CATEGORIAS_GENERICAS = [
    'profissional liberal', 'comércio local', 'comercio local',
    'serviços locais', 'servicos locais', 'estabelecimento',
    'empresa', 'loja', 'serviço', 'servico',
  ]
  const filtrados = rows.filter(r => {
    const cat = (r.categoria ?? '').trim().toLowerCase()
    if (!cat) return false
    if (/^[\d().,\s-]+$/.test(cat)) return false
    if (CATEGORIAS_GENERICAS.includes(cat)) return false
    if (/\bshopping\b/.test((r.nome ?? '').toLowerCase())) return false
    return true
  })
  console.error(`Após filtro de categoria/nome: ${filtrados.length}`)

  // Seleciona 7 LP + 7 Shopify (mesma lógica do v1)
  const lp: Row[] = []
  const shopify: Row[] = []
  for (const r of filtrados) {
    const oferta = detectarTipoOferta(r.categoria ?? '')
    if (oferta === 'shopify-solo' && shopify.length < 7) shopify.push(r)
    else if (oferta === 'lp-solo' && lp.length < 7) lp.push(r)
    if (lp.length === 7 && shopify.length === 7) break
  }
  const todos = [...lp, ...shopify]

  // Alerta de cobertura: lead no top 14 sem análise ANALISES
  const semAnalise = todos.filter(r => !ANALISES[r.id])
  if (semAnalise.length > 0) {
    console.error(`\n⚠️  ${semAnalise.length} lead(s) sem análise hardcoded (o banco mudou?):`)
    for (const r of semAnalise) console.error(`   - id=${r.id} ${r.nome} (${r.categoria})`)
    console.error(`   Esses leads NÃO aparecerão no md. Editar ANALISES em scripts/top-14-disparo.ts.\n`)
  }

  const ranked = todos
    .filter(r => ANALISES[r.id])
    .sort((a, b) => {
      const A = ANALISES[a.id]
      const B = ANALISES[b.id]
      if (A.tier !== B.tier) return A.tier.localeCompare(B.tier)
      return A.posicao_no_tier - B.posicao_no_tier
    })

  const tierA = ranked.filter(r => ANALISES[r.id].tier === 'A')
  const tierB = ranked.filter(r => ANALISES[r.id].tier === 'B')
  const tierC = ranked.filter(r => ANALISES[r.id].tier === 'C')

  const out: string[] = []
  out.push(`# Playbook de ataque — 14 leads (atualizado 2026-04-25)`)
  out.push('')
  out.push(`**Meta:** fechar no mínimo 2 dos 14 esta semana.`)
  out.push(`**Fonte:** análise cirúrgica hardcoded em \`scripts/top-14-disparo.ts\`.`)
  out.push(`**Arsenal aplicado:** aberturas calibradas pelos 5 livros — **Voss** (Labeling + Black Swan question), **Klaff** (Award Frame, Eduardo avalia o lead, não suplica), **Hormozi** (Equação de Valor na oferta), **Cialdini** (autoridade + escassez real), **Hill** (especialização brutal — UMA solução por categoria).`)
  out.push(`**Importante:** scraping IG ainda pendente — análise baseada em categoria, nota Google, volume de avaliações e nicho.`)
  out.push('')
  out.push(`## Ranking realista (ordem de ataque)`)
  out.push('')
  out.push(`**TIER A (${tierA.length}) — aposta forte, atacar primeiro:**`)
  tierA.forEach((r, i) => {
    const a = ANALISES[r.id]
    out.push(`${i + 1}. ${r.nome} — \`${detectarTipoOferta(r.categoria)}\` · ${r.nota} (${r.num_avaliacoes} aval). *${a.razao_ranking.split('.')[0]}.*`)
  })
  out.push('')
  out.push(`**TIER B (${tierB.length}) — prováveis, atacar depois:**`)
  tierB.forEach((r, i) => {
    const a = ANALISES[r.id]
    out.push(`${i + 1}. ${r.nome} — \`${detectarTipoOferta(r.categoria)}\` · ${r.nota} (${r.num_avaliacoes} aval). *${a.razao_ranking.split('.')[0]}.*`)
  })
  out.push('')
  out.push(`**TIER C (${tierC.length}) — red flag, qualificar antes:**`)
  tierC.forEach((r, i) => {
    const a = ANALISES[r.id]
    out.push(`${i + 1}. ${r.nome} — \`${detectarTipoOferta(r.categoria)}\` · ${r.nota} (${r.num_avaliacoes} aval). *${a.razao_ranking.split('.')[0]}.*`)
  })
  out.push('')
  out.push(`---`)
  out.push('')
  out.push(`## Oferta consolidada — Grand Slam Offer (Hormozi)`)
  out.push('')
  out.push(`Toda oferta segue 4 vetores da **Equação de Valor**: (Sonho × Probabilidade) / (Tempo × Esforço). Bônus stack categorizado em 4 tipos: **AMPLIA** o resultado / **ACELERA** entrega / **REMOVE ESFORÇO** do cliente / **REMOVE RISCO**.`)
  out.push('')
  out.push(`### Pacote Lançamento Vitalício (LP — R$499)`)
  out.push('')
  out.push(`> *Aparece no Google em 7 dias e nunca mais paga hospedagem.*`)
  out.push('')
  out.push(`**O que entra:**`)
  out.push(`- Landing Page Next.js otimizada pra SEO local (mobile-first, carrega em 1s)`)
  out.push(`- Botão WhatsApp flutuante com mensagem pré-preenchida`)
  out.push(`- Formulário de captura integrado ao seu WhatsApp/email`)
  out.push('')
  out.push(`**Bônus stack (R$2.500 de valor de mercado):**`)
  out.push(`- 🔥 **AMPLIA:** 3 artigos SEO ranqueados pra captar tráfego orgânico vitalício (R$500)`)
  out.push(`- ⚡ **ACELERA:** entrega em 7 dias contados do briefing (mercado entrega em 30-60)`)
  out.push(`- 🪶 **REMOVE ESFORÇO:** call de alinhamento de 20 min onde sai um protótipo funcional Next.js já no ar (você não explica nada do zero)`)
  out.push(`- 🛡️ **REMOVE RISCO:** hospedagem **vitalícia** grátis (mercado: R$30/mês × eternidade) + garantia de 7 dias após prévia`)
  out.push('')
  out.push(`**Ancoragem de mercado:**`)
  out.push(`- Agência local Palmas: R$1.500-3.000 + R$200/mês de mensalidade`)
  out.push(`- Fiverr terceirizado: R$800-1.200 SEM SEO, blog ou hosting`)
  out.push(`- **Impulso Digital: R$499 uma vez** (50% entrada, 50% na entrega)`)
  out.push('')
  out.push(`**Garantia condicional:** "Se a prévia visual não for a cara do seu negócio, devolvo 100%. Antes de a gente publicar."`)
  out.push('')
  out.push(`**Escassez REAL:** Promo hospedagem vitalícia válida só pros primeiros 10 fechamentos. Depois volta pra R$49,90/mês de hosting.`)
  out.push('')
  out.push(`### Pacote Loja-Que-Vende-Dormindo (Shopify — R$599)`)
  out.push('')
  out.push(`> *Sua loja vende enquanto você dorme — você só recebe o pedido pronto pra despachar.*`)
  out.push('')
  out.push(`**O que entra:**`)
  out.push(`- Loja Shopify com tema MPN (mesmo da UrbanFeet, 1.600+ pares vendidos)`)
  out.push(`- 20 produtos cadastrados (foto + descrição + variações)`)
  out.push(`- Integração Yampi (checkout) + Melhor Envio (frete automático)`)
  out.push(`- Mercado Pago configurado (Pix + cartão 12x + boleto)`)
  out.push('')
  out.push(`**Bônus stack (R$3.200 de valor de mercado):**`)
  out.push(`- 🔥 **AMPLIA:** lista de fornecedores Palmas + scripts de prospecção pra atacado (R$400)`)
  out.push(`- ⚡ **ACELERA:** Shopify a $1/mês nos 3 primeiros meses (economia R$300)`)
  out.push(`- 🪶 **REMOVE ESFORÇO:** call de alinhamento de 30 min com diagnóstico operacional ao vivo (motoboy + MP + frete + fornecedores)`)
  out.push(`- 🛡️ **REMOVE RISCO:** call de entrega gravada — você revê quantas vezes precisar`)
  out.push('')
  out.push(`**Ancoragem de mercado:**`)
  out.push(`- Agência local Palmas: R$1.500-4.000 + mensalidade`)
  out.push(`- Fiverr terceirizado: R$1.200-2.000 SEM tema profissional, integrações ou call`)
  out.push(`- **Impulso Digital: R$599 uma vez** (50% entrada, 50% na entrega)`)
  out.push('')
  out.push(`**Prova social viva:** Gabriel da GB Nutrition (personal trainer em Palmas) virou loja automatizada de suplementos com entrega expressa no mesmo dia. Plano de Negócio entregue, loja no ar.`)
  out.push('')
  out.push(`**Garantia condicional:** "Antes de publicar, você aprova a prévia. Se não for a cara do seu negócio, devolvo 100%."`)
  out.push('')
  out.push(`---`)
  out.push('')
  out.push(`## Princípios de abordagem (5 livros)`)
  out.push('')
  out.push(`Antes de cada disparo, lembrar:`)
  out.push(`- **Award Frame (Klaff):** Eduardo NÃO suplica. Ele AVALIA se vale ajudar esse lead. Postura de quem tem agenda cheia, não de quem precisa fechar.`)
  out.push(`- **Labeling (Voss):** "Me parece que tu..." antes de qualquer pitch. Antecipa o que ele tá sentindo e ele baixa a guarda.`)
  out.push(`- **Black Swan question:** termina abertura com uma pergunta que dói. Não "quer um site?" — "quem busca [seu serviço] hoje em Palmas, te acha?"`)
  out.push(`- **Calibrated Questions:** "Como…" e "O que…" — NUNCA "Por que" (soa acusatório).`)
  out.push(`- **Hot Cognition (Klaff):** mira emoção (medo de perder, ambição, status), não razão.`)
  out.push(`- **Hill — desejo ardente:** se o lead disser "vou pensar", insiste com mais um ângulo. Nunca passivo.`)
  out.push(`- **Tom Eduardo:** "tamo junto", "olha", "pensa comigo", "tu manda?". Curto. Sem corporativês. Pontuação de chat real.`)
  out.push('')
  out.push(`---`)
  out.push('')

  out.push(`## TIER A — Atacar primeiro (${tierA.length})`)
  out.push('')
  tierA.forEach((r, i) => {
    out.push(`### A${i + 1}. ${r.nome}`)
    out.push('')
    out.push(...blocoLead(r, ANALISES[r.id]))
    out.push(`---`)
    out.push('')
  })
  out.push(`## TIER B — Atacar depois (${tierB.length})`)
  out.push('')
  tierB.forEach((r, i) => {
    out.push(`### B${i + 1}. ${r.nome}`)
    out.push('')
    out.push(...blocoLead(r, ANALISES[r.id]))
    out.push(`---`)
    out.push('')
  })
  out.push(`## TIER C — Qualificar antes (${tierC.length})`)
  out.push('')
  tierC.forEach((r, i) => {
    out.push(`### C${i + 1}. ${r.nome}`)
    out.push('')
    out.push(...blocoLead(r, ANALISES[r.id]))
    out.push(`---`)
    out.push('')
  })

  const md = out.join('\n')
  const outPath = resolve(process.cwd(), 'top-14-disparo.md')
  writeFileSync(outPath, md, 'utf-8')
  console.error(`Playbook salvo em: ${outPath}`)
  console.error(`Tier A: ${tierA.length} · B: ${tierB.length} · C: ${tierC.length}`)
  console.error(`Tamanho: ${md.length.toLocaleString()} chars · ${md.split('\n').length} linhas`)
}

main().catch(e => { console.error(e); process.exit(1) })
