import { NextResponse } from 'next/server'
import { getClient } from '@/lib/db'
import { ANALISES, type Analise } from '@/lib/disparo-analises'
import {
  detectarTipoOferta,
  escolherScriptAbordagem,
  pickDiagnostico,
  gerarLinkWhatsApp,
} from '@/lib/mensagens'

export const dynamic = 'force-dynamic'

type LeadRow = {
  id: number
  nome: string
  categoria: string
  telefone: string
  instagram: string | null
  instagram_url: string | null
  site: string | null
  nota: number | null
  num_avaliacoes: number | null
}

export type LeadDisparo = {
  id: number
  nome: string
  categoria: string
  telefone: string
  telefoneFormatado: string
  instagram: string | null
  site: string
  nota: number | null
  numAvaliacoes: number | null
  oferta: string
  tier: 'A' | 'B' | 'C'
  posicao: number
  analise: Analise
  scripts: {
    abertura: string
    followupD3: string
    followupD7: string
    preEngajamentoIg: string
    diagnostico: { variante: string; texto: string }
    pitchSeSoIG: string
    pitchSeTemSite: string
    fechamento: string
    callAlinhamento?: string
  }
  linkWhatsApp: string
  linksFollowup: {
    d3: string
    d7: string
  }
}

function resolverSite(siteRaw: string | null): string {
  if (!siteRaw) return 'NÃO TEM'
  if (/google\.com\/maps/i.test(siteRaw)) return 'NÃO TEM (só Maps)'
  return siteRaw
}

function formatarTelefone(tel: string): string {
  const d = tel.replace(/\D/g, '')
  if (d.length === 13 && d.startsWith('55')) {
    return `(${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`
  }
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return tel
}

export async function GET() {
  const db = getClient()

  const ids = Object.keys(ANALISES).map(Number)
  if (ids.length === 0) {
    return NextResponse.json({ ok: true, leads: [] })
  }
  const placeholders = ids.map(() => '?').join(',')

  const res = await db.execute({
    sql: `SELECT id, nome, categoria, telefone, instagram, instagram_url, site, nota, num_avaliacoes
            FROM leads
           WHERE id IN (${placeholders})`,
    args: ids,
  })

  const leads: LeadDisparo[] = (res.rows as unknown as LeadRow[])
    .map((r) => {
      const a = ANALISES[r.id]
      if (!a) return null
      const script = escolherScriptAbordagem({
        nome: r.nome,
        categoria: r.categoria,
      }).script
      const diag = pickDiagnostico(script, r.telefone)
      const link = gerarLinkWhatsApp(r.telefone, a.abertura)
      const oferta = detectarTipoOferta(r.categoria)

      const lead: LeadDisparo = {
        id: r.id,
        nome: r.nome,
        categoria: r.categoria,
        telefone: r.telefone,
        telefoneFormatado: formatarTelefone(r.telefone),
        instagram: r.instagram ? `@${r.instagram.replace(/^@/, '')}` : null,
        site: resolverSite(r.site),
        nota: r.nota,
        numAvaliacoes: r.num_avaliacoes,
        oferta,
        tier: a.tier,
        posicao: a.posicao_no_tier,
        analise: a,
        scripts: {
          abertura: a.abertura,
          followupD3: a.followup_d3,
          followupD7: a.followup_d7,
          preEngajamentoIg: a.pre_engajamento_ig,
          diagnostico: { variante: diag.variante, texto: diag.texto },
          pitchSeSoIG: script.pitch_se_so_ig,
          pitchSeTemSite: script.pitch_se_tem_site,
          fechamento: script.fechamento,
          callAlinhamento: script.call_alinhamento || undefined,
        },
        linkWhatsApp: link,
        linksFollowup: {
          d3: gerarLinkWhatsApp(r.telefone, a.followup_d3),
          d7: gerarLinkWhatsApp(r.telefone, a.followup_d7),
        },
      }
      return lead
    })
    .filter((x): x is LeadDisparo => x !== null)
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier.localeCompare(b.tier)
      return a.posicao - b.posicao
    })

  const stats = {
    total: leads.length,
    tierA: leads.filter((l) => l.tier === 'A').length,
    tierB: leads.filter((l) => l.tier === 'B').length,
    tierC: leads.filter((l) => l.tier === 'C').length,
  }

  return NextResponse.json({
    ok: true,
    leads,
    stats,
    geradoEm: new Date().toISOString(),
  })
}
