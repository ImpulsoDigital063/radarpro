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
  const [expandido, setExpandido] = useState<number | null>(null)
  const [copiado, setCopiado]     = useState<string | null>(null)
  const [aba, setAba]             = useState<'leads' | 'analisar'>('leads')

  // Analisador
  const [linkInput, setLinkInput]   = useState('')
  const [analisando, setAnalisando] = useState(false)
  const [analise, setAnalise]       = useState<Analise | null>(null)
  const [tipoSalvar, setTipoSalvar] = useState('lp')
  const [msgEditada, setMsgEditada] = useState('')
  const [erroAnalise, setErroAnalise] = useState('')

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
      if (!status.emAndamento[buscando]) {
        setBuscando(null)
      }
    }, 10000)
    return () => clearInterval(intervalo)
  }, [buscando, carregar])

  async function buscar(tipo: string) {
    if (buscando) return
    const r = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo }),
    })
    const data = await r.json()
    if (data.ok) {
      setBuscando(tipo) // polling assume daqui
    }
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
      <div style={{ borderBottom: `1px solid ${brd}`, padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>radar<span style={{ color: '#2563EB' }}>PRO</span></h1>
          <p style={{ fontSize: '11px', color: muted, margin: '2px 0 0' }}>Prospecção automática — Impulso Digital</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['lp', 'shopify', 'agendapro'] as const).map(t => (
            <button key={t} onClick={() => buscar(t)} disabled={!!buscando} style={{
              padding: '7px 14px', background: buscando === t ? '#374151' : TIPO[t].cor,
              color: '#fff', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
              cursor: buscando ? 'wait' : 'pointer', opacity: buscando && buscando !== t ? 0.4 : 1,
            }}>
              {buscando === t ? '⏳ Buscando...' : `${TIPO[t].emoji} ${TIPO[t].label}`}
            </button>
          ))}
        </div>
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
        {[{ id: 'leads', label: '📋 Leads' }, { id: 'analisar', label: '🔍 Analisar link' }].map(a => (
          <button key={a.id} onClick={() => setAba(a.id as any)} style={{
            padding: '12px 24px', background: 'transparent', border: 'none',
            borderBottom: aba === a.id ? '2px solid #2563EB' : '2px solid transparent',
            color: aba === a.id ? txt : muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}>{a.label}</button>
        ))}
      </div>

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
                <p style={{ fontSize: '12px', fontWeight: 700, color: muted, margin: '0 0 10px', textTransform: 'uppercase' }}>Script de abordagem — edite se quiser</p>
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
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {lead.instagram_url && (
                              <a href={lead.instagram_url} target="_blank" rel="noopener noreferrer"
                                style={{ padding: '5px 12px', background: '#1F2937', border: `1px solid ${brd}`, borderRadius: '6px', color: '#E1306C', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                                📸 Instagram
                              </a>
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

                          {/* Mensagem editável */}
                          <div>
                            <p style={{ fontSize: '10px', color: muted, marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>Script de abordagem</p>
                            <textarea
                              defaultValue={lead.mensagem ?? ''}
                              onBlur={e => salvarMensagem(lead.id, e.target.value)}
                              rows={5}
                              style={{ width: '100%', padding: '10px', background: '#0F1117', border: `1px solid ${brd}`, borderRadius: '7px', color: txt, fontSize: '12px', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                            />
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                              <button onClick={() => copiar(`msg-${lead.id}`, lead.mensagem ?? '')}
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
