'use client'

import { useEffect, useState, useMemo } from 'react'

// ══════════════════════════════════════════════════════════════
// Dashboard /tally — leads vindos dos formulários da LP Impulso
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
  // Tally-specific
  diagnostico_respondido_em: string | null
  diagnostico_respostas: string | null
  briefing_enviado_em: string | null
  briefing_respondido_em: string | null
  briefing_respostas: string | null
  servico_recomendado: string | null
  faixa_investimento: string | null
  pagamento_50_em: string | null
  pagamento_final_em: string | null
  criado_em: string
  atualizado_em: string
}

type Tab = 'novo' | 'briefing-pendente' | 'briefing-respondido' | 'em-projeto'

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

  async function fetchLeads() {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      // Filtra só leads vindos do Tally
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
      const temDiag = !!l.diagnostico_respondido_em
      const temBrief = !!l.briefing_respondido_em
      const temPag = !!l.pagamento_50_em

      if (temBrief && temPag) emProjeto.push(l)
      else if (temBrief) briefingRespondido.push(l)
      else if (l.fechou === 1 && !temBrief) briefingPendente.push(l)
      else if (temDiag && l.fechou === 0) novo.push(l)
      else novo.push(l) // fallback
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
    taxaConversao: leads.length > 0
      ? Math.round((grupos.emProjeto.length / leads.length) * 100)
      : 0,
  }), [leads, grupos])

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-block text-sm text-slate-500 hover:text-slate-900 mb-3"
          >
            ← Painel principal
          </a>
          <h1 className="text-3xl font-black text-slate-900">
            Leads Tally — Funil Impulso Digital
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Formulários da LP: <strong>Diagnóstico</strong> (pré-venda) e <strong>Briefing</strong> (pós-pagamento)
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <StatCard label="Total Tally" value={stats.total} />
          <StatCard label="Novos do diagnóstico" value={stats.novo} accent="amber" />
          <StatCard label="Briefing pendente" value={stats.briefingPendente} accent="blue" />
          <StatCard label="Briefing respondido" value={stats.briefingRespondido} accent="violet" />
          <StatCard label="Em projeto" value={stats.emProjeto} accent="green" />
        </div>

        {/* Abas */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <TabButton active={tab === 'novo'} onClick={() => setTab('novo')}>
            📥 Novos do diagnóstico ({grupos.novo.length})
          </TabButton>
          <TabButton active={tab === 'briefing-pendente'} onClick={() => setTab('briefing-pendente')}>
            📋 Briefing pendente ({grupos.briefingPendente.length})
          </TabButton>
          <TabButton active={tab === 'briefing-respondido'} onClick={() => setTab('briefing-respondido')}>
            ✅ Briefing respondido ({grupos.briefingRespondido.length})
          </TabButton>
          <TabButton active={tab === 'em-projeto'} onClick={() => setTab('em-projeto')}>
            🚀 Em projeto ({grupos.emProjeto.length})
          </TabButton>
        </div>

        {/* Lista */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Carregando...</div>
        ) : listaAtiva.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            Nenhum lead nessa categoria ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {listaAtiva.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                tab={tab}
                onViewDetails={() => setSelectedLead(lead)}
                onRefresh={fetchLeads}
              />
            ))}
          </div>
        )}

        {/* Modal de detalhes */}
        {selectedLead && (
          <DetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
        )}
      </div>
    </main>
  )
}

// ══════════════════════════════════════════════════════════════
// Componentes
// ══════════════════════════════════════════════════════════════

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  const colorMap: Record<string, string> = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    violet: 'text-violet-600',
    green: 'text-green-600',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className={`text-2xl font-black ${colorMap[accent || ''] || 'text-slate-900'}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  )
}

function TabButton({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
        active
          ? 'bg-slate-900 text-white'
          : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
      }`}
    >
      {children}
    </button>
  )
}

function LeadCard({
  lead, tab, onViewDetails, onRefresh,
}: {
  lead: Lead; tab: Tab; onViewDetails: () => void; onRefresh: () => void
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
    // Precisa de endpoint específico — por enquanto usa notas como marcador temporário
    const nowSql = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await fetch(`/api/tally/marcar-pagamento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, when: nowSql, tipo: 'entrada' }),
    }).catch(() => {}) // endpoint opcional — pode não existir ainda
    onRefresh()
  }

  const wa = lead.telefone ? `https://wa.me/${lead.telefone}` : null
  const servico = servicoLabel(lead.servico_recomendado)
  const faixa = faixaLabel(lead.faixa_investimento)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-400 transition-colors">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Info principal */}
        <div className="flex-1 min-w-[240px]">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-slate-900">{lead.nome}</h3>
            {lead.categoria && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                {lead.categoria}
              </span>
            )}
            {lead.servico_recomendado && (
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded font-semibold">
                {servico}
              </span>
            )}
            {lead.faixa_investimento && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                {faixa}
              </span>
            )}
            {lead.termometro === 'quente' && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">🔥 Quente</span>
            )}
          </div>

          <div className="text-sm text-slate-600 flex gap-4 flex-wrap">
            {lead.telefone && <span>📱 {fmtTelefone(lead.telefone)}</span>}
            {lead.instagram && <span>📷 {lead.instagram}</span>}
          </div>

          {lead.mensagem && (
            <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-2 rounded">
              <strong>Dor:</strong> {lead.mensagem}
            </div>
          )}

          <div className="mt-2 text-xs text-slate-400 flex gap-3 flex-wrap">
            {lead.diagnostico_respondido_em && (
              <span>Diagnóstico: {fmtData(lead.diagnostico_respondido_em)}</span>
            )}
            {lead.briefing_respondido_em && (
              <span>Briefing: {fmtData(lead.briefing_respondido_em)}</span>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onViewDetails}
            className="px-3 py-2 text-xs font-semibold bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
          >
            Ver respostas
          </button>

          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-semibold bg-green-500 text-white rounded hover:bg-green-600"
            >
              WhatsApp
            </a>
          )}

          {tab === 'novo' && (
            <>
              <button
                onClick={() => copiar(MSG_PRIMEIRO_CONTATO(lead.nome, lead.mensagem, lead.servico_recomendado), 'msg')}
                className="px-3 py-2 text-xs font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {copying === 'msg' ? '✓ Copiado!' : 'Copiar msg'}
              </button>
              <button
                onClick={marcarFechou}
                className="px-3 py-2 text-xs font-semibold bg-violet-500 text-white rounded hover:bg-violet-600"
              >
                Marcar fechou
              </button>
            </>
          )}

          {tab === 'briefing-pendente' && (
            <>
              <button
                onClick={() => copiar(MSG_ENVIO_BRIEFING(lead.nome), 'brief-msg')}
                className="px-3 py-2 text-xs font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {copying === 'brief-msg' ? '✓ Copiado!' : 'Copiar msg briefing'}
              </button>
              <button
                onClick={marcarPagamento}
                className="px-3 py-2 text-xs font-semibold bg-green-600 text-white rounded hover:bg-green-700"
              >
                Marcar pagamento 50%
              </button>
            </>
          )}

          {tab === 'briefing-respondido' && (
            <span className="px-3 py-2 text-xs font-semibold text-violet-600">
              ⏳ Aguardando pagamento
            </span>
          )}

          {tab === 'em-projeto' && (
            <span className="px-3 py-2 text-xs font-semibold text-green-600">
              ✅ Em construção
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailsModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const diag = lead.diagnostico_respostas ? JSON.parse(lead.diagnostico_respostas) : null
  const brief = lead.briefing_respostas ? JSON.parse(lead.briefing_respostas) : null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{lead.nome} — Respostas</h2>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-700">×</button>
        </div>

        {diag && (
          <section className="mb-6">
            <h3 className="font-bold text-amber-700 mb-2">📥 Diagnóstico (pré-venda)</h3>
            <div className="space-y-2">
              {Object.entries(diag).map(([k, v]) => (
                <div key={k} className="border-l-2 border-amber-300 pl-3">
                  <div className="text-xs text-slate-500 font-semibold">{k}</div>
                  <div className="text-sm text-slate-800">{String(v || '—')}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {brief && (
          <section>
            <h3 className="font-bold text-violet-700 mb-2">📋 Briefing (pós-pagamento)</h3>
            <div className="space-y-2">
              {Object.entries(brief).map(([k, v]) => (
                <div key={k} className="border-l-2 border-violet-300 pl-3">
                  <div className="text-xs text-slate-500 font-semibold">{k}</div>
                  <div className="text-sm text-slate-800 whitespace-pre-wrap">{String(v || '—')}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!diag && !brief && (
          <div className="text-center text-slate-400 py-8">
            Este lead ainda não respondeu nenhum formulário Tally.
          </div>
        )}
      </div>
    </div>
  )
}
