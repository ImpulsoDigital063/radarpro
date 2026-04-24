'use client'

import { useEffect, useState, useMemo } from 'react'
import HeaderRadarPRO from '@/components/HeaderRadarPRO'

// ══════════════════════════════════════════════════════════════
// Dashboard /tally — leads vindos dos formulários da LP Impulso
// Tema escuro pra combinar com o painel principal do radarPRO
// ══════════════════════════════════════════════════════════════

type Lead = {
  id: number
  nome: string
  categoria: string | null
  tipo: string
  telefone: string | null
  instagram: string | null
  site: string | null
  fonte: string
  mensagem: string | null
  status: string
  termometro: string | null
  fechou: number
  diagnostico_respondido_em: string | null
  diagnostico_respostas: string | null
  briefing_enviado_em: string | null
  briefing_respondido_em: string | null
  briefing_respostas: string | null
  servico_recomendado: string | null
  faixa_investimento: string | null
  pagamento_50_em: string | null
  pagamento_final_em: string | null
  plano_negocio_md: string | null
  plano_gerado_em: string | null
  plano_modelo_ia: string | null
  plano_revisado_em: string | null
  criado_em: string
  atualizado_em: string
}

type Tab = 'novo' | 'briefing-pendente' | 'briefing-respondido' | 'em-projeto'

// ── Paleta igual ao painel principal ─────────────────────────────────────────
const BG    = '#0F1117'
const CARD  = '#111827'
const BRD   = '#1F2937'
const TXT   = '#F9FAFB'
const MUTED = '#6B7280'
const DIM   = '#9CA3AF'
const ACCENT_AMBER  = '#F59E0B'
const ACCENT_BLUE   = '#2563EB'
const ACCENT_VIOLET = '#7C3AED'
const ACCENT_GREEN  = '#10B981'
const ACCENT_RED    = '#EF4444'

const LINK_BRIEFING = 'https://tally.so/r/yP0Dyp'

const MSG_PRIMEIRO_CONTATO = (nome: string, problema: string | null, servico: string | null) => {
  const primeiro = nome.split(' ')[0] || nome
  const serv = {
    lp: 'uma Landing Page otimizada',
    shopify: 'uma Loja Shopify completa',
    nextjs: 'um Site Next.js personalizado',
    agendapro: 'o AgendaPRO (sistema de agendamento)',
    consultoria: 'uma Consultoria Estratégica',
  }[servico || 'consultoria'] || 'uma solução personalizada'

  return `Oi ${primeiro}! Aqui é o Eduardo da Impulso Digital.

Recebi teu diagnóstico, olhei teu Instagram e tenho algumas observações pra te passar.

${problema ? `Você me disse que o maior problema hoje é: "${problema}"\n\n` : ''}Pra teu caso, o que eu recomendo é ${serv} — te mando a proposta completa em seguida, pode ser?`
}

const MSG_ENVIO_BRIEFING = (nome: string) => {
  const primeiro = nome.split(' ')[0] || nome
  return `Pagamento confirmado, ${primeiro}! 🎯

Pra começar teu projeto, preciso que preencha esse briefing:
👉 ${LINK_BRIEFING}

São 19 perguntas rápidas (5-7 min) sobre teu negócio, público e oferta. É o que vai fazer tua LP ser única, não template.

Preciso disso em até 48h pra começar. Qualquer dúvida no preenchimento, me chama.`
}

function fmtData(iso: string | null): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso.replace(' ', 'T'))
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}

function fmtTelefone(tel: string | null): string {
  if (!tel) return '—'
  const d = tel.replace(/\D/g, '')
  if (d.length === 13) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`
  return tel
}

function faixaLabel(f: string | null): string {
  return ({
    'ate-500': 'até R$500',
    '500-1000': 'R$500-1k',
    '1000-2000': 'R$1k-2k',
    'acima-2000': 'acima R$2k',
  } as Record<string, string>)[f || ''] || '—'
}

function servicoLabel(s: string | null): string {
  return ({
    lp: 'Landing Page',
    shopify: 'Loja Shopify',
    nextjs: 'Site Next.js',
    agendapro: 'AgendaPRO',
    consultoria: 'Consultoria',
  } as Record<string, string>)[s || ''] || '—'
}

export default function TallyDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [tab, setTab] = useState<Tab>('novo')
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [planoLead, setPlanoLead] = useState<Lead | null>(null)

  async function fetchLeads() {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      const tally = data.filter(
        (l: Lead) => l.fonte === 'tally-diagnostico' || l.fonte === 'tally-briefing' ||
          l.diagnostico_respondido_em || l.briefing_respondido_em,
      )
      setLeads(tally)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLeads() }, [])

  const grupos = useMemo(() => {
    const novo: Lead[] = []
    const briefingPendente: Lead[] = []
    const briefingRespondido: Lead[] = []
    const emProjeto: Lead[] = []

    for (const l of leads) {
      const temBrief = !!l.briefing_respondido_em
      const temPag = !!l.pagamento_50_em
      const temDiag = !!l.diagnostico_respondido_em

      if (temBrief && temPag) emProjeto.push(l)
      else if (temBrief) briefingRespondido.push(l)
      else if (l.fechou === 1 && !temBrief) briefingPendente.push(l)
      else if (temDiag && l.fechou === 0) novo.push(l)
      else novo.push(l)
    }

    return { novo, briefingPendente, briefingRespondido, emProjeto }
  }, [leads])

  const listaAtiva = useMemo(() => {
    if (tab === 'novo') return grupos.novo
    if (tab === 'briefing-pendente') return grupos.briefingPendente
    if (tab === 'briefing-respondido') return grupos.briefingRespondido
    return grupos.emProjeto
  }, [tab, grupos])

  const stats = useMemo(() => ({
    total: leads.length,
    novo: grupos.novo.length,
    briefingPendente: grupos.briefingPendente.length,
    briefingRespondido: grupos.briefingRespondido.length,
    emProjeto: grupos.emProjeto.length,
  }), [leads, grupos])

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TXT, fontFamily: 'system-ui, sans-serif' }}>
      <HeaderRadarPRO activeTab="tally" />

      <div style={{ padding: '24px 32px' }}>
        {/* Título */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: TXT }}>
            Funil Impulso Digital
          </h2>
          <p style={{ fontSize: '13px', color: MUTED, margin: '4px 0 0' }}>
            Formulários da LP: <strong style={{ color: DIM }}>Diagnóstico</strong> (pré-venda) e <strong style={{ color: DIM }}>Briefing</strong> (pós-pagamento)
          </p>
        </div>

        {/* Stats — 5 cards no mesmo estilo do painel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px', marginBottom: '24px',
        }}>
          <StatCard label="Total" value={stats.total} color={TXT} />
          <StatCard label="Novos do diagnóstico" value={stats.novo} color={ACCENT_AMBER} />
          <StatCard label="Briefing pendente" value={stats.briefingPendente} color={ACCENT_BLUE} />
          <StatCard label="Briefing respondido" value={stats.briefingRespondido} color={ACCENT_VIOLET} />
          <StatCard label="Em projeto" value={stats.emProjeto} color={ACCENT_GREEN} />
        </div>

        {/* Abas */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <TabButton active={tab === 'novo'} onClick={() => setTab('novo')} color={ACCENT_AMBER}>
            📥 Novos do diagnóstico ({grupos.novo.length})
          </TabButton>
          <TabButton active={tab === 'briefing-pendente'} onClick={() => setTab('briefing-pendente')} color={ACCENT_BLUE}>
            📋 Briefing pendente ({grupos.briefingPendente.length})
          </TabButton>
          <TabButton active={tab === 'briefing-respondido'} onClick={() => setTab('briefing-respondido')} color={ACCENT_VIOLET}>
            ✅ Briefing respondido ({grupos.briefingRespondido.length})
          </TabButton>
          <TabButton active={tab === 'em-projeto'} onClick={() => setTab('em-projeto')} color={ACCENT_GREEN}>
            🚀 Em projeto ({grupos.emProjeto.length})
          </TabButton>
        </div>

        {/* Lista */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: MUTED }}>Carregando...</div>
        ) : listaAtiva.length === 0 ? (
          <div style={{
            padding: '48px', textAlign: 'center', color: MUTED,
            background: CARD, border: `1px solid ${BRD}`, borderRadius: '12px',
          }}>
            Nenhum lead nessa categoria ainda.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {listaAtiva.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                tab={tab}
                onViewDetails={() => setSelectedLead(lead)}
                onOpenPlano={() => setPlanoLead(lead)}
                onRefresh={fetchLeads}
              />
            ))}
          </div>
        )}
      </div>

      {selectedLead && (
        <DetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      {planoLead && (
        <PlanoModal
          lead={planoLead}
          onClose={() => setPlanoLead(null)}
          onSaved={fetchLeads}
        />
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// Componentes
// ══════════════════════════════════════════════════════════════

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: CARD, border: `1px solid ${BRD}`, borderRadius: '12px', padding: '16px',
    }}>
      <div style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '11px', color: MUTED, marginTop: '6px' }}>{label}</div>
    </div>
  )
}

function TabButton({ active, onClick, color, children }: {
  active: boolean; onClick: () => void; color: string; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
        background: active ? color + '22' : CARD,
        border: `1px solid ${active ? color : BRD}`,
        color: active ? color : DIM,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

function LeadCard({
  lead, tab, onViewDetails, onOpenPlano, onRefresh,
}: {
  lead: Lead; tab: Tab; onViewDetails: () => void; onOpenPlano: () => void; onRefresh: () => void
}) {
  const [copying, setCopying] = useState<string | null>(null)

  async function copiar(texto: string, label: string) {
    await navigator.clipboard.writeText(texto)
    setCopying(label)
    setTimeout(() => setCopying(null), 1500)
  }

  async function marcarFechou() {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, action: 'status', status: 'fechado' }),
    })
    onRefresh()
  }

  async function marcarPagamento() {
    await fetch(`/api/tally/marcar-pagamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, tipo: 'entrada' }),
    }).catch(() => {})
    onRefresh()
  }

  const wa = lead.telefone ? `https://wa.me/${lead.telefone}` : null
  const servico = servicoLabel(lead.servico_recomendado)
  const faixa = faixaLabel(lead.faixa_investimento)

  return (
    <div style={{
      background: CARD, border: `1px solid ${BRD}`, borderRadius: '12px', padding: '16px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: '16px', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: TXT, margin: 0 }}>{lead.nome}</h3>
            {lead.categoria && (
              <Badge color="#374151" bg="#37415122">{lead.categoria}</Badge>
            )}
            {lead.servico_recomendado && (
              <Badge color={ACCENT_VIOLET} bg={ACCENT_VIOLET + '22'}>{servico}</Badge>
            )}
            {lead.faixa_investimento && (
              <Badge color={ACCENT_AMBER} bg={ACCENT_AMBER + '22'}>{faixa}</Badge>
            )}
            {lead.termometro === 'quente' && (
              <Badge color={ACCENT_RED} bg={ACCENT_RED + '22'}>🔥 Quente</Badge>
            )}
          </div>

          <div style={{ fontSize: '12px', color: DIM, display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {lead.telefone && <span>📱 {fmtTelefone(lead.telefone)}</span>}
            {lead.instagram && <span>📷 {lead.instagram}</span>}
          </div>

          {lead.mensagem && (
            <div style={{
              marginTop: '8px', fontSize: '12px', color: DIM,
              background: BG, padding: '8px 10px', borderRadius: '6px',
              border: `1px solid ${BRD}`,
            }}>
              <strong style={{ color: MUTED }}>Dor:</strong> {lead.mensagem}
            </div>
          )}

          <div style={{ marginTop: '8px', fontSize: '11px', color: MUTED, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {lead.diagnostico_respondido_em && (
              <span>Diagnóstico: {fmtData(lead.diagnostico_respondido_em)}</span>
            )}
            {lead.briefing_respondido_em && (
              <span>Briefing: {fmtData(lead.briefing_respondido_em)}</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <ActionButton onClick={onViewDetails} bg="#374151" color={TXT}>
            Ver respostas
          </ActionButton>

          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <ActionButton bg={ACCENT_GREEN} color="#fff">WhatsApp</ActionButton>
            </a>
          )}

          {tab === 'novo' && (
            <>
              <ActionButton
                onClick={() => copiar(MSG_PRIMEIRO_CONTATO(lead.nome, lead.mensagem, lead.servico_recomendado), 'msg')}
                bg={ACCENT_BLUE} color="#fff"
              >
                {copying === 'msg' ? '✓ Copiado!' : 'Copiar msg'}
              </ActionButton>
              <ActionButton onClick={marcarFechou} bg={ACCENT_VIOLET} color="#fff">
                Marcar fechou
              </ActionButton>
            </>
          )}

          {tab === 'briefing-pendente' && (
            <>
              <ActionButton
                onClick={() => copiar(MSG_ENVIO_BRIEFING(lead.nome), 'brief-msg')}
                bg={ACCENT_BLUE} color="#fff"
              >
                {copying === 'brief-msg' ? '✓ Copiado!' : 'Copiar msg briefing'}
              </ActionButton>
              <ActionButton onClick={marcarPagamento} bg={ACCENT_GREEN} color="#fff">
                Marcar pagamento 50%
              </ActionButton>
            </>
          )}

          {tab === 'briefing-respondido' && (
            <>
              <ActionButton onClick={onOpenPlano} bg={ACCENT_VIOLET} color="#fff">
                🤖 {lead.plano_negocio_md ? 'Ver plano IA' : 'Gerar plano IA'}
              </ActionButton>
              <span style={{
                padding: '6px 10px', fontSize: '11px', fontWeight: 700,
                color: ACCENT_VIOLET,
              }}>
                ⏳ Aguardando pagamento
              </span>
            </>
          )}

          {tab === 'em-projeto' && (
            <>
              <ActionButton onClick={onOpenPlano} bg={ACCENT_VIOLET} color="#fff">
                🤖 {lead.plano_negocio_md ? 'Ver plano IA' : 'Gerar plano IA'}
              </ActionButton>
              <span style={{
                padding: '6px 10px', fontSize: '11px', fontWeight: 700,
                color: ACCENT_GREEN,
              }}>
                ✅ Em construção
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
      color, background: bg, border: `1px solid ${color}33`,
    }}>
      {children}
    </span>
  )
}

function ActionButton({
  children, onClick, bg, color,
}: {
  children: React.ReactNode; onClick?: () => void; bg: string; color: string
}) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 10px', fontSize: '11px', fontWeight: 700,
      background: bg, color, border: 'none', borderRadius: '6px',
      cursor: 'pointer', transition: 'opacity 0.15s',
    }}>
      {children}
    </button>
  )
}

function DetailsModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const diag = lead.diagnostico_respostas ? JSON.parse(lead.diagnostico_respostas) : null
  const brief = lead.briefing_respostas ? JSON.parse(lead.briefing_respostas) : null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: CARD, border: `1px solid ${BRD}`, borderRadius: '12px',
          maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: TXT, margin: 0 }}>
            {lead.nome} — Respostas
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: MUTED,
              fontSize: '24px', cursor: 'pointer', padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {diag && (
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT_AMBER, margin: '0 0 10px' }}>
              📥 Diagnóstico (pré-venda)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(diag).map(([k, v]) => (
                <div key={k} style={{ borderLeft: `2px solid ${ACCENT_AMBER}77`, paddingLeft: '12px' }}>
                  <div style={{ fontSize: '11px', color: MUTED, fontWeight: 700 }}>{k}</div>
                  <div style={{ fontSize: '13px', color: TXT }}>{String(v || '—')}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {brief && (
          <section>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT_VIOLET, margin: '0 0 10px' }}>
              📋 Briefing (pós-pagamento)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(brief).map(([k, v]) => (
                <div key={k} style={{ borderLeft: `2px solid ${ACCENT_VIOLET}77`, paddingLeft: '12px' }}>
                  <div style={{ fontSize: '11px', color: MUTED, fontWeight: 700 }}>{k}</div>
                  <div style={{ fontSize: '13px', color: TXT, whiteSpace: 'pre-wrap' }}>{String(v || '—')}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!diag && !brief && (
          <div style={{ textAlign: 'center', color: MUTED, padding: '32px 0' }}>
            Este lead ainda não respondeu nenhum formulário Tally.
          </div>
        )}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// PlanoModal — gerar / visualizar / editar plano com IA
// ══════════════════════════════════════════════════════════════

function PlanoModal({ lead, onClose, onSaved }: {
  lead: Lead; onClose: () => void; onSaved: () => void
}) {
  const [markdown, setMarkdown] = useState<string>(lead.plano_negocio_md || '')
  const [gerando, setGerando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  async function gerar(regenerate = false) {
    setGerando(true); setErro(null); setStatus(null)
    try {
      const r = await fetch('/api/tally/gerar-plano', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, regenerate }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'Falha')
      setMarkdown(data.markdown)
      setStatus(data.cached ? 'Carregado do cache.' : `Gerado com ${data.modelo}.`)
      onSaved()
    } catch (e: any) {
      setErro(String(e?.message || e))
    } finally {
      setGerando(false)
    }
  }

  async function salvarEdicao() {
    setSalvando(true); setErro(null)
    try {
      const r = await fetch('/api/tally/gerar-plano', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, markdown }),
      })
      if (!r.ok) throw new Error('Falha ao salvar')
      setStatus('Revisão salva.')
      onSaved()
    } catch (e: any) {
      setErro(String(e?.message || e))
    } finally {
      setSalvando(false)
    }
  }

  function abrirImpressao() {
    const html = renderizarHtml(markdown, lead.nome)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  function copiarMarkdown() {
    navigator.clipboard.writeText(markdown)
    setStatus('Markdown copiado pra área de transferência.')
    setTimeout(() => setStatus(null), 2000)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px', zIndex: 60,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: CARD, border: `1px solid ${BRD}`, borderRadius: '12px',
          maxWidth: '1200px', width: '100%', maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${BRD}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', flexWrap: 'wrap',
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: TXT, margin: 0 }}>
              🤖 Plano de Negócio & Marketing — {lead.nome}
            </h2>
            {lead.plano_gerado_em && (
              <p style={{ fontSize: '11px', color: MUTED, margin: '4px 0 0' }}>
                Gerado em {lead.plano_gerado_em} · Modelo: {lead.plano_modelo_ia}
                {lead.plano_revisado_em ? ` · Revisado em ${lead.plano_revisado_em}` : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: MUTED, fontSize: '24px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Barra de ações */}
        <div style={{
          padding: '12px 20px', borderBottom: `1px solid ${BRD}`,
          display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          {!markdown && (
            <ActionButton onClick={() => gerar(false)} bg={ACCENT_VIOLET} color="#fff">
              {gerando ? '⏳ Gerando plano completo (60-120s)...' : '🤖 Gerar plano agora'}
            </ActionButton>
          )}
          {markdown && (
            <>
              <ActionButton onClick={() => gerar(true)} bg={ACCENT_AMBER} color="#000">
                {gerando ? '⏳ Regerando...' : '🔄 Gerar de novo'}
              </ActionButton>
              <ActionButton onClick={salvarEdicao} bg={ACCENT_GREEN} color="#fff">
                {salvando ? 'Salvando...' : '💾 Salvar revisão'}
              </ActionButton>
              <ActionButton onClick={copiarMarkdown} bg="#374151" color={TXT}>
                📋 Copiar MD
              </ActionButton>
              <ActionButton onClick={abrirImpressao} bg={ACCENT_BLUE} color="#fff">
                🖨️ Imprimir / PDF
              </ActionButton>
            </>
          )}
          {status && (
            <span style={{ fontSize: '11px', color: ACCENT_GREEN, marginLeft: 'auto' }}>{status}</span>
          )}
          {erro && (
            <span style={{ fontSize: '11px', color: ACCENT_RED, marginLeft: 'auto' }}>{erro}</span>
          )}
        </div>

        {/* Corpo */}
        {!markdown ? (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: TXT, margin: '0 0 8px' }}>
              Gerar o plano agora?
            </h3>
            <p style={{ fontSize: '13px', color: MUTED, maxWidth: '500px', margin: '0 auto 16px' }}>
              A IA vai analisar todas as respostas do briefing + diagnóstico e gerar um plano completo
              de <strong style={{ color: TXT }}>14 seções</strong> em Markdown. Gera em 2 partes pra
              garantir que nada trunque: leva 60-120 segundos. Depois você edita o que quiser antes de
              imprimir o PDF.
            </p>
            <ActionButton onClick={() => gerar(false)} bg={ACCENT_VIOLET} color="#fff">
              {gerando ? '⏳ Gerando...' : '🤖 Gerar plano agora'}
            </ActionButton>
          </div>
        ) : (
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            {/* Editor */}
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              style={{
                width: '50%',
                background: BG, color: TXT, border: 'none',
                borderRight: `1px solid ${BRD}`,
                padding: '16px', fontSize: '12px',
                fontFamily: 'Consolas, Monaco, monospace',
                lineHeight: 1.6, resize: 'none', outline: 'none',
              }}
            />
            {/* Preview */}
            <div style={{
              width: '50%',
              padding: '20px 24px', overflowY: 'auto',
              background: '#fff', color: '#111',
            }}>
              <div
                dangerouslySetInnerHTML={{ __html: renderizarPreview(markdown) }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Renderização markdown → HTML simples (sem libs extras) ──────────────────
// Converte um subset suficiente: headings, bold, listas, tabelas, blockquotes

function renderizarPreview(md: string): string {
  let html = md

  // tabelas — hack simples
  html = html.replace(/(\|.+\|\n\|[\s|:-]+\|\n(?:\|.+\|\n?)+)/g, (tbl) => {
    const linhas = tbl.trim().split('\n')
    const head = linhas[0].split('|').slice(1, -1).map(s => s.trim())
    const body = linhas.slice(2).map(l => l.split('|').slice(1, -1).map(s => s.trim()))
    let out = '<table style="border-collapse:collapse;width:100%;margin:12px 0;font-size:12px"><thead><tr>'
    head.forEach(h => out += `<th style="border:1px solid #ddd;padding:6px 8px;background:#f3f4f6;text-align:left">${h}</th>`)
    out += '</tr></thead><tbody>'
    body.forEach(row => {
      out += '<tr>'
      row.forEach(c => out += `<td style="border:1px solid #ddd;padding:6px 8px">${c}</td>`)
      out += '</tr>'
    })
    out += '</tbody></table>'
    return out
  })

  html = html
    .replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:16px 0 6px;color:#111">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:18px;font-weight:800;margin:20px 0 8px;color:#0F1117;border-bottom:2px solid #2563EB;padding-bottom:4px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;font-weight:900;margin:0 0 12px;color:#0F1117">$1</h1>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #2563EB;padding:8px 12px;margin:10px 0;background:#f0f9ff;font-style:italic;color:#1e3a8a">$1</blockquote>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (m) => `<ul style="margin:8px 0;padding-left:20px">${m}</ul>`)
    .replace(/\n\n/g, '</p><p style="margin:8px 0;line-height:1.5">')

  return `<div style="font-family:system-ui,sans-serif;line-height:1.5"><p>${html}</p></div>`
}

function renderizarHtml(md: string, titulo: string): string {
  const preview = renderizarPreview(md)
  return `<!DOCTYPE html>
<html lang="pt-BR"><head>
<meta charset="utf-8">
<title>${titulo} — Plano de Negócio & Marketing — Impulso Digital</title>
<style>
  body { max-width: 800px; margin: 40px auto; padding: 0 40px; font-family: system-ui, -apple-system, sans-serif; color: #111; line-height: 1.6; }
  @media print {
    body { margin: 0; padding: 20px; }
    h2 { page-break-after: avoid; }
    table, blockquote { page-break-inside: avoid; }
  }
  .header { border-bottom: 2px solid #0F1117; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; font-size: 10px; color: #666; }
  .footer { border-top: 1px solid #ddd; padding-top: 12px; margin-top: 40px; font-size: 10px; color: #666; text-align: center; }
</style>
</head>
<body>
  <div class="header">
    <div><strong>Impulso Digital</strong> — Plano de Negócio & Marketing</div>
    <div>${titulo}</div>
  </div>
  ${preview}
  <div class="footer">
    Documento preparado pela Impulso Digital — impulsodigital063.com · WhatsApp (63) 99292-0080<br>
    Use Ctrl+P (Cmd+P no Mac) pra salvar como PDF
  </div>
  <script>setTimeout(() => window.print(), 500);</script>
</body></html>`
}
