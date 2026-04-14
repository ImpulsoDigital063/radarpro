'use client'

import { useEffect, useState, useCallback } from 'react'

type Lead = {
  id: number
  nome: string
  categoria: string
  tipo: 'lp' | 'shopify' | 'agendapro'
  telefone: string | null
  instagram: string | null
  site: string | null
  nota: number | null
  status: string
  mensagem: string | null
  fonte: string
  criado_em: string
}

type Stats = {
  total: number
  lp: number
  shopify: number
  agendapro: number
  novos: number
  abordados: number
  consultorias: number
  fechados: number
}

const STATUS_LABELS: Record<string, { label: string; cor: string }> = {
  novo:                { label: 'Novo',               cor: '#6B7280' },
  abordado:            { label: 'Abordado',            cor: '#2563EB' },
  respondeu:           { label: 'Respondeu',           cor: '#7C3AED' },
  consultoria_marcada: { label: 'Consultoria marcada', cor: '#D97706' },
  consultoria_feita:   { label: 'Consultoria feita',   cor: '#0891B2' },
  proposta_enviada:    { label: 'Proposta enviada',    cor: '#EA580C' },
  fechado:             { label: 'Fechado ✅',          cor: '#16A34A' },
  sem_interesse:       { label: 'Sem interesse',       cor: '#DC2626' },
}

const TIPO_CONFIG = {
  lp:        { label: 'Landing Page', cor: '#2563EB', emoji: '📄' },
  shopify:   { label: 'Shopify',      cor: '#10B981', emoji: '🛒' },
  agendapro: { label: 'AgendaPRO',    cor: '#7C3AED', emoji: '📅' },
}

function gerarLinkWhatsApp(telefone: string, mensagem: string) {
  const num = telefone.replace(/\D/g, '')
  const completo = num.startsWith('55') ? num : `55${num}`
  return `https://wa.me/${completo}?text=${encodeURIComponent(mensagem)}`
}

export default function RadarPRO() {
  const [leads, setLeads]           = useState<Lead[]>([])
  const [stats, setStats]           = useState<Stats | null>(null)
  const [tipoFiltro, setTipo]       = useState<string>('todos')
  const [statusFiltro, setStatus]   = useState<string>('todos')
  const [buscando, setBuscando]     = useState<string | null>(null)
  const [copiado, setCopiado]       = useState<number | null>(null)

  const carregarLeads = useCallback(async () => {
    const params = new URLSearchParams()
    if (tipoFiltro !== 'todos')   params.set('tipo', tipoFiltro)
    if (statusFiltro !== 'todos') params.set('status', statusFiltro)
    const [leadsRes, statsRes] = await Promise.all([
      fetch(`/api/leads?${params}`).then(r => r.json()),
      fetch('/api/leads?stats=1').then(r => r.json()),
    ])
    setLeads(leadsRes)
    setStats(statsRes)
  }, [tipoFiltro, statusFiltro])

  useEffect(() => { carregarLeads() }, [carregarLeads])

  async function rodarBusca(tipo: string) {
    setBuscando(tipo)
    await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo }),
    })
    await carregarLeads()
    setBuscando(null)
  }

  async function atualizarStatus(id: number, status: string) {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    carregarLeads()
  }

  function copiarMensagem(id: number, mensagem: string) {
    navigator.clipboard.writeText(mensagem)
    setCopiado(id)
    setTimeout(() => setCopiado(null), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1117', color: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #1F2937', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#F9FAFB', margin: 0 }}>
            radar<span style={{ color: '#2563EB' }}>PRO</span>
          </h1>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>Prospecção automática — Impulso Digital</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['lp', 'shopify', 'agendapro'] as const).map(tipo => (
            <button key={tipo} onClick={() => rodarBusca(tipo)} disabled={!!buscando} style={{
              padding: '8px 16px', background: buscando === tipo ? '#374151' : TIPO_CONFIG[tipo].cor,
              color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              cursor: buscando ? 'wait' : 'pointer', opacity: buscando && buscando !== tipo ? 0.5 : 1,
            }}>
              {buscando === tipo ? '⏳ Buscando...' : `${TIPO_CONFIG[tipo].emoji} Buscar ${TIPO_CONFIG[tipo].label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#1F2937', borderBottom: '1px solid #1F2937' }}>
          {[
            { label: 'Total',        value: stats.total,        cor: '#F9FAFB' },
            { label: 'LP',           value: stats.lp,           cor: '#2563EB' },
            { label: 'Shopify',      value: stats.shopify,      cor: '#10B981' },
            { label: 'AgendaPRO',    value: stats.agendapro,    cor: '#7C3AED' },
            { label: 'Novos',        value: stats.novos,        cor: '#F59E0B' },
            { label: 'Consultorias', value: stats.consultorias, cor: '#0891B2' },
            { label: 'Fechados',     value: stats.fechados,     cor: '#16A34A' },
          ].map(s => (
            <div key={s.label} style={{ background: '#111827', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 800, color: s.cor, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: '#6B7280', margin: '4px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div style={{ padding: '14px 32px', display: 'flex', gap: '12px', borderBottom: '1px solid #1F2937', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['todos', 'lp', 'shopify', 'agendapro'].map(t => (
            <button key={t} onClick={() => setTipo(t)} style={{
              padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              background: tipoFiltro === t ? '#2563EB' : '#1F2937',
              color: tipoFiltro === t ? '#fff' : '#9CA3AF',
            }}>
              {t === 'todos' ? 'Todos' : TIPO_CONFIG[t as keyof typeof TIPO_CONFIG]?.label}
            </button>
          ))}
        </div>
        <div style={{ width: '1px', height: '20px', background: '#374151' }} />
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['todos', ...Object.keys(STATUS_LABELS)].map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{
              padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              background: statusFiltro === s ? '#374151' : 'transparent',
              color: statusFiltro === s ? '#F9FAFB' : '#6B7280',
            }}>
              {s === 'todos' ? 'Todos' : STATUS_LABELS[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads */}
      <div style={{ padding: '20px 32px' }}>
        {leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#4B5563' }}>
            <p style={{ fontSize: '40px', margin: '0 0 12px' }}>📡</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#6B7280' }}>Nenhum lead ainda</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Clique em "Buscar" para iniciar a prospecção automática</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>{leads.length} lead{leads.length !== 1 ? 's' : ''} encontrado{leads.length !== 1 ? 's' : ''}</p>
            {leads.map(lead => {
              const tipoInfo   = TIPO_CONFIG[lead.tipo]
              const statusInfo = STATUS_LABELS[lead.status] ?? STATUS_LABELS.novo
              const whatsappLink = lead.telefone && lead.mensagem
                ? gerarLinkWhatsApp(lead.telefone, lead.mensagem)
                : null

              return (
                <div key={lead.id} style={{
                  background: '#111827', border: '1px solid #1F2937', borderRadius: '10px',
                  padding: '14px 18px', display: 'grid',
                  gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700,
                      background: tipoInfo.cor + '25', color: tipoInfo.cor, whiteSpace: 'nowrap', flexShrink: 0,
                    }}>
                      {tipoInfo.emoji} {tipoInfo.label}
                    </span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px', margin: 0, color: '#F9FAFB' }}>{lead.nome}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                        {lead.categoria}
                        {lead.telefone && ` · 📱 ${lead.telefone}`}
                        {lead.nota && ` · ⭐ ${lead.nota}`}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <select value={lead.status} onChange={e => atualizarStatus(lead.id, e.target.value)} style={{
                      background: '#1F2937', border: '1px solid #374151', color: statusInfo.cor,
                      borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      {Object.entries(STATUS_LABELS).map(([v, s]) => (
                        <option key={v} value={v} style={{ color: '#F9FAFB' }}>{s.label}</option>
                      ))}
                    </select>

                    {lead.mensagem && (
                      <button onClick={() => copiarMensagem(lead.id, lead.mensagem!)} style={{
                        padding: '5px 10px', background: '#1F2937', border: '1px solid #374151',
                        borderRadius: '6px', color: '#9CA3AF', fontSize: '11px', cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}>
                        {copiado === lead.id ? '✅ Copiado' : '📋 Copiar'}
                      </button>
                    )}

                    {whatsappLink ? (
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                        onClick={() => atualizarStatus(lead.id, 'abordado')} style={{
                        padding: '5px 12px', background: '#16A34A', border: 'none', borderRadius: '6px',
                        color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                        textDecoration: 'none', whiteSpace: 'nowrap',
                      }}>
                        💬 WhatsApp
                      </a>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#374151' }}>Sem tel</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
