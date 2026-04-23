// Puxa 7 melhores LP + 7 melhores Shopify e gera PLAYBOOK COMPLETO por lead:
// análise estratégica via Gemini (gerarAbordagem) + as 4 mensagens prontas
// + link wa.me direto. Saída: markdown pronto pra Eduardo clicar e disparar.
//
// Critérios: status='novo', tem telefone, tem IG, categoria útil.
// Meta: fechar 2 dos 14 nesta semana.

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
import { gerarAbordagem } from '../lib/gemini'

type Row = {
  id: number
  nome: string
  categoria: string
  telefone: string | null
  instagram: string | null
  instagram_url: string | null
  instagram_bio: string | null
  instagram_seguidores: string | null
  site: string | null
  endereco: string | null
  nota: number | null
  num_avaliacoes: number | null
  tem_site: number
  tem_ecommerce: number
  tem_agendamento: number
  tipo: string
  status: string
}

function rowToDadosLead(r: Row) {
  return {
    nome: r.nome,
    categoria: r.categoria,
    tipo: (r.tipo as 'lp' | 'shopify' | 'agendapro') ?? 'lp',
    telefone: r.telefone ?? undefined,
    instagram: r.instagram ?? undefined,
    instagram_bio: r.instagram_bio ?? undefined,
    instagram_seguidores: r.instagram_seguidores ?? undefined,
    site: r.site ?? undefined,
    endereco: r.endereco ?? undefined,
    nota: r.nota ?? undefined,
    num_avaliacoes: r.num_avaliacoes ?? undefined,
    tem_site:        !!r.tem_site,
    tem_ecommerce:   !!r.tem_ecommerce,
    tem_agendamento: !!r.tem_agendamento,
  }
}

async function playbookPorLead(r: Row): Promise<string[]> {
  const oferta = detectarTipoOferta(r.categoria)
  const script = escolherScriptAbordagem({ nome: r.nome, categoria: r.categoria }).script
  const diag = pickDiagnostico(script, r.telefone ?? '000')

  // Chama Gemini pra análise específica + abertura cirúrgica
  let analise: { mensagem: string; diagnostico: string; argumento: string; urgencia: string }
  try {
    analise = await gerarAbordagem(rowToDadosLead(r))
  } catch (e: any) {
    analise = {
      mensagem:    script.abertura,
      diagnostico: `Fallback: ${String(e?.message ?? e).slice(0, 120)}`,
      argumento:   'Usar script padrão',
      urgencia:    'A definir',
    }
  }

  // Link wa.me com a abertura cirúrgica pré-preenchida
  const linkWpp = r.telefone
    ? gerarLinkWhatsApp(r.telefone, analise.mensagem)
    : null

  const ig = r.instagram ? `@${r.instagram.replace(/^@/, '')}` : (r.instagram_url ?? '—')
  const seg = r.instagram_seguidores ? ` (${r.instagram_seguidores} seg.)` : ''
  const bio = r.instagram_bio ? `"${r.instagram_bio.slice(0, 160).replace(/\n/g, ' ')}"` : '—'

  const lines: string[] = []
  lines.push(`**Ficha:** ${r.categoria} · Google ${r.nota ?? '—'} (${r.num_avaliacoes ?? 0} aval) · IG ${ig}${seg}`)
  lines.push(`**Bio IG:** ${bio}`)
  lines.push(`**Site:** ${r.site && !/google\.com\/maps/i.test(r.site) ? r.site : 'NÃO TEM'} · Agenda online: ${r.tem_agendamento ? 'sim' : 'não'}`)
  lines.push(`**Telefone:** \`${r.telefone}\``)
  lines.push('')
  lines.push(`**Diagnóstico estratégico (Gemini):**`)
  lines.push(`- ${analise.diagnostico}`)
  lines.push(`- **Argumento de fechamento:** ${analise.argumento}`)
  lines.push(`- **Urgência:** ${analise.urgencia}`)
  lines.push('')
  lines.push(`**Oferta que vai rodar:** \`${oferta}\``)
  lines.push('')
  lines.push(`#### Msg 1 — Abertura cirúrgica (Gemini, específica pro ${r.nome.split(' ')[0]})`)
  lines.push('```')
  lines.push(analise.mensagem)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 2 — Diagnóstico (variante ${diag.variante})`)
  lines.push('```')
  lines.push(diag.texto)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 3A — Pitch se ele disser "só tenho Instagram"`)
  lines.push('```')
  lines.push(script.pitch_se_so_ig)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 3B — Pitch se ele disser "tenho site"`)
  lines.push('```')
  lines.push(script.pitch_se_tem_site)
  lines.push('```')
  lines.push('')
  lines.push(`#### Msg 4 — Fechamento com 3 horários`)
  lines.push('```')
  lines.push(script.fechamento)
  lines.push('```')
  if (script.call_alinhamento) {
    lines.push('')
    lines.push(`#### Arma de fechamento — Call de alinhamento (se ele travar com "e o meu caso?")`)
    lines.push('```')
    lines.push(script.call_alinhamento)
    lines.push('```')
  }
  lines.push('')
  if (linkWpp) {
    lines.push(`**→ Disparar direto no WhatsApp (msg 1 já pré-preenchida):** ${linkWpp}`)
    lines.push('')
  }
  return lines
}

async function main() {
  const db = getClient()

  const res = await db.execute(
    `SELECT id, nome, categoria, telefone, instagram, instagram_url, instagram_bio,
            instagram_seguidores, site, endereco, nota, num_avaliacoes,
            tem_site, tem_ecommerce, tem_agendamento, tipo, status
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
    const nome = (r.nome ?? '').toLowerCase()
    if (/\bshopping\b/.test(nome)) return false
    return true
  })
  console.error(`Após filtro de categoria/nome: ${filtrados.length}`)

  const lp: Row[] = []
  const shopify: Row[] = []
  for (const r of filtrados) {
    const oferta = detectarTipoOferta(r.categoria ?? '')
    if (oferta === 'shopify-solo' && shopify.length < 7) shopify.push(r)
    else if (oferta === 'lp-solo' && lp.length < 7)       lp.push(r)
    if (lp.length === 7 && shopify.length === 7) break
  }
  console.error(`Selecionados — LP: ${lp.length} | Shopify: ${shopify.length}`)

  const out: string[] = []
  out.push(`# Playbook de disparo — 14 leads (2026-04-23 noite)`)
  out.push('')
  out.push(`**Meta:** fechar 2 serviços nesta semana entre os 14.`)
  out.push(`**Filtros:** status='novo' · tem telefone · tem IG · categoria útil.`)
  out.push(`**Ordem:** num_avaliacoes DESC → nota DESC.`)
  out.push('')
  out.push(`Cada lead tem: análise Gemini (diagnóstico + ângulo + urgência) · as 4 mensagens prontas (msg 1 cirúrgica, msg 2 diagnóstico A/B/C, msg 3 pitch se_so_ig + se_tem_site, msg 4 fechamento) · call_alinhamento como arma de travamento · link wa.me direto.`)
  out.push('')
  out.push('---')
  out.push('')
  out.push('## 7 leads — LP (R$499)')
  out.push('')
  out.push('**Oferta:** Landing Page. Valor de mercado empilhado R$2.500. Preço R$499 uma vez. Hospedagem vitalícia + 3 artigos SEO grátis. Garantia 7d.')
  out.push('')

  for (let i = 0; i < lp.length; i++) {
    const r = lp[i]
    console.error(`Gerando playbook LP ${i + 1}/${lp.length}: ${r.nome}`)
    out.push(`### LP ${i + 1}. ${r.nome}`)
    out.push('')
    const bloco = await playbookPorLead(r)
    out.push(...bloco)
    out.push('---')
    out.push('')
    await new Promise(r => setTimeout(r, 2500))  // evita rajada no Gemini
  }

  out.push('## 7 leads — Shopify (R$599)')
  out.push('')
  out.push('**Oferta:** Loja Shopify com tema MPN + 20 produtos + integrações. Valor de mercado R$3.200. Preço R$599 uma vez. Shopify $1/mês por 3m + fornecedores + scripts + call gravada grátis. Entrega 7-10d.')
  out.push('')

  for (let i = 0; i < shopify.length; i++) {
    const r = shopify[i]
    console.error(`Gerando playbook Shopify ${i + 1}/${shopify.length}: ${r.nome}`)
    out.push(`### SHOPIFY ${i + 1}. ${r.nome}`)
    out.push('')
    const bloco = await playbookPorLead(r)
    out.push(...bloco)
    out.push('---')
    out.push('')
    await new Promise(r => setTimeout(r, 2500))  // evita rajada no Gemini
  }

  const md = out.join('\n')
  const outPath = resolve(process.cwd(), 'top-14-disparo.md')
  writeFileSync(outPath, md, 'utf-8')
  console.error(`\nSalvo em: ${outPath}`)
  console.error(`Tamanho: ${md.length.toLocaleString()} chars · ${md.split('\n').length} linhas`)
}

main().catch(e => { console.error(e); process.exit(1) })
