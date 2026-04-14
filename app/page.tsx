'use client'

import { useEffect, useState, useCallback } from 'react'

type Lead = {
  id: number
  nome: string
  categoria: string
  tipo: 'lp' | 'shopify' | 'agendapro'
  telefone: string | null
  instagram: string | null
  instagram_url: string | null
  instagram_seguidores: string | null
  site: string | null
  nota: number | null
  num_avaliacoes: number | null
  score: number
  status: string
  mensagem: string | null
  notas: string | null
  proximo_followup: string | null
  fonte: string
  criado_em: string
}

type Stats = {
  total: number; lp: number; shopify: number; agendapro: number
  novos: number; abordados: number; consultorias: number; fechados: number
}

type Analise = {
  nome: string; categoria: string; telefone: string | null
  instagram: string | null; instagram_bio: string | null
  instagram_seguidores: string | null; site: string | null
  nota: number | null; num_avaliacoes: number | null
  tem_site: boolean; tem_ecommerce: boolean; tem_agendamento: boolean
  tipo_detectado: string; score_lp: number; score_shopify: number; score_agendapro: number
  diagnostico: string[]; mensagem_lp: string; mensagem_shopify: string; mensagem_agendapro: string
}

const STATUS: Record<string, { label: string; cor: string }> = {
  novo:                { label: 'Novo',               cor: '#6B7280' },
  abordado:            { label: 'Abordado',            cor: '#2563EB' },
  respondeu:           { label: 'Respondeu',           cor: '#7C3AED' },
  consultoria_marcada: { label: 'Consultoria marcada', cor: '#D97706' },
  consultoria_feita:   { label: 'Consultoria feita',   cor: '#0891B2' },
  proposta_enviada:    { label: 'Proposta enviada',    cor: '#EA580C' },
  fechado:             { label: 'Fechado ✅',          cor: '#16A34A' },
  sem_interesse:       { label: 'Sem interesse',       cor: '#DC2626' },
}

const TIPO = {
  lp:        { label: 'Landing Page', cor: '#2563EB', emoji: '📄' },
  shopify:   { label: 'Shopify',      cor: '#10B981', emoji: '🛒' },
  agendapro: { label: 'AgendaPRO',    cor: '#7C3AED', emoji: '📅' },
}

function scoreInfo(s: number) {
  if (s >= 8) return { label: 'Quente',  cor: '#EF4444', emoji: '🔥' }
  if (s >= 6) return { label: 'Morno',   cor: '#F59E0B', emoji: '⚡' }
  if (s >= 4) return { label: 'Frio',    cor: '#3B82F6', emoji: '❄️' }
  return       { label: 'Gelado', cor: '#6B7280', emoji: '💤' }
}

function whatsappLink(tel: string, msg: string) {
  const n = tel.replace(/\D/g, '')
  return `https://wa.me/${n.startsWith('55') ? n : '55' + n}?text=${encodeURIComponent(msg)}`
}

export default function RadarPRO() {
  const [leads, setLeads]         = useState<Lead[]>([])
  const [stats, setStats]         = useState<Stats | null>(null)
  const [tipoF, setTipoF]         = useState('todos')
  const [statusF, setStatusF]     = useState('todos')
  const [buscando, setBuscando]   = useState<string | null>(null)
  const [queryBusca, setQueryBusca] = useState('')
  const [tipoBusca, setTipoBusca]   = useState<'lp' | 'shopify' | 'agendapro'>('lp')
  const [expandido, setExpandido]     = useState<number | null>(null)
  const [copiado, setCopiado]         = useState<string | null>(null)
  const [enriquecendo, setEnriquecendo]   = useState<number | null>(null)
  const [scoreIA, setScoreIA]             = useState<Record<number, { score: number; justificativa: string }>>({})
  const [calculandoScore, setCalculandoScore] = useState<number | null>(null)
  const [analiseSite, setAnaliseSite]         = useState<Record<number, any>>({})
  const [analisandoSite, setAnalisandoSite]   = useState<number | null>(null)
  const [avaliacoesIA, setAvaliacoesIA]             = useState<Record<number, any>>({})
  const [analisandoAvaliacoes, setAnalisandoAvaliacoes] = useState<number | null>(null)
  const [followupIA, setFollowupIA]                 = useState<Record<number, any>>({})
  const [gerandoFollowup, setGerandoFollowup]       = useState<number | null>(null)
  const [aba, setAba]             = useState<'leads' | 'analisar' | 'hoje'>('leads')
  const [planoHoje, setPlanoHoje]   = useState<{ lead: Lead; prioridade: number; motivo: string; acao: string }[] | null>(null)
  const [gerandoHoje, setGerandoHoje] = useState(false)

  // Analisador
  const [linkInput, setLinkInput]   = useState('')
  const [analisando, setAnalisando] = useState(false)
  const [analise, setAnalise]       = useState<Analise | null>(null)
  const [tipoSalvar, setTipoSalvar] = useState('lp')
  const [msgEditada, setMsgEditada] = useState('')
  const [erroAnalise, setErroAnalise] = useState('')

  // IA
  const [gerandoIA, setGerandoIA]   = useState<number | null>(null)
  const [iaResultado, setIaResultado] = useState<Record<number, { diagnostico: string; argumento: string; urgencia: string }>>({})
  const [gerandoIAAnalise, setGerandoIAAnalise] = useState(false)
  const [iaAnalise, setIaAnalise]   = useState<{ diagnostico: string; argumento: string; urgencia: string } | null>(null)

  const carregar = useCallback(async () => {
    const p = new URLSearchParams()
    if (tipoF !== 'todos')   p.set('tipo', tipoF)
    if (statusF !== 'todos') p.set('status', statusF)
    const [l, s] = await Promise.all([
      fetch(`/api/leads?${p}`).then(r => r.json()),
      fetch('/api/leads?stats=1').then(r => r.json()),
    ])
    setLeads(l)
    setStats(s)
  }, [tipoF, statusF])

  useEffect(() => { carregar() }, [carregar])

  // Polling automático enquanto há busca em andamento
  useEffect(() => {
    if (!buscando) return
    const intervalo = setInterval(async () => {
      await carregar()
      // Verifica se a busca ainda está rodando
      const status = await fetch('/api/scrape').then(r => r.json()).catch(() => ({ emAndamento: {} }))
      if (buscando && !status.emAndamento[buscando]) {
        setBuscando(null)
      }
    }, 10000)
    return () => clearInterval(intervalo)
  }, [buscando, carregar])

  async function buscar() {
    if (buscando || !queryBusca.trim()) return
    const r = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: tipoBusca, query: queryBusca.trim() }),
    })
    const data = await r.json()
    if (data.ok) setBuscando(data.chave)
  }

  async function setStatus(id: number, status: string) {
    await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'status', status }) })
    carregar()
  }

  async function salvarNotas(id: number, notas: string) {
    await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'notas', notas }) })
  }

  async function salvarMensagem(id: number, mensagem: string) {
    await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'mensagem', mensagem }) })
    carregar()
  }

  function copiar(key: string, texto: string) {
    navigator.clipboard.writeText(texto)
    setCopiado(key)
    setTimeout(() => setCopiado(null), 2000)
  }

  async function gerarComIA(lead: Lead) {
    setGerandoIA(lead.id)
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'abordagem', lead }),
      })
      const data = await r.json()
      if (data.error) { alert('Erro IA: ' + data.error); return }
      // Atualiza a mensagem localmente
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, mensagem: data.mensagem } : l))
      setIaResultado(prev => ({ ...prev, [lead.id]: { diagnostico: data.diagnostico, argumento: data.argumento, urgencia: data.urgencia } }))
    } finally {
      setGerandoIA(null)
    }
  }

  async function gerarComIAAnalise() {
    if (!analise) return
    setGerandoIAAnalise(true)
    setIaAnalise(null)
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'abordagem',
          lead: { ...analise, tipo: tipoSalvar },
        }),
      })
      const data = await r.json()
      if (data.error) { alert('Erro IA: ' + data.error); return }
      setMsgEditada(data.mensagem)
      setIaAnalise({ diagnostico: data.diagnostico, argumento: data.argumento, urgencia: data.urgencia })
    } finally {
      setGerandoIAAnalise(false)
    }
  }

  async function avaliarScoreIA(lead: Lead) {
    setCalculandoScore(lead.id)
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'score', lead }),
      })
      const data = await r.json()
      if (!data.error) {
        setScoreIA(prev => ({ ...prev, [lead.id]: data }))
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, score: data.score } : l))
      }
    } finally {
      setCalculandoScore(null)
    }
  }

  async function analisarSite(lead: Lead) {
    if (!lead.site) return
    setAnalisandoSite(lead.id)
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analisar-site', siteUrl: lead.site, nome: lead.nome, leadId: lead.id }),
      })
      const data = await r.json()
      if (!data.error) setAnaliseSite(prev => ({ ...prev, [lead.id]: data }))
      else alert('Erro: ' + data.error)
    } finally {
      setAnalisandoSite(null)
    }
  }

  async function analisarAvaliacoes(lead: Lead) {
    if (!lead.site) return
    setAnalisandoAvaliacoes(lead.id)
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'avaliar-reviews', mapsUrl: lead.site, nome: lead.nome, leadId: lead.id }),
      })
      const data = await r.json()
      if (!data.error) setAvaliacoesIA(prev => ({ ...prev, [lead.id]: data }))
      else alert('Erro: ' + data.error)
    } finally {
      setAnalisandoAvaliacoes(null)
    }
  }

  async function gerarFollowupLead(lead: Lead) {
    setGerandoFollowup(lead.id)
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'followup',
          lead: {
            ...lead,
            mensagem_enviada: lead.mensagem,
            notas: lead.notas,
          },
        }),
      })
      const data = await r.json()
      if (data.error) { alert('Erro IA: ' + data.error); return }
      setFollowupIA(prev => ({ ...prev, [lead.id]: data }))
      // Atualiza a mensagem na lista local também
      setLeads(prev => prev.map(l => l.id === lead.id
        ? { ...l, mensagem: data.mensagem, proximo_followup: data.dataFollowup ?? l.proximo_followup }
        : l
      ))
      await carregar()  // recarrega para pegar data atualizada do banco
    } finally {
      setGerandoFollowup(null)
    }
  }

  async function enriquecerLead(leadId: number) {
    setEnriquecendo(leadId)
    try {
      const r = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId }),
      })
      const data = await r.json()
      if (data.resultado?.instagram) {
        await carregar()
      }
    } finally {
      setEnriquecendo(null)
    }
  }

  async function gerarProspectarHoje() {
    setGerandoHoje(true)
    setPlanoHoje(null)
    try {
      // Pega todos os leads (sem filtro) para a IA decidir
      const todosLeads = await fetch('/api/leads').then(r => r.json())
      const ativos = todosLeads.filter((l: Lead) => l.status !== 'fechado' && l.status !== 'sem_interesse')

      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'prospectar-hoje', leads: ativos }),
      })
      const data = await r.json()
      if (data.error) { alert('Erro IA: ' + data.error); return }

      // Mapeia os IDs para os leads completos
      const mapa = new Map(todosLeads.map((l: Lead) => [l.id, l]))
      const comLead = (data.plano as any[])
        .map(p => ({ ...p, lead: mapa.get(p.lead_id) }))
        .filter(p => p.lead)

      setPlanoHoje(comLead)
    } finally {
      setGerandoHoje(false)
    }
  }

  async function analisarLink() {
    if (!linkInput.trim()) return
    setAnalisando(true)
    setAnalise(null)
    setErroAnalise('')
    try {
      const r = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: linkInput.trim() }),
      })
      const data = await r.json()
      if (data.error) { setErroAnalise(data.error); return }
      setAnalise(data)
      setTipoSalvar(data.tipo_detectado)
      setMsgEditada(data[`mensagem_${data.tipo_detectado}`] ?? data.mensagem_lp)
    } catch (e: any) {
      setErroAnalise(e.message)
    } finally {
      setAnalisando(false)
    }
  }

  async function salvarAnalise() {
    if (!analise) return
    await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: linkInput.trim(), salvar: true, tipo: tipoSalvar }),
    })
    setAnalise(null)
    setLinkInput('')
    setAba('leads')
    await carregar()
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const bg   = '#0F1117'
  const card = '#111827'
  const brd  = '#1F2937'
  const txt  = '#F9FAFB'
  const muted = '#6B7280'

  return (
    <div style={{ minHeight: '100vh', background: bg, color: txt, fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: `1px solid ${brd}`, padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ marginRight: '8px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>radar<span style={{ color: '#2563EB' }}>PRO</span></h1>
          <p style={{ fontSize: '10px', color: muted, margin: '2px 0 0' }}>Impulso Digital</p>
        </div>

        {/* Seletor de tipo */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['lp', 'shopify', 'agendapro'] as const).map(t => (
            <button key={t} onClick={() => setTipoBusca(t)} style={{
              padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
              border: `2px solid ${tipoBusca === t ? TIPO[t].cor : 'transparent'}`,
              background: tipoBusca === t ? TIPO[t].cor + '20' : '#1F2937',
              color: tipoBusca === t ? TIPO[t].cor : muted, cursor: 'pointer',
            }}>
              {TIPO[t].emoji} {TIPO[t].label}
            </button>
          ))}
        </div>

        {/* Campo de busca */}
        <div style={{ display: 'flex', gap: '6px', flex: 1, maxWidth: '500px' }}>
          <input
            value={queryBusca}
            onChange={e => setQueryBusca(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscar()}
            placeholder='Ex: "nutricionista", "barbearia", "clínica estética"...'
            style={{
              flex: 1, padding: '8px 14px', background: '#1F2937',
              border: `1px solid ${brd}`, borderRadius: '7px',
              color: txt, fontSize: '12px', outline: 'none',
            }}
          />
          <button onClick={buscar} disabled={!!buscando || !queryBusca.trim()} style={{
            padding: '8px 18px', background: buscando ? '#374151' : TIPO[tipoBusca].cor,
            color: '#fff', border: 'none', borderRadius: '7px',
            fontSize: '12px', fontWeight: 700,
            cursor: buscando ? 'wait' : !queryBusca.trim() ? 'not-allowed' : 'pointer',
            opacity: !queryBusca.trim() ? 0.5 : 1, whiteSpace: 'nowrap',
          }}>
            {buscando ? '⏳ Buscando...' : '🔍 Buscar'}
          </button>
        </div>

        {buscando && (
          <p style={{ fontSize: '11px', color: '#F59E0B', margin: 0 }}>
            Buscando no Google Maps... os leads aparecerão em instantes
          </p>
        )}
      </div>

      {/* ── Stats ── */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '1px', background: brd }}>
          {[
            { l: 'Total',    v: stats.total,        c: txt       },
            { l: 'LP',       v: stats.lp,            c: '#2563EB' },
            { l: 'Shopify',  v: stats.shopify,       c: '#10B981' },
            { l: 'AgendaPRO',v: stats.agendapro,     c: '#7C3AED' },
            { l: 'Novos',    v: stats.novos,         c: '#F59E0B' },
            { l: 'Abordados',v: stats.abordados,     c: '#2563EB' },
            { l: 'Consult.', v: stats.consultorias,  c: '#0891B2' },
            { l: 'Fechados', v: stats.fechados,      c: '#16A34A' },
          ].map(s => (
            <div key={s.l} style={{ background: card, padding: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 800, color: s.c, margin: 0 }}>{s.v}</p>
              <p style={{ fontSize: '10px', color: muted, margin: '3px 0 0' }}>{s.l}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Abas ── */}
      <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${brd}` }}>
        {[{ id: 'leads', label: '📋 Leads' }, { id: 'hoje', label: '🎯 Prospectar hoje' }, { id: 'analisar', label: '🔍 Analisar link' }].map(a => (
          <button key={a.id} onClick={() => setAba(a.id as any)} style={{
            padding: '12px 24px', background: 'transparent', border: 'none',
            borderBottom: aba === a.id ? '2px solid #2563EB' : '2px solid transparent',
            color: aba === a.id ? txt : muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}>{a.label}</button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          ABA PROSPECTAR HOJE
      ══════════════════════════════════════════════════════════ */}
      {aba === 'hoje' && (
        <div style={{ padding: '32px', maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>🎯 Quem abordar hoje?</h2>
              <p style={{ color: muted, fontSize: '13px', margin: 0 }}>
                A IA analisa toda a base e decide os 5 leads mais prioritários para hoje — com motivo específico e ação recomendada.
              </p>
            </div>
            <button onClick={gerarProspectarHoje} disabled={gerandoHoje} style={{
              padding: '10px 20px', background: gerandoHoje ? '#374151' : '#2563EB',
              border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700,
              cursor: gerandoHoje ? 'wait' : 'pointer', whiteSpace: 'nowrap',
            }}>
              {gerandoHoje ? '⏳ Analisando...' : '🎯 Gerar plano'}
            </button>
          </div>

          {!planoHoje && !gerandoHoje && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#4B5563' }}>
              <p style={{ fontSize: '40px', margin: '0 0 12px' }}>🎯</p>
              <p style={{ fontSize: '14px', color: muted }}>Clique em "Gerar plano" para a IA decidir quem abordar hoje</p>
            </div>
          )}

          {gerandoHoje && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: muted }}>
              <p style={{ fontSize: '13px' }}>Analisando {leads.length > 0 ? leads.length : 'todos os'} leads...</p>
            </div>
          )}

          {planoHoje && planoHoje.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {planoHoje.map((item, idx) => {
                const lead = item.lead as Lead
                const si = scoreInfo(lead.score ?? 0)
                const ti = TIPO[lead.tipo]
                const wLink = lead.telefone && lead.mensagem ? whatsappLink(lead.telefone, lead.mensagem) : null
                const prioColors = ['#EF4444', '#F59E0B', '#3B82F6', '#6B7280', '#6B7280']
                const prioColor = prioColors[idx] ?? '#6B7280'

                return (
                  <div key={lead.id} style={{ background: card, border: `1px solid ${brd}`, borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '14px', alignItems: 'start' }}>

                      {/* Número de prioridade */}
                      <div style={{ textAlign: 'center', minWidth: '36px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: prioColor + '20', border: `2px solid ${prioColor}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px', fontWeight: 800, color: prioColor,
                        }}>
                          {item.prioridade}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: ti.cor + '25', color: ti.cor }}>
                            {ti.emoji} {ti.label}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 700 }}>{lead.nome}</span>
                          <span style={{ fontSize: '11px', color: si.cor }}>{si.emoji} {lead.score}/10</span>
                        </div>
                        <p style={{ fontSize: '12px', color: muted, margin: 0 }}>
                          {lead.categoria}
                          {lead.telefone && ` · 📱 ${lead.telefone}`}
                          {lead.nota && ` · ⭐ ${lead.nota}`}
                        </p>

                        {/* Motivo + ação */}
                        <div style={{ background: prioColor + '10', border: `1px solid ${prioColor}20`, borderRadius: '6px', padding: '8px 10px' }}>
                          <p style={{ fontSize: '12px', color: txt, margin: '0 0 3px' }}>
                            <span style={{ color: prioColor, fontWeight: 700 }}>Por que hoje:</span> {item.motivo}
                          </p>
                          <p style={{ fontSize: '11px', color: muted, margin: 0 }}>
                            Ação: <span style={{ color: '#FCD34D', fontWeight: 600 }}>{item.acao}</span>
                          </p>
                        </div>
                      </div>

                      {/* Botões */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                        {wLink && (
                          <a href={wLink} target="_blank" rel="noopener noreferrer"
                            onClick={() => setStatus(lead.id, 'abordado')}
                            style={{ padding: '6px 14px', background: '#16A34A', borderRadius: '6px', color: '#fff', fontSize: '11px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            💬 Enviar WA
                          </a>
                        )}
                        {lead.status !== 'novo' && lead.status !== 'fechado' && (
                          <button onClick={() => { setAba('leads'); setExpandido(lead.id) }} style={{
                            padding: '6px 14px', background: '#1F2937', border: `1px solid ${brd}`,
                            borderRadius: '6px', color: muted, fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap',
                          }}>
                            🔄 Follow-up
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ABA ANALISAR LINK
      ══════════════════════════════════════════════════════════ */}
      {aba === 'analisar' && (
        <div style={{ padding: '32px', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Analisar qualquer link</h2>
          <p style={{ color: muted, fontSize: '13px', marginBottom: '20px' }}>
            Cole um link do Instagram, Google Maps, site ou qualquer página. O sistema analisa, diagnostica e gera o script de abordagem pronto.
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              value={linkInput}
              onChange={e => setLinkInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analisarLink()}
              placeholder="https://instagram.com/seucliente ou https://maps.google.com/..."
              style={{
                flex: 1, padding: '10px 16px', background: card, border: `1px solid ${brd}`,
                borderRadius: '8px', color: txt, fontSize: '13px', outline: 'none',
              }}
            />
            <button onClick={analisarLink} disabled={analisando || !linkInput.trim()} style={{
              padding: '10px 20px', background: '#2563EB', color: '#fff', border: 'none',
              borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: analisando ? 'wait' : 'pointer',
              opacity: !linkInput.trim() ? 0.5 : 1,
            }}>
              {analisando ? '⏳ Analisando...' : '🔍 Analisar'}
            </button>
          </div>

          {erroAnalise && (
            <div style={{ padding: '12px 16px', background: '#1F0A0A', border: '1px solid #7F1D1D', borderRadius: '8px', color: '#FCA5A5', fontSize: '13px', marginBottom: '16px' }}>
              ❌ {erroAnalise}
            </div>
          )}

          {analise && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Info do lead */}
              <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700 }}>{analise.nome}</h3>
                <p style={{ color: muted, fontSize: '13px', margin: '0 0 16px' }}>{analise.categoria}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  {[
                    { l: '📱 Telefone',    v: analise.telefone || '—' },
                    { l: '📸 Instagram',   v: analise.instagram || '—' },
                    { l: '👥 Seguidores',  v: analise.instagram_seguidores || '—' },
                    { l: '🌐 Site',        v: analise.site ? '✅ Tem' : '❌ Não tem' },
                    { l: '⭐ Nota Google', v: analise.nota ? `${analise.nota}` : '—' },
                    { l: '💬 Avaliações',  v: analise.num_avaliacoes ? `${analise.num_avaliacoes}` : '—' },
                  ].map(i => (
                    <div key={i.l} style={{ background: '#0F1117', borderRadius: '8px', padding: '10px 14px' }}>
                      <p style={{ fontSize: '10px', color: muted, margin: '0 0 4px' }}>{i.l}</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{i.v}</p>
                    </div>
                  ))}
                </div>

                {/* Diagnóstico */}
                <div style={{ background: '#0F1117', borderRadius: '8px', padding: '12px 14px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: muted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnóstico</p>
                  {analise.diagnostico.map((d, i) => (
                    <p key={i} style={{ fontSize: '13px', margin: '0 0 4px', color: txt }}>{d}</p>
                  ))}
                </div>
              </div>

              {/* Score por tipo */}
              <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: '12px', padding: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: muted, margin: '0 0 12px', textTransform: 'uppercase' }}>Score por tipo de serviço</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { tipo: 'lp',        label: '📄 Landing Page', score: analise.score_lp },
                    { tipo: 'shopify',   label: '🛒 Shopify',       score: analise.score_shopify },
                    { tipo: 'agendapro', label: '📅 AgendaPRO',     score: analise.score_agendapro },
                  ].map(t => {
                    const si = scoreInfo(t.score)
                    const ativo = tipoSalvar === t.tipo
                    return (
                      <button key={t.tipo} onClick={() => {
                        setTipoSalvar(t.tipo)
                        setMsgEditada(analise[`mensagem_${t.tipo}` as keyof Analise] as string)
                      }} style={{
                        padding: '12px', background: ativo ? si.cor + '25' : '#0F1117',
                        border: `2px solid ${ativo ? si.cor : brd}`, borderRadius: '8px',
                        cursor: 'pointer', textAlign: 'left',
                      }}>
                        <p style={{ fontSize: '12px', color: muted, margin: '0 0 4px' }}>{t.label}</p>
                        <p style={{ fontSize: '20px', fontWeight: 800, color: si.cor, margin: '0 0 2px' }}>{t.score}/10</p>
                        <p style={{ fontSize: '11px', color: si.cor, margin: 0 }}>{si.emoji} {si.label}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Mensagem editável */}
              <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: muted, margin: 0, textTransform: 'uppercase' }}>Script de abordagem — edite se quiser</p>
                  <button onClick={gerarComIAAnalise} disabled={gerandoIAAnalise} style={{
                    padding: '6px 14px', background: gerandoIAAnalise ? '#374151' : '#7C3AED',
                    border: 'none', borderRadius: '6px', color: '#fff', fontSize: '12px', fontWeight: 700,
                    cursor: gerandoIAAnalise ? 'wait' : 'pointer',
                  }}>
                    {gerandoIAAnalise ? '⏳ Gerando...' : '✨ Gerar com IA'}
                  </button>
                </div>
                <textarea
                  value={msgEditada}
                  onChange={e => setMsgEditada(e.target.value)}
                  rows={6}
                  style={{
                    width: '100%', padding: '12px', background: '#0F1117', border: `1px solid ${brd}`,
                    borderRadius: '8px', color: txt, fontSize: '13px', lineHeight: 1.6,
                    resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  }}
                />

                {/* Diagnóstico IA */}
                {iaAnalise && (
                  <div style={{ marginTop: '12px', padding: '12px 14px', background: '#1A0A2E', border: '1px solid #7C3AED40', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p style={{ fontSize: '10px', color: '#A78BFA', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>✨ Análise da IA</p>
                    <p style={{ fontSize: '12px', color: txt, margin: 0 }}><span style={{ color: muted }}>Diagnóstico:</span> {iaAnalise.diagnostico}</p>
                    <p style={{ fontSize: '12px', color: txt, margin: 0 }}><span style={{ color: muted }}>Argumento:</span> {iaAnalise.argumento}</p>
                    <p style={{ fontSize: '12px', color: '#FCD34D', margin: 0 }}><span style={{ color: muted }}>Urgência:</span> {iaAnalise.urgencia}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => copiar('analise-msg', msgEditada)} style={{
                    padding: '8px 16px', background: '#1F2937', border: `1px solid ${brd}`,
                    borderRadius: '7px', color: txt, fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}>
                    {copiado === 'analise-msg' ? '✅ Copiado!' : '📋 Copiar mensagem'}
                  </button>
                  {analise.telefone && (
                    <a href={whatsappLink(analise.telefone, msgEditada)} target="_blank" rel="noopener noreferrer"
                      style={{
                        padding: '8px 16px', background: '#16A34A', borderRadius: '7px',
                        color: '#fff', fontSize: '12px', fontWeight: 700, textDecoration: 'none',
                      }}>
                      💬 Abrir WhatsApp
                    </a>
                  )}
                  <button onClick={salvarAnalise} style={{
                    padding: '8px 16px', background: '#2563EB', border: 'none',
                    borderRadius: '7px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto',
                  }}>
                    ➕ Salvar como lead
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ABA LEADS
      ══════════════════════════════════════════════════════════ */}
      {aba === 'leads' && (
        <>
          {/* Filtros */}
          <div style={{ padding: '12px 32px', display: 'flex', gap: '10px', borderBottom: `1px solid ${brd}`, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['todos', 'lp', 'shopify', 'agendapro'].map(t => (
                <button key={t} onClick={() => setTipoF(t)} style={{
                  padding: '5px 11px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: tipoF === t ? '#2563EB' : '#1F2937',
                  color: tipoF === t ? '#fff' : muted,
                }}>
                  {t === 'todos' ? 'Todos' : TIPO[t as keyof typeof TIPO]?.label}
                </button>
              ))}
            </div>
            <div style={{ width: '1px', height: '18px', background: '#374151' }} />
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {['todos', ...Object.keys(STATUS)].map(s => (
                <button key={s} onClick={() => setStatusF(s)} style={{
                  padding: '4px 9px', borderRadius: '5px', fontSize: '11px', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: statusF === s ? '#374151' : 'transparent',
                  color: statusF === s ? txt : muted,
                }}>
                  {s === 'todos' ? 'Todos' : STATUS[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          <div style={{ padding: '20px 32px' }}>
            {leads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#4B5563' }}>
                <p style={{ fontSize: '40px', margin: '0 0 12px' }}>📡</p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: muted }}>Nenhum lead ainda</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Clique em "Buscar" ou use a aba "Analisar link"</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{ fontSize: '11px', color: muted, marginBottom: '8px' }}>
                  {leads.length} lead{leads.length !== 1 ? 's' : ''} · ordenado por score
                </p>

                {[...leads].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).map(lead => {
                  const ti = TIPO[lead.tipo]
                  const si = scoreInfo(lead.score ?? 0)
                  const st = STATUS[lead.status] ?? STATUS.novo
                  const aberto = expandido === lead.id
                  const wLink = lead.telefone && lead.mensagem ? whatsappLink(lead.telefone, lead.mensagem) : null

                  return (
                    <div key={lead.id} style={{ background: card, border: `1px solid ${brd}`, borderRadius: '10px', overflow: 'hidden' }}>

                      {/* Linha principal */}
                      <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setExpandido(aberto ? null : lead.id)}>

                        {/* Score */}
                        <div style={{ textAlign: 'center', minWidth: '40px' }}>
                          <p style={{ fontSize: '16px', margin: 0 }}>{si.emoji}</p>
                          <p style={{ fontSize: '10px', color: si.cor, margin: 0, fontWeight: 700 }}>{lead.score}/10</p>
                        </div>

                        {/* Info */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                            <span style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: ti.cor + '25', color: ti.cor }}>
                              {ti.emoji} {ti.label}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: txt }}>{lead.nome}</span>
                            {lead.proximo_followup && (
                              <span style={{ fontSize: '10px', color: '#F59E0B', background: '#F59E0B15', padding: '1px 6px', borderRadius: '4px' }}>
                                📅 {lead.proximo_followup}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '11px', color: muted, margin: 0 }}>
                            {lead.categoria}
                            {lead.telefone && ` · 📱 ${lead.telefone}`}
                            {lead.nota && ` · ⭐ ${lead.nota}`}
                            {lead.num_avaliacoes ? ` (${lead.num_avaliacoes} aval.)` : ''}
                            {lead.instagram && ` · ${lead.instagram}`}
                          </p>
                        </div>

                        {/* Ações rápidas */}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <select value={lead.status} onChange={e => { e.stopPropagation(); setStatus(lead.id, e.target.value) }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: '#1F2937', border: `1px solid #374151`, color: st.cor, borderRadius: '5px', padding: '3px 7px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
                            {Object.entries(STATUS).map(([v, s]) => (
                              <option key={v} value={v} style={{ color: txt }}>{s.label}</option>
                            ))}
                          </select>

                          {wLink && (
                            <a href={wLink} target="_blank" rel="noopener noreferrer"
                              onClick={e => { e.stopPropagation(); setStatus(lead.id, 'abordado') }}
                              style={{ padding: '4px 10px', background: '#16A34A', borderRadius: '5px', color: '#fff', fontSize: '11px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                              💬 WA
                            </a>
                          )}

                          <span style={{ color: muted, fontSize: '14px' }}>{aberto ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {/* Expansão */}
                      {aberto && (
                        <div style={{ borderTop: `1px solid ${brd}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

                          {/* Links rápidos */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {lead.instagram_url && (
                              <a href={lead.instagram_url} target="_blank" rel="noopener noreferrer"
                                style={{ padding: '5px 12px', background: '#1F2937', border: `1px solid ${brd}`, borderRadius: '6px', color: '#E1306C', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                                📸 {lead.instagram ?? 'Instagram'}
                                {lead.instagram_seguidores && <span style={{ color: muted, fontWeight: 400 }}> · {lead.instagram_seguidores} seg.</span>}
                              </a>
                            )}
                            {!lead.instagram_url && (
                              <button onClick={() => enriquecerLead(lead.id)} disabled={enriquecendo === lead.id}
                                style={{ padding: '5px 12px', background: '#1F2937', border: `1px dashed #374151`, borderRadius: '6px', color: enriquecendo === lead.id ? muted : '#E1306C', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                {enriquecendo === lead.id ? '⏳ Buscando IG...' : '🔎 Buscar Instagram'}
                              </button>
                            )}
                            {lead.site && (
                              <a href={lead.site} target="_blank" rel="noopener noreferrer"
                                style={{ padding: '5px 12px', background: '#1F2937', border: `1px solid ${brd}`, borderRadius: '6px', color: '#60A5FA', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                                🌐 Site atual
                              </a>
                            )}
                            {lead.telefone && (
                              <a href={`https://wa.me/55${lead.telefone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                                style={{ padding: '5px 12px', background: '#1F2937', border: `1px solid ${brd}`, borderRadius: '6px', color: '#4ADE80', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                                💬 WhatsApp
                              </a>
                            )}
                          </div>

                          {/* Score IA + Análise de site */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-start' }}>

                            {/* Score IA */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
                              <button onClick={() => avaliarScoreIA(lead)} disabled={calculandoScore === lead.id}
                                style={{ padding: '5px 12px', background: '#1A0A2E', border: '1px solid #7C3AED40', borderRadius: '6px', color: calculandoScore === lead.id ? muted : '#A78BFA', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                {calculandoScore === lead.id ? '⏳...' : '🧠 Score IA'}
                              </button>
                              {scoreIA[lead.id] && (
                                <div style={{ background: '#1A0A2E', border: '1px solid #7C3AED40', borderRadius: '6px', padding: '6px 10px', flex: 1 }}>
                                  <span style={{ color: scoreInfo(scoreIA[lead.id].score).cor, fontWeight: 800, fontSize: '13px' }}>{scoreIA[lead.id].score}/10</span>
                                  <span style={{ color: muted, fontSize: '11px' }}> — {scoreIA[lead.id].justificativa}</span>
                                </div>
                              )}
                            </div>

                            {/* Analisar site (só para sites reais, não Maps) */}
                            {lead.site && !lead.site.includes('google.com/maps') && (
                              <button onClick={() => analisarSite(lead)} disabled={analisandoSite === lead.id}
                                style={{ padding: '5px 12px', background: '#0A1A2E', border: '1px solid #2563EB40', borderRadius: '6px', color: analisandoSite === lead.id ? muted : '#60A5FA', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                {analisandoSite === lead.id ? '⏳ Analisando...' : '🔍 Analisar site'}
                              </button>
                            )}

                            {/* Ver avaliações Google (só para leads do Maps) */}
                            {lead.nota && lead.site?.includes('google.com/maps') && (
                              <button onClick={() => analisarAvaliacoes(lead)} disabled={analisandoAvaliacoes === lead.id}
                                style={{ padding: '5px 12px', background: '#0A1A0A', border: '1px solid #16A34A40', borderRadius: '6px', color: analisandoAvaliacoes === lead.id ? muted : '#4ADE80', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                {analisandoAvaliacoes === lead.id ? '⏳ Lendo avaliações...' : `📊 Ver avaliações (${lead.num_avaliacoes ?? lead.nota}★)`}
                              </button>
                            )}
                          </div>

                          {/* Resultado análise do site */}
                          {analiseSite[lead.id] && (
                            <div style={{ background: '#0A1A2E', border: '1px solid #2563EB30', borderRadius: '8px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '10px', color: '#60A5FA', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>🔍 Análise do site atual</p>
                                <span style={{ fontSize: '13px', fontWeight: 800, color: analiseSite[lead.id].nota >= 7 ? '#16A34A' : analiseSite[lead.id].nota >= 5 ? '#F59E0B' : '#EF4444' }}>
                                  {analiseSite[lead.id].nota}/10
                                </span>
                              </div>
                              <p style={{ fontSize: '11px', color: txt, margin: 0 }}><span style={{ color: muted }}>Converte:</span> {analiseSite[lead.id].converte}</p>
                              <p style={{ fontSize: '11px', color: txt, margin: 0 }}><span style={{ color: muted }}>Problemas:</span> {analiseSite[lead.id].pontos_fracos}</p>
                              <p style={{ fontSize: '11px', color: '#FCD34D', margin: 0, fontWeight: 600 }}>💬 "{analiseSite[lead.id].argumento}"</p>
                              <p style={{ fontSize: '11px', color: muted, margin: 0 }}>Urgência {analiseSite[lead.id].urgencia}/5 — {analiseSite[lead.id].urgencia_motivo}</p>
                            </div>
                          )}

                          {/* Resultado análise de avaliações */}
                          {avaliacoesIA[lead.id] && (
                            <div style={{ background: '#0A1A0A', border: '1px solid #16A34A30', borderRadius: '8px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: '10px', color: '#4ADE80', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>📊 Avaliações Google</p>
                                <span style={{ fontSize: '11px', color: muted }}>
                                  ⭐ {avaliacoesIA[lead.id].media} · {avaliacoesIA[lead.id].total} aval.
                                </span>
                              </div>
                              <p style={{ fontSize: '11px', color: '#FCA5A5', margin: 0 }}>
                                <span style={{ color: muted }}>Dor principal:</span> {avaliacoesIA[lead.id].dor_principal}
                              </p>
                              <p style={{ fontSize: '11px', color: '#86EFAC', margin: 0 }}>
                                <span style={{ color: muted }}>Mais elogiam:</span> {avaliacoesIA[lead.id].elogio_principal}
                              </p>
                              <p style={{ fontSize: '11px', color: '#FCD34D', margin: 0, fontWeight: 600 }}>
                                💡 {avaliacoesIA[lead.id].oportunidade}
                              </p>
                              {avaliacoesIA[lead.id].avaliacoes?.length > 0 && (
                                <details style={{ marginTop: '4px' }}>
                                  <summary style={{ fontSize: '10px', color: muted, cursor: 'pointer' }}>
                                    Ver {avaliacoesIA[lead.id].avaliacoes.length} avaliações coletadas
                                  </summary>
                                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {avaliacoesIA[lead.id].avaliacoes.slice(0, 5).map((av: string, i: number) => (
                                      <p key={i} style={{ fontSize: '11px', color: muted, margin: 0, paddingLeft: '8px', borderLeft: '2px solid #374151' }}>
                                        "{av.slice(0, 120)}{av.length > 120 ? '...' : ''}"
                                      </p>
                                    ))}
                                  </div>
                                </details>
                              )}
                            </div>
                          )}

                          {/* Mensagem editável */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px', flexWrap: 'wrap' }}>
                              <p style={{ fontSize: '10px', color: muted, textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
                                {lead.status !== 'novo' ? 'Mensagem de follow-up' : 'Script de abordagem'}
                              </p>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                {lead.status === 'novo' && (
                                  <button onClick={() => gerarComIA(lead)} disabled={gerandoIA === lead.id} style={{
                                    padding: '4px 10px', background: gerandoIA === lead.id ? '#374151' : '#7C3AED',
                                    border: 'none', borderRadius: '5px', color: '#fff', fontSize: '10px', fontWeight: 700,
                                    cursor: gerandoIA === lead.id ? 'wait' : 'pointer',
                                  }}>
                                    {gerandoIA === lead.id ? '⏳ Gerando...' : '✨ Gerar com IA'}
                                  </button>
                                )}
                                {lead.status !== 'novo' && lead.status !== 'fechado' && lead.status !== 'sem_interesse' && (
                                  <button onClick={() => gerarFollowupLead(lead)} disabled={gerandoFollowup === lead.id} style={{
                                    padding: '4px 10px', background: gerandoFollowup === lead.id ? '#374151' : '#D97706',
                                    border: 'none', borderRadius: '5px', color: '#fff', fontSize: '10px', fontWeight: 700,
                                    cursor: gerandoFollowup === lead.id ? 'wait' : 'pointer',
                                  }}>
                                    {gerandoFollowup === lead.id ? '⏳ Gerando...' : '🔄 Gerar follow-up'}
                                  </button>
                                )}
                              </div>
                            </div>
                            <textarea
                              value={leads.find(l => l.id === lead.id)?.mensagem ?? ''}
                              onChange={e => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, mensagem: e.target.value } : l))}
                              onBlur={e => salvarMensagem(lead.id, e.target.value)}
                              rows={5}
                              style={{ width: '100%', padding: '10px', background: '#0F1117', border: `1px solid ${brd}`, borderRadius: '7px', color: txt, fontSize: '12px', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                            />

                            {/* Resultado da IA — abordagem inicial */}
                            {iaResultado[lead.id] && (
                              <div style={{ marginTop: '8px', padding: '10px 12px', background: '#1A0A2E', border: '1px solid #7C3AED40', borderRadius: '7px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <p style={{ fontSize: '9px', color: '#A78BFA', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>✨ Análise da IA</p>
                                <p style={{ fontSize: '11px', color: txt, margin: 0 }}><span style={{ color: muted }}>Diagnóstico:</span> {iaResultado[lead.id].diagnostico}</p>
                                <p style={{ fontSize: '11px', color: txt, margin: 0 }}><span style={{ color: muted }}>Argumento:</span> {iaResultado[lead.id].argumento}</p>
                                <p style={{ fontSize: '11px', color: '#FCD34D', margin: 0 }}><span style={{ color: muted }}>Urgência:</span> {iaResultado[lead.id].urgencia}</p>
                              </div>
                            )}

                            {/* Resultado do follow-up */}
                            {followupIA[lead.id] && (
                              <div style={{ marginTop: '8px', padding: '10px 12px', background: '#1A1000', border: '1px solid #D9770640', borderRadius: '7px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <p style={{ fontSize: '9px', color: '#FCD34D', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>🔄 Follow-up gerado</p>
                                  <span style={{ fontSize: '10px', color: '#F59E0B', background: '#F59E0B15', padding: '1px 7px', borderRadius: '4px', fontWeight: 600 }}>
                                    📅 {followupIA[lead.id].quando}
                                  </span>
                                </div>
                                <p style={{ fontSize: '11px', color: muted, margin: 0 }}><span style={{ color: '#9CA3AF' }}>Ângulo:</span> {followupIA[lead.id].angulo}</p>
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                              <button onClick={() => copiar(`msg-${lead.id}`, leads.find(l => l.id === lead.id)?.mensagem ?? '')}
                                style={{ padding: '5px 12px', background: '#1F2937', border: `1px solid ${brd}`, borderRadius: '6px', color: muted, fontSize: '11px', cursor: 'pointer' }}>
                                {copiado === `msg-${lead.id}` ? '✅ Copiado' : '📋 Copiar'}
                              </button>
                              {wLink && (
                                <a href={wLink} target="_blank" rel="noopener noreferrer"
                                  onClick={() => setStatus(lead.id, 'abordado')}
                                  style={{ padding: '5px 12px', background: '#16A34A', borderRadius: '6px', color: '#fff', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}>
                                  💬 Enviar no WhatsApp
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Notas */}
                          <div>
                            <p style={{ fontSize: '10px', color: muted, marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>Anotações</p>
                            <textarea
                              defaultValue={lead.notas ?? ''}
                              onBlur={e => salvarNotas(lead.id, e.target.value)}
                              placeholder="O que conversou, o que ele disse, próximo passo..."
                              rows={3}
                              style={{ width: '100%', padding: '10px', background: '#0F1117', border: `1px solid ${brd}`, borderRadius: '7px', color: txt, fontSize: '12px', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                            />
                          </div>

                          {/* Follow-up */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <p style={{ fontSize: '10px', color: muted, textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Follow-up</p>
                            <input type="date" defaultValue={lead.proximo_followup ?? ''}
                              onBlur={async e => {
                                await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: lead.id, action: 'followup', data: e.target.value }) })
                                carregar()
                              }}
                              style={{ padding: '4px 10px', background: '#0F1117', border: `1px solid ${brd}`, borderRadius: '6px', color: txt, fontSize: '12px', outline: 'none' }}
                            />
                          </div>

                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
