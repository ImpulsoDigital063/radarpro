'use client'

import { useEffect, useState } from 'react'
import HeaderRadarPRO from '@/components/HeaderRadarPRO'

type Analise = {
  tier: 'A' | 'B' | 'C'
  posicao_no_tier: number
  dor: string
  gancho: string
  objecao: string
  resposta_objecao: string
  abertura: string
  razao_ranking: string
  nota_interna?: string
}

type LeadDisparo = {
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
    pitchSeTemSiteResposta?: string
    fechamento: string
    callAlinhamento?: string
  }
  linkWhatsApp: string
  linksFollowup: {
    d3: string
    d7: string
  }
}

const card = '#111827'
const brd = '#1F2937'
const txt = '#F9FAFB'
const muted = '#6B7280'

const TIPO: Record<string, { label: string; emoji: string; cor: string }> = {
  'lp-solo':       { label: 'Landing Page', emoji: '📄', cor: '#2563EB' },
  'shopify-solo':  { label: 'Shopify',       emoji: '🛒', cor: '#10B981' },
  'agendapro-solo':{ label: 'AgendaPRO',     emoji: '📅', cor: '#7C3AED' },
  'consultoria':   { label: 'Consultoria',   emoji: '🎓', cor: '#F59E0B' },
}

const TIER: Record<'A' | 'B' | 'C', { label: string; cor: string; fundo: string }> = {
  A: { label: 'Tier A — atacar primeiro', cor: '#EF4444', fundo: '#1A0A0A' },
  B: { label: 'Tier B — atacar depois',   cor: '#F59E0B', fundo: '#1A1500' },
  C: { label: 'Tier C — qualificar antes', cor: '#6B7280', fundo: '#1F2937' },
}

export default function DisparoPage() {
  const [leads, setLeads]       = useState<LeadDisparo[]>([])
  const [loading, setLoading]   = useState(true)
  const [erro, setErro]         = useState<string | null>(null)
  const [tierF, setTierF]       = useState<'todos' | 'A' | 'B' | 'C'>('todos')
  const [expandido, setExpandido] = useState<number | null>(null)
  const [secaoAberta, setSecaoAberta] = useState<Record<string, boolean>>({})
  const [copiado, setCopiado]   = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/disparo')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setLeads(data.leads ?? [])
        else setErro(data.erro ?? 'Erro desconhecido')
      })
      .catch((e) => setErro(String(e)))
      .finally(() => setLoading(false))
  }, [])

  function copiar(key: string, texto: string) {
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(key)
      setTimeout(() => setCopiado(null), 1500)
    })
  }

  const leadsFiltrados = tierF === 'todos' ? leads : leads.filter((l) => l.tier === tierF)
  const stats = {
    total: leads.length,
    A: leads.filter((l) => l.tier === 'A').length,
    B: leads.filter((l) => l.tier === 'B').length,
    C: leads.filter((l) => l.tier === 'C').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', color: txt, fontFamily: 'system-ui, sans-serif' }}>
      <HeaderRadarPRO activeTab="disparo" />

      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ padding: '20px 32px 8px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>Playbook de disparo — top 14 leads</h1>
          <p style={{ color: muted, fontSize: '12px', marginTop: '6px' }}>
            14 leads priorizados (7 LP + 7 Shopify) com playbook pré-calibrado pelos 5 livros (Voss, Klaff, Hormozi, Cialdini, Hill).
            Atacar Tier A primeiro. Mensagens prontas pra copiar — Eduardo só ajusta o que o lead disser.
          </p>
        </div>

        {/* Stats */}
        <div style={{ padding: '8px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
          <Stat label="Total"   valor={stats.total} cor={txt} />
          <Stat label="Tier A"  valor={stats.A}     cor="#FCA5A5" />
          <Stat label="Tier B"  valor={stats.B}     cor="#FCD34D" />
          <Stat label="Tier C"  valor={stats.C}     cor="#9CA3AF" />
        </div>

        {/* Filtros — formato igual /Painel */}
        <div style={{ padding: '12px 32px', borderBottom: `1px solid ${brd}`, display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: muted, marginRight: '4px' }}>Tier:</span>
          {(['todos', 'A', 'B', 'C'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTierF(t)}
              style={{
                padding: '4px 10px',
                borderRadius: '5px',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: tierF === t ? '#2563EB' : '#1F2937',
                color: tierF === t ? '#fff' : muted,
              }}
            >
              {t === 'todos' ? 'Todos' : `Tier ${t}`}
            </button>
          ))}
        </div>

        {/* Lista — mesmo estilo do /Painel */}
        <div style={{ padding: '20px 32px 40px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: muted }}>Carregando playbook…</div>
          )}

          {erro && (
            <div style={{ background: '#7F1D1D33', border: '1px solid #DC2626', borderRadius: '8px', padding: '14px', color: '#FCA5A5' }}>
              {erro}
            </div>
          )}

          {!loading && !erro && leadsFiltrados.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#4B5563', fontSize: '13px' }}>
              Nenhum lead nesse filtro.
            </div>
          )}

          {!loading && !erro && leadsFiltrados.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p style={{ fontSize: '11px', color: muted, marginBottom: '8px' }}>
                {leadsFiltrados.length} lead{leadsFiltrados.length !== 1 ? 's' : ''} · ordenado por tier
              </p>

              {leadsFiltrados.map((lead) => {
                const ti = TIPO[lead.oferta] ?? { label: lead.oferta, emoji: '📦', cor: muted }
                const tr = TIER[lead.tier]
                const aberto = expandido === lead.id

                return (
                  <div key={lead.id} style={{ background: card, border: `1px solid ${aberto ? tr.cor + '55' : brd}`, borderRadius: '10px', overflow: 'hidden' }}>
                    {/* Linha principal — mesmo formato /Painel */}
                    <div
                      style={{
                        padding: '12px 16px',
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        gap: '12px',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => setExpandido(aberto ? null : lead.id)}
                    >
                      {/* Tier badge — substitui o score do /Painel */}
                      <div style={{ textAlign: 'center', minWidth: '40px' }}>
                        <p style={{ fontSize: '16px', margin: 0, color: tr.cor, fontWeight: 800 }}>
                          {lead.tier}
                          {lead.posicao}
                        </p>
                        <p style={{ fontSize: '9px', color: tr.cor, margin: 0, fontWeight: 700, letterSpacing: '0.05em' }}>
                          TIER
                        </p>
                      </div>

                      {/* Info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: ti.cor + '25', color: ti.cor }}>
                            {ti.emoji} {ti.label}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: txt }}>{lead.nome}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: muted, margin: 0 }}>
                          {lead.categoria}
                          {lead.telefone && ` · 📱 ${lead.telefoneFormatado}`}
                          {lead.nota !== null && ` · ⭐ ${lead.nota}`}
                          {lead.numAvaliacoes ? ` (${lead.numAvaliacoes} aval.)` : ''}
                          {lead.instagram && ` · ${lead.instagram}`}
                        </p>
                      </div>

                      {/* Ações */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <a
                          href={lead.linkWhatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            padding: '4px 10px',
                            background: '#16A34A',
                            borderRadius: '5px',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          💬 WA
                        </a>
                        <span style={{ color: muted, fontSize: '14px' }}>{aberto ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* Expansão — playbook pronto */}
                    {aberto && (
                      <div style={{ borderTop: `1px solid ${brd}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Links rápidos */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                          {lead.instagram && (
                            <a
                              href={`https://instagram.com/${lead.instagram.replace(/^@/, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ padding: '5px 12px', background: '#1F2937', border: `1px solid ${brd}`, borderRadius: '6px', color: '#E1306C', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                            >
                              📸 {lead.instagram}
                            </a>
                          )}
                          {lead.site !== 'NÃO TEM' && !lead.site.startsWith('NÃO TEM') && (
                            <a href={lead.site} target="_blank" rel="noopener noreferrer"
                              style={{ padding: '5px 12px', background: '#1F2937', border: `1px solid ${brd}`, borderRadius: '6px', color: '#60A5FA', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                              🌐 Site atual
                            </a>
                          )}
                          <a href={lead.linkWhatsApp} target="_blank" rel="noopener noreferrer"
                            style={{ padding: '5px 12px', background: '#1F2937', border: `1px solid ${brd}`, borderRadius: '6px', color: '#4ADE80', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                            💬 WhatsApp
                          </a>
                        </div>

                        {/* Banner: playbook pré-calibrado */}
                        <div
                          style={{
                            padding: '12px 14px',
                            background: 'linear-gradient(135deg, #7C3AED 0%, #C026D3 100%)',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: 800,
                            textAlign: 'center',
                            letterSpacing: '0.02em',
                          }}
                        >
                          🎯 Playbook calibrado pelos 5 livros — pronto pra disparar
                        </div>

                        {/* Razão do ranking — INFO INTERNA pro Eduardo (cor amarela = nota privada) */}
                        <Secao
                          keyId={`${lead.id}:razao`}
                          titulo="💡 Razão do ranking (interno — não é pra mandar)"
                          cor="#F59E0B"
                          aberta={secaoAberta[`${lead.id}:razao`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:razao`]: !(p[`${lead.id}:razao`] !== false) }))}
                        >
                          <div style={{ padding: '10px 12px', background: '#1A1500', border: '1px solid #D97706', borderRadius: '7px', fontSize: '12px', color: '#FCD34D', lineHeight: 1.5 }}>
                            {lead.analise.razao_ranking}
                          </div>
                        </Secao>

                        {/* Nota interna específica — só aparece se a análise tem instrução privada */}
                        {lead.analise.nota_interna && (
                          <Secao
                            keyId={`${lead.id}:notainterna`}
                            titulo="📌 Nota interna (FAZER ANTES de disparar)"
                            cor="#F59E0B"
                            aberta={secaoAberta[`${lead.id}:notainterna`] !== false}
                            onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:notainterna`]: !(p[`${lead.id}:notainterna`] !== false) }))}
                          >
                            <div style={{ padding: '10px 12px', background: '#1A1500', border: '1px solid #D97706', borderRadius: '7px', fontSize: '12px', color: '#FCD34D', lineHeight: 1.5, fontWeight: 600 }}>
                              {lead.analise.nota_interna}
                            </div>
                            <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '4px 0 0', fontStyle: 'italic' }}>
                              Esse texto é SÓ PRA TI — não copia/cola pro cliente. É instrução pré-abordagem.
                            </p>
                          </Secao>
                        )}

                        <Secao
                          keyId={`${lead.id}:dor`}
                          titulo="💥 Dor real do lead"
                          cor="#EF4444"
                          aberta={secaoAberta[`${lead.id}:dor`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:dor`]: !(p[`${lead.id}:dor`] !== false) }))}
                        >
                          <div style={{ padding: '10px 12px', background: '#1A0A0A', border: '1px solid #2D1515', borderRadius: '7px', fontSize: '12px', color: '#FCA5A5', lineHeight: 1.5 }}>
                            {lead.analise.dor}
                          </div>
                        </Secao>

                        <Secao
                          keyId={`${lead.id}:gancho`}
                          titulo="🎣 Gancho da oferta — como nossa solução resolve"
                          cor="#10B981"
                          aberta={secaoAberta[`${lead.id}:gancho`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:gancho`]: !(p[`${lead.id}:gancho`] !== false) }))}
                        >
                          <div style={{ padding: '10px 12px', background: '#0A1A14', border: '1px solid #10B98140', borderRadius: '7px', fontSize: '12px', color: '#86EFAC', lineHeight: 1.5 }}>
                            {lead.analise.gancho}
                          </div>
                        </Secao>

                        {/* Mensagens */}
                        <Secao
                          keyId={`${lead.id}:preig`}
                          titulo="📸 D-1: Pré-engajamento Instagram (24h ANTES da Msg 1)"
                          cor="#EC4899"
                          aberta={secaoAberta[`${lead.id}:preig`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:preig`]: !(p[`${lead.id}:preig`] !== false) }))}
                        >
                          <div style={{ padding: '10px 12px', background: '#1A0A14', border: '1px solid #EC489940', borderRadius: '7px', fontSize: '12px', color: '#F9A8D4', lineHeight: 1.5 }}>
                            {lead.scripts.preEngajamentoIg}
                          </div>
                          <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '4px 0 0', fontStyle: 'italic' }}>
                            Multichannel = +287% respostas (Landbase 2025). Aquece o perfil antes do WhatsApp chegar.
                          </p>
                        </Secao>

                        <Secao
                          keyId={`${lead.id}:abord`}
                          titulo="📍 D+0: Msg 1 — Abertura cirúrgica (timeline hook + Voss + <80 palavras)"
                          cor="#60A5FA"
                          aberta={secaoAberta[`${lead.id}:abord`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:abord`]: !(p[`${lead.id}:abord`] !== false) }))}
                        >
                          <Msg keyId={`${lead.id}-abord`} texto={lead.scripts.abertura} cor="#60A5FA" copiar={copiar} copiado={copiado} />
                        </Secao>

                        <Secao
                          keyId={`${lead.id}:fup3`}
                          titulo="🔁 D+3: Follow-up (se não respondeu — pivô diferente)"
                          cor="#F59E0B"
                          aberta={secaoAberta[`${lead.id}:fup3`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:fup3`]: !(p[`${lead.id}:fup3`] !== false) }))}
                        >
                          <Msg keyId={`${lead.id}-fup3`} texto={lead.scripts.followupD3} cor="#F59E0B" copiar={copiar} copiado={copiado} />
                          <a
                            href={lead.linksFollowup.d3}
                            target="_blank"
                            rel="noopener"
                            style={{
                              alignSelf: 'flex-start',
                              padding: '4px 10px',
                              background: '#16A34A22',
                              border: '1px solid #16A34A',
                              borderRadius: '5px',
                              color: '#86EFAC',
                              fontSize: '11px',
                              fontWeight: 700,
                              textDecoration: 'none',
                              marginTop: '4px',
                            }}
                          >
                            💬 Abrir WhatsApp com follow-up D+3
                          </a>
                          <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '4px 0 0', fontStyle: 'italic' }}>
                            42% das respostas vêm em follow-up. 48% dos vendedores NUNCA mandam segundo toque.
                          </p>
                        </Secao>

                        <Secao
                          keyId={`${lead.id}:fup7`}
                          titulo="🚪 D+7: Breakup message (última tentativa)"
                          cor="#DC2626"
                          aberta={secaoAberta[`${lead.id}:fup7`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:fup7`]: !(p[`${lead.id}:fup7`] !== false) }))}
                        >
                          <Msg keyId={`${lead.id}-fup7`} texto={lead.scripts.followupD7} cor="#DC2626" copiar={copiar} copiado={copiado} />
                          <a
                            href={lead.linksFollowup.d7}
                            target="_blank"
                            rel="noopener"
                            style={{
                              alignSelf: 'flex-start',
                              padding: '4px 10px',
                              background: '#16A34A22',
                              border: '1px solid #16A34A',
                              borderRadius: '5px',
                              color: '#86EFAC',
                              fontSize: '11px',
                              fontWeight: 700,
                              textDecoration: 'none',
                              marginTop: '4px',
                            }}
                          >
                            💬 Abrir WhatsApp com breakup D+7
                          </a>
                          <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '4px 0 0', fontStyle: 'italic' }}>
                            Breakup tem 15-20% reply rate (mais alto da sequência). Depois disso, lead sai da lista ativa por 90 dias.
                          </p>
                        </Secao>

                        <Secao
                          keyId={`${lead.id}:diag`}
                          titulo={`💬 Msg 2 — Diagnóstico (variante ${lead.scripts.diagnostico.variante})`}
                          cor="#818CF8"
                          aberta={secaoAberta[`${lead.id}:diag`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:diag`]: !(p[`${lead.id}:diag`] !== false) }))}
                        >
                          <Msg keyId={`${lead.id}-diag`} texto={lead.scripts.diagnostico.texto} cor="#818CF8" copiar={copiar} copiado={copiado} />
                        </Secao>

                        <Secao
                          keyId={`${lead.id}:apres`}
                          titulo="🎯 Msg 3 — Apresentação (2 vias conforme resposta)"
                          cor="#A78BFA"
                          aberta={secaoAberta[`${lead.id}:apres`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:apres`]: !(p[`${lead.id}:apres`] !== false) }))}
                        >
                          <p style={{ fontSize: '10px', color: '#A78BFA', margin: 0, fontWeight: 700 }}>→ SE ele disser "só Instagram / só indicação":</p>
                          <Msg keyId={`${lead.id}-pitchIG`} texto={lead.scripts.pitchSeSoIG} cor="#A78BFA" copiar={copiar} copiado={copiado} />
                          <p style={{ fontSize: '10px', color: '#A78BFA', margin: '6px 0 0', fontWeight: 700 }}>→ SE ele disser "tenho site" — primeiro pede o link:</p>
                          <Msg keyId={`${lead.id}-pitchSite`} texto={lead.scripts.pitchSeTemSite} cor="#A78BFA" copiar={copiar} copiado={copiado} />
                          {lead.scripts.pitchSeTemSiteResposta && (
                            <>
                              <p style={{ fontSize: '10px', color: '#A78BFA', margin: '6px 0 0', fontWeight: 700 }}>→ Depois que ele mandar o link (ajustar [X] com dado real):</p>
                              <Msg keyId={`${lead.id}-pitchSiteResp`} texto={lead.scripts.pitchSeTemSiteResposta} cor="#A78BFA" copiar={copiar} copiado={copiado} />
                            </>
                          )}
                        </Secao>

                        <Secao
                          keyId={`${lead.id}:obj`}
                          titulo="🛡 Objeção esperada + como responder"
                          cor="#DC2626"
                          aberta={secaoAberta[`${lead.id}:obj`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:obj`]: !(p[`${lead.id}:obj`] !== false) }))}
                        >
                          <p style={{ fontSize: '10px', color: '#FCA5A5', margin: 0, fontWeight: 700 }}>💬 Objeção provável:</p>
                          <div style={{ padding: '10px 12px', background: '#1A0A0A', border: '1px solid #DC262640', borderRadius: '7px', fontSize: '12px', color: '#FCA5A5', lineHeight: 1.5 }}>
                            {lead.analise.objecao}
                          </div>
                          <p style={{ fontSize: '10px', color: '#86EFAC', margin: '6px 0 0', fontWeight: 700 }}>💡 Como responder (estratégia):</p>
                          <div style={{ padding: '10px 12px', background: '#0A1A14', border: '1px solid #10B98140', borderRadius: '7px', fontSize: '12px', color: '#86EFAC', lineHeight: 1.5 }}>
                            {lead.analise.resposta_objecao}
                          </div>
                        </Secao>

                        <Secao
                          keyId={`${lead.id}:fech`}
                          titulo="🎣 Msg 4 — Fechamento"
                          cor="#16A34A"
                          aberta={secaoAberta[`${lead.id}:fech`] !== false}
                          onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:fech`]: !(p[`${lead.id}:fech`] !== false) }))}
                        >
                          <Msg keyId={`${lead.id}-fech`} texto={lead.scripts.fechamento} cor="#16A34A" copiar={copiar} copiado={copiado} />
                        </Secao>

                        {lead.scripts.callAlinhamento && (
                          <Secao
                            keyId={`${lead.id}:call`}
                            titulo="⚡ Arma de travamento — Call de alinhamento"
                            cor="#F59E0B"
                            aberta={secaoAberta[`${lead.id}:call`] !== false}
                            onToggle={() => setSecaoAberta((p) => ({ ...p, [`${lead.id}:call`]: !(p[`${lead.id}:call`] !== false) }))}
                          >
                            <Msg keyId={`${lead.id}-call`} texto={lead.scripts.callAlinhamento} cor="#F59E0B" copiar={copiar} copiado={copiado} />
                          </Secao>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Stat({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: '8px', padding: '10px 14px' }}>
      <div style={{ fontSize: '20px', fontWeight: 800, color: cor }}>{valor}</div>
      <div style={{ fontSize: '10px', color: muted, marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function Secao({ keyId, titulo, cor, aberta, onToggle, children }: {
  keyId: string
  titulo: string
  cor: string
  aberta: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ border: `1px solid ${cor}40`, borderRadius: '10px', overflow: 'hidden', background: '#0F1117' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: cor + '15',
          border: 'none',
          color: cor,
          fontSize: '12px',
          fontWeight: 800,
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>{titulo}</span>
        <span style={{ fontSize: '10px' }}>{aberta ? '▼' : '▶'}</span>
      </button>
      {aberta && <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</div>}
    </div>
  )
}

function Msg({ keyId, texto, cor, copiar, copiado }: {
  keyId: string
  texto: string
  cor: string
  copiar: (key: string, t: string) => void
  copiado: string | null
}) {
  return (
    <div style={{ padding: '10px 12px', background: '#000', border: `1px solid ${brd}`, borderRadius: '7px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <p style={{ fontSize: '12px', color: '#E5E7EB', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{texto}</p>
      <button
        onClick={() => copiar(keyId, texto)}
        style={{
          alignSelf: 'flex-start',
          padding: '3px 10px',
          background: '#1F2937',
          border: `1px solid ${brd}`,
          borderRadius: '5px',
          color: cor,
          fontSize: '10px',
          cursor: 'pointer',
          fontWeight: 700,
        }}
      >
        {copiado === keyId ? '✅ Copiado' : '📋 Copiar'}
      </button>
    </div>
  )
}
