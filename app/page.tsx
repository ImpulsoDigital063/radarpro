'use client'

/**
 * PAINEL radarPRO — enxugado 15/07/2026 (pedido do Eduardo: mais limpo, mais
 * fácil de operar).
 *
 * O QUE SAIU (era cruft da era antiga):
 *  · abas "Prospectar hoje" (a Fila de hoje faz isso melhor), "Em estudo",
 *    "Analisar link"
 *  · TODOS os botões de IA por lead (Diagnóstico, Score IA, Termômetro, análise
 *    de site/avaliações, gerar follow-up) — a mensagem já vem pronta, não precisa
 *  · páginas /tally e /licoes (não usadas)
 *
 * O QUE FICOU (o núcleo da prospecção):
 *  · lista de leads com busca por nome e filtro de status
 *  · buscar novos no Google Maps
 *  · ver/copiar a mensagem pronta · abrir no WhatsApp · mudar status · anotações
 *  · atalho grande pra FILA DE HOJE (onde o disparo acontece de verdade)
 */

import { useEffect, useState, useCallback, useMemo, type CSSProperties } from 'react'

type Lead = {
  id: number
  nome: string
  categoria: string
  tipo: 'lp' | 'shopify' | 'agendapro'
  telefone: string | null
  instagram: string | null
  site: string | null
  nota: number | null
  num_avaliacoes: number | null
  score: number
  status: string
  mensagem: string | null
  notas: string | null
  proximo_followup: string | null
  disparado_em: string | null
  respondeu_em: string | null
  selecionado: number | null
  endereco: string | null
}

type Stats = {
  total: number; novos: number; abordados: number; consultorias: number; fechados: number
}

const STATUS: Record<string, { label: string; cor: string }> = {
  novo:                { label: 'Novo',                cor: '#6B7280' },
  abordado:            { label: 'Abordado',            cor: '#2563EB' },
  respondeu:           { label: 'Respondeu',           cor: '#7C3AED' },
  consultoria_marcada: { label: 'Reunião marcada',     cor: '#D97706' },
  consultoria_feita:   { label: 'Reunião feita',       cor: '#0891B2' },
  proposta_enviada:    { label: 'Proposta enviada',    cor: '#EA580C' },
  fechado:             { label: 'Fechado ✅',          cor: '#16A34A' },
  sem_interesse:       { label: 'Sem interesse',       cor: '#DC2626' },
}

function scoreInfo(s: number) {
  if (s >= 8) return { cor: '#EF4444', emoji: '🔥' }
  if (s >= 6) return { cor: '#F59E0B', emoji: '⚡' }
  if (s >= 4) return { cor: '#3B82F6', emoji: '❄️' }
  return { cor: '#6B7280', emoji: '💤' }
}

function waLink(tel: string, msg?: string | null) {
  const n = tel.replace(/\D/g, '')
  const num = n.startsWith('55') ? n : '55' + n
  return msg ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : `https://wa.me/${num}`
}

function followupVencido(data: string | null): boolean {
  if (!data) return false
  return data.slice(0, 10) < new Date().toISOString().slice(0, 10)
}

/* cores */
const bg = '#0F1117', card = '#111827', brd = '#1F2937', txt = '#F9FAFB', muted = '#6B7280'

export default function RadarPRO() {
  const [leads, setLeads]   = useState<Lead[]>([])
  const [stats, setStats]   = useState<Stats | null>(null)
  const [statusF, setStatusF] = useState('todos')
  const [busca, setBusca]   = useState('')
  const [expandido, setExpandido] = useState<number | null>(null)
  const [copiado, setCopiado] = useState<string | null>(null)
  const [wa, setWa] = useState<string>('desconectado')

  // buscar novos (scraper Google Maps)
  const [query, setQuery] = useState('')
  const [scraping, setScraping] = useState<string | null>(null)

  const carregar = useCallback(async () => {
    const p = new URLSearchParams()
    if (statusF !== 'todos') p.set('status', statusF)
    const [l, s] = await Promise.all([
      fetch(`/api/leads?${p}`).then(r => r.json()),
      fetch('/api/leads?stats=1').then(r => r.json()),
    ])
    setLeads(Array.isArray(l) ? l : [])
    setStats(s)
  }, [statusF])

  useEffect(() => { carregar() }, [carregar])

  // status do WhatsApp (polling leve)
  useEffect(() => {
    let vivo = true
    const check = async () => {
      try { const d = await fetch('/api/whatsapp/qr', { cache: 'no-store' }).then(r => r.json()); if (vivo && d.status) setWa(d.status) }
      catch { /* offline */ }
    }
    check(); const i = setInterval(check, 12000)
    return () => { vivo = false; clearInterval(i) }
  }, [])

  // progresso do scraper
  useEffect(() => {
    if (!scraping) return
    const i = setInterval(async () => {
      const s = await fetch('/api/scrape').then(r => r.json()).catch(() => ({ emAndamento: {} }))
      if (!s.emAndamento?.[scraping]) { setScraping(null); carregar() }
    }, 4000)
    return () => clearInterval(i)
  }, [scraping, carregar])

  async function buscarNovos() {
    if (scraping || !query.trim()) return
    const r = await fetch('/api/scrape', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'agendapro', query: query.trim() }),
    })
    const d = await r.json()
    if (d.ok) setScraping(d.chave)
  }

  async function mudarStatus(id: number, status: string) {
    await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'status', status }) })
    carregar()
  }

  async function salvarNotas(id: number, notas: string) {
    await fetch('/api/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'notas', notas }) })
  }

  function copiar(key: string, t: string) {
    navigator.clipboard.writeText(t); setCopiado(key); setTimeout(() => setCopiado(null), 1600)
  }

  // filtro por nome no client
  const visiveis = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return leads
    return leads.filter(l => (l.nome ?? '').toLowerCase().includes(q) || (l.categoria ?? '').toLowerCase().includes(q))
  }, [leads, busca])

  return (
    <div style={{ minHeight: '100vh', background: bg, color: txt, fontFamily: 'system-ui, sans-serif' }}>

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${brd}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ marginRight: 'auto' }}>
          <span style={{ fontSize: 18, fontWeight: 800 }}>radar<span style={{ color: '#7C3AED' }}>PRO</span></span>
          <span style={{ fontSize: 11, color: muted, marginLeft: 8 }}>Impulso Digital</span>
        </div>

        <a href="/integracao/whatsapp" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
          padding: '6px 12px', borderRadius: 999, border: `1px solid ${wa === 'conectado' ? '#10B981' : brd}`,
          background: wa === 'conectado' ? '#064E3B' : card, color: wa === 'conectado' ? '#6EE7B7' : muted, fontSize: 11, fontWeight: 700 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: wa === 'conectado' ? '#10B981' : muted }} />
          WhatsApp {wa === 'conectado' ? 'conectado' : 'desconectado'}
        </a>

        <a href="/disparo" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none',
          padding: '8px 18px', borderRadius: 10, background: '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 800 }}>
          🎯 Fila de hoje
        </a>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>

        {/* STATS */}
        {stats && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            <Placar rot="leads" val={stats.total} cor="#A78BFA" />
            <Placar rot="novos" val={stats.novos} cor="#6B7280" />
            <Placar rot="abordados" val={stats.abordados} cor="#2563EB" />
            <Placar rot="fechados" val={stats.fechados} cor="#16A34A" />
          </div>
        )}

        {/* BUSCAR NOVOS */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarNovos()}
            placeholder='Buscar novos no Google Maps — ex: "barbearia Palmas TO"'
            style={{ flex: 1, minWidth: 240, padding: '10px 14px', background: card, border: `1px solid ${brd}`, borderRadius: 10, color: txt, fontSize: 13 }} />
          <button onClick={buscarNovos} disabled={!!scraping || !query.trim()}
            style={{ padding: '10px 18px', background: scraping ? '#374151' : '#7C3AED', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: scraping ? 'default' : 'pointer' }}>
            {scraping ? 'buscando…' : '🔍 buscar'}
          </button>
        </div>

        {/* FILTRO STATUS + BUSCA NOME */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="filtrar por nome…"
            style={{ flex: 1, minWidth: 180, padding: '8px 12px', background: card, border: `1px solid ${brd}`, borderRadius: 8, color: txt, fontSize: 12 }} />
          <select value={statusF} onChange={e => setStatusF(e.target.value)}
            style={{ padding: '8px 12px', background: card, border: `1px solid ${brd}`, borderRadius: 8, color: txt, fontSize: 12 }}>
            <option value="todos">todos os status</option>
            {Object.entries(STATUS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
          </select>
        </div>

        <p style={{ fontSize: 11, color: muted, margin: '0 0 10px' }}>{visiveis.length} lead{visiveis.length !== 1 ? 's' : ''}</p>

        {/* LISTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visiveis.map(lead => {
            const aberto = expandido === lead.id
            const st = STATUS[lead.status] ?? STATUS.novo
            const sc = scoreInfo(lead.score ?? 0)
            return (
              <div key={lead.id} style={{ background: card, border: `1px solid ${aberto ? '#7C3AED55' : brd}`, borderRadius: 12, overflow: 'hidden' }}>
                {/* linha */}
                <div onClick={() => setExpandido(aberto ? null : lead.id)}
                  style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <span style={{ fontSize: 15 }}>{sc.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.nome}</div>
                    <div style={{ fontSize: 11, color: muted }}>
                      {lead.categoria}{lead.telefone ? ` · ${lead.telefone}` : ' · sem telefone'}
                    </div>
                  </div>
                  {lead.disparado_em && <span title="já abordado" style={{ fontSize: 11 }}>📨</span>}
                  {followupVencido(lead.proximo_followup) && <span title="follow-up vencido" style={{ fontSize: 11 }}>⏰</span>}
                  <span style={{ fontSize: 10, fontWeight: 700, color: st.cor, border: `1px solid ${st.cor}55`, background: st.cor + '15', padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>{st.label}</span>
                </div>

                {/* corpo */}
                {aberto && (
                  <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* mensagem pronta */}
                    <div>
                      <p style={{ fontSize: 10, color: muted, margin: '0 0 5px', fontWeight: 800 }}>MENSAGEM PRONTA</p>
                      <div style={{ padding: 12, background: '#000', border: `1px solid ${brd}`, borderRadius: 8 }}>
                        <p style={{ fontSize: 12, color: '#E5E7EB', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{lead.mensagem ?? '— sem mensagem (lead sem playbook ou sem nicho) —'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        {lead.mensagem && (
                          <button onClick={() => copiar(`m${lead.id}`, lead.mensagem!)} style={btnSec}>
                            {copiado === `m${lead.id}` ? '✅ copiado' : '📋 copiar'}
                          </button>
                        )}
                        {lead.telefone && (
                          <a href={waLink(lead.telefone, lead.mensagem)} target="_blank" rel="noopener noreferrer"
                            style={{ ...btnSec, background: '#065F46', border: '1px solid #047857', color: '#D1FAE5', textDecoration: 'none' }}>
                            💬 abrir no WhatsApp
                          </a>
                        )}
                      </div>
                    </div>

                    {/* status rápido */}
                    <div>
                      <p style={{ fontSize: 10, color: muted, margin: '0 0 5px', fontWeight: 800 }}>STATUS</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {Object.entries(STATUS).map(([v, s]) => (
                          <button key={v} onClick={() => mudarStatus(lead.id, v)}
                            style={{ padding: '5px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                              border: `1px solid ${lead.status === v ? s.cor : brd}`,
                              background: lead.status === v ? s.cor + '25' : 'transparent',
                              color: lead.status === v ? s.cor : muted }}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* anotações */}
                    <div>
                      <p style={{ fontSize: 10, color: muted, margin: '0 0 5px', fontWeight: 800 }}>ANOTAÇÕES</p>
                      <textarea defaultValue={lead.notas ?? ''} onBlur={e => salvarNotas(lead.id, e.target.value)}
                        placeholder="o que rolou na conversa…"
                        style={{ width: '100%', minHeight: 54, padding: 10, background: '#000', border: `1px solid ${brd}`, borderRadius: 8, color: txt, fontSize: 12, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                    </div>

                    {/* links */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 11 }}>
                      {lead.instagram && <a href={`https://instagram.com/${lead.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', textDecoration: 'none' }}>@{lead.instagram.replace('@', '')}</a>}
                      {lead.site && !/google\.com\/maps/.test(lead.site) && <a href={lead.site} target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA', textDecoration: 'none' }}>site</a>}
                      {lead.endereco && <span style={{ color: muted }}>{lead.endereco}</span>}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {visiveis.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', border: `1px dashed ${brd}`, borderRadius: 12 }}>
              <p style={{ fontSize: 13, color: muted, margin: 0 }}>Nenhum lead aqui. Busca novos no Google Maps lá em cima.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const btnSec: CSSProperties = {
  padding: '8px 12px', borderRadius: 8, border: `1px solid ${brd}`, background: '#18181B',
  color: '#D1D5DB', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
}

function Placar({ rot, val, cor }: { rot: string; val: number; cor: string }) {
  return (
    <div style={{ flex: '1 1 90px', padding: '10px 14px', border: `1px solid ${brd}`, borderRadius: 10, background: card }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: cor }}>{val}</div>
      <div style={{ fontSize: 10, color: muted, fontWeight: 700 }}>{rot}</div>
    </div>
  )
}
