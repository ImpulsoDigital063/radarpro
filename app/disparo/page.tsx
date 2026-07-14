'use client'

/**
 * FILA DE HOJE — a tela de trabalho do dia.
 *
 * A versão antiga lia uma lista de IDs CHUMBADA em lib/disparo-analises.ts (abril,
 * era das LPs/Shopify): os leads novos nunca apareciam e o cabeçalho ainda dizia
 * "Leads priorizados (LP + Shopify)". Pior: clicar no wa.me NÃO marcava nada no
 * banco — o teto diário não contava, o anti-duplicata não enxergava, e não dava
 * pra saber quem já tinha recebido.
 *
 * Agora: um lead por vez, mensagem pronta, 1 toque abre o WhatsApp E marca.
 *
 * Por que wa.me e não envio automático: o Baileys não roda na Vercel (serverless
 * não segura sessão de WhatsApp), e — mais importante — disparo automático em
 * massa é o que faz o WhatsApp BANIR número. É o mesmo argumento que a gente
 * vende pro cliente. Vale aqui.
 */

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import HeaderRadarPRO from '@/components/HeaderRadarPRO'

type LeadFila = {
  id: number
  nome: string
  categoria: string
  telefone: string | null
  nicho: string
  situacao: string
  sistema_detectado: string | null
  estudado: boolean
  gancho: string | null
  negativas: number
  dorEscrita: string | null
  mensagem: string | null
  link: string | null
  playbook: any
}

type Followup = {
  id: number
  nome: string
  telefone: string | null
  dias: number
  qual: 'd3' | 'd7'
  mensagem: string | null
  link: string | null
}

type Respondido = {
  id: number
  nome: string
  telefone: string | null
  respondeu_em: string
  termometro: string | null
  playbook: any
}

type Dados = {
  hoje: { enviadas: number; teto: number; restam: number; janela: string; dentroDaJanela: boolean }
  fila: LeadFila[]
  followups: Followup[]
  respondidos: Respondido[]
}

const NICHO_LABEL: Record<string, string> = {
  barbearia: 'Barbearia', lash: 'Lash', estetica: 'Estética', salao: 'Salão',
  nail: 'Nail', sobrancelha: 'Sobrancelha', trancas: 'Tranças', outro: '—',
}

const SITUACAO_LABEL: Record<string, { txt: string; cor: string }> = {
  USA_SISTEMA:           { txt: 'já usa sistema', cor: '#F97316' },
  MOVIMENTO_ALTO_MANUAL: { txt: 'movimento alto', cor: '#EAB308' },
  AGENDA_PELA_DM:        { txt: 'agenda pela DM', cor: '#38BDF8' },
  TEM_SITE_PROPRIO:      { txt: 'tem site',       cor: '#A78BFA' },
  FRIO:                  { txt: 'frio',           cor: '#6B7280' },
  DESCONHECIDO:          { txt: '—',              cor: '#6B7280' },
}

export default function FilaPage() {
  const [d, setD] = useState<Dados | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aba, setAba] = useState<'fila' | 'followup' | 'respondeu'>('fila')
  const [i, setI] = useState(0)
  const [ocupado, setOcupado] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [verPlaybook, setVerPlaybook] = useState(false)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const r = await fetch('/api/fila', { cache: 'no-store' })
      const j = await r.json()
      if (j.error) throw new Error(j.error)
      setD(j)
      setErro('')
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function marcar(leadId: number, acao: string, motivo?: string) {
    setOcupado(true)
    try {
      const r = await fetch('/api/fila/marcar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, acao, motivo }),
      })
      const j = await r.json()
      if (j.error) throw new Error(j.error)
      return true
    } catch (e: any) {
      setErro(e.message)
      return false
    } finally {
      setOcupado(false)
    }
  }

  /** O botão principal: abre o WhatsApp com a msg pronta E marca o disparo. */
  async function enviar(lead: LeadFila) {
    if (!lead.link) { setErro('lead sem telefone'); return }
    // abre ANTES do await — senão o navegador bloqueia o popup
    window.open(lead.link, '_blank', 'noopener,noreferrer')
    if (await marcar(lead.id, 'disparado')) {
      setVerPlaybook(false)
      await carregar()
      setI(0)
    }
  }

  async function enviarFollowup(f: Followup) {
    if (!f.link) return
    window.open(f.link, '_blank', 'noopener,noreferrer')
    if (await marcar(f.id, 'followup')) await carregar()
  }

  async function pular(lead: LeadFila) {
    if (await marcar(lead.id, 'pular')) { setVerPlaybook(false); await carregar(); setI(0) }
  }

  if (carregando && !d) return <Tela><p style={{ color: '#9CA3AF' }}>Carregando a fila…</p></Tela>
  if (!d) return <Tela><p style={{ color: '#F87171' }}>{erro || 'Falhou ao carregar.'}</p></Tela>

  const { hoje } = d
  const lead = d.fila[i]
  const acabouOTeto = hoje.restam <= 0
  const travado = acabouOTeto || !hoje.dentroDaJanela

  return (
    <Tela>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#F9FAFB' }}>Fila de hoje</h1>
        <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>
          Um lead por vez. A mensagem já está escrita. Um toque abre o WhatsApp e marca o disparo.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <Placar rotulo="enviadas hoje" valor={`${hoje.enviadas}`} sub={`de ${hoje.teto}`} cor="#10B981" />
        <Placar rotulo="ainda posso mandar" valor={`${hoje.restam}`} cor={acabouOTeto ? '#F87171' : '#60A5FA'} />
        <Placar rotulo="na fila" valor={`${d.fila.length}`} sub="sem contato" cor="#A78BFA" />
        <Placar rotulo="follow-up devendo" valor={`${d.followups.length}`} cor="#F59E0B" />
        <Placar rotulo="responderam" valor={`${d.respondidos.length}`} cor="#34D399" />
      </div>

      {!hoje.dentroDaJanela && (
        <Aviso cor="#F59E0B">
          Fora da janela de envio ({hoje.janela}). Mensagem de vendas às 6h ou às 23h queima o
          número e irrita quem recebe. Volte no horário comercial.
        </Aviso>
      )}
      {acabouOTeto && (
        <Aviso cor="#F87171">
          Teto do dia batido ({hoje.teto} mensagens). Parar aqui é o que protege o seu número — o
          WhatsApp bane quem dispara muito, rápido demais.
        </Aviso>
      )}
      {erro && <Aviso cor="#F87171">{erro}</Aviso>}

      <div style={{ display: 'flex', gap: 6, marginBottom: 16, borderBottom: '1px solid #27272A' }}>
        {([
          ['fila', `Atacar (${d.fila.length})`],
          ['followup', `Follow-up (${d.followups.length})`],
          ['respondeu', `Responderam (${d.respondidos.length})`],
        ] as const).map(([k, txt]) => (
          <button key={k} onClick={() => setAba(k)}
            style={{
              padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 700,
              color: aba === k ? '#F9FAFB' : '#6B7280',
              borderBottom: aba === k ? '2px solid #10B981' : '2px solid transparent',
            }}>
            {txt}
          </button>
        ))}
      </div>

      {/* ── ATACAR ────────────────────────────────────────────────── */}
      {aba === 'fila' && (
        !lead ? (
          <Vazio texto="Fila zerada. Todo mundo já foi abordado." />
        ) : (
          <div style={{ border: '1px solid #27272A', borderRadius: 14, background: '#0F1117', overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #1F2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0, color: '#F9FAFB' }}>{lead.nome}</h2>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>
                    {lead.categoria} · {lead.telefone}
                  </p>
                </div>
                <span style={{ fontSize: 11, color: '#4B5563', whiteSpace: 'nowrap' }}>
                  {i + 1} de {d.fila.length}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                <Etiqueta cor="#9CA3AF">{NICHO_LABEL[lead.nicho] ?? lead.nicho}</Etiqueta>
                <Etiqueta cor={SITUACAO_LABEL[lead.situacao]?.cor ?? '#6B7280'}>
                  {SITUACAO_LABEL[lead.situacao]?.txt ?? lead.situacao}
                </Etiqueta>
                {lead.sistema_detectado && <Etiqueta cor="#F97316">🔥 usa {lead.sistema_detectado}</Etiqueta>}
                {lead.estudado && <Etiqueta cor="#34D399">✍️ estudado</Etiqueta>}
                {lead.negativas > 0 && (
                  <Etiqueta cor="#F87171">⚠️ {lead.negativas} negativa{lead.negativas > 1 ? 's' : ''}</Etiqueta>
                )}
              </div>
            </div>

            {(lead.gancho || lead.dorEscrita) && (
              <div style={{ padding: '14px 18px', background: '#0B0D12', borderBottom: '1px solid #1F2937' }}>
                {lead.gancho && (
                  <>
                    <Rotulo>O QUE EU DESCOBRI SOBRE ELE</Rotulo>
                    <p style={{ fontSize: 12, color: '#D1D5DB', margin: 0, lineHeight: 1.6 }}>{lead.gancho}</p>
                  </>
                )}
                {lead.dorEscrita && (
                  <div style={{ marginTop: lead.gancho ? 10 : 0 }}>
                    <Rotulo>O QUE UM CLIENTE DELE ESCREVEU — não repita isso pra ele</Rotulo>
                    <p style={{ fontSize: 12, color: '#FCA5A5', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                      “{lead.dorEscrita}”
                    </p>
                  </div>
                )}
              </div>
            )}

            <div style={{ padding: '16px 18px' }}>
              <Rotulo>A MENSAGEM QUE VAI SAIR</Rotulo>
              <div style={{ padding: 14, background: '#000', border: '1px solid #1F2937', borderRadius: 10 }}>
                <p style={{ fontSize: 13, color: '#E5E7EB', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {lead.mensagem ?? '— sem mensagem gerada —'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <button
                  onClick={() => enviar(lead)}
                  disabled={ocupado || !lead.link || travado}
                  style={{
                    flex: 1, minWidth: 230, padding: '13px 18px', borderRadius: 10, border: 'none',
                    background: travado ? '#1F2937' : '#10B981',
                    color: travado ? '#6B7280' : '#04120C',
                    fontSize: 14, fontWeight: 800,
                    cursor: (ocupado || travado) ? 'not-allowed' : 'pointer',
                  }}>
                  {ocupado ? 'marcando…' : '📲 Abrir o WhatsApp e marcar como enviado'}
                </button>

                <button onClick={() => {
                  navigator.clipboard.writeText(lead.mensagem ?? '')
                  setCopiado(true); setTimeout(() => setCopiado(false), 1600)
                }} style={btnSec}>
                  {copiado ? '✅ copiado' : '📋 copiar'}
                </button>

                <button onClick={() => { setI((x) => x + 1); setVerPlaybook(false) }}
                  disabled={i >= d.fila.length - 1} style={btnSec}>
                  ⏭ depois
                </button>

                <button onClick={() => pular(lead)} disabled={ocupado} style={{ ...btnSec, color: '#F87171' }}>
                  ✕ não serve
                </button>
              </div>

              <button onClick={() => setVerPlaybook((v) => !v)}
                style={{ ...btnSec, width: '100%', marginTop: 10, justifyContent: 'center' }}>
                {verPlaybook ? '▲ esconder' : '▼ ver o playbook (objeções, follow-up, fechamento)'}
              </button>

              {verPlaybook && lead.playbook && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Bloco titulo="Se responder com interesse" texto={lead.playbook.se_responder_curioso} />
                  <Bloco titulo="🚀 O motor de crescimento (traz cliente novo)" texto={lead.playbook.o_motor_de_crescimento} cor="#34D399" />
                  <Bloco titulo='Se disser "já tenho sistema"' texto={lead.playbook.se_disser_ja_tenho_sistema} />
                  <Bloco titulo='Se disser "não tenho tempo"' texto={lead.playbook.se_disser_nao_tenho_tempo} />
                  <Bloco titulo='Se disser "tá caro"' texto={lead.playbook.se_disser_ta_caro} />
                  <Bloco titulo='Se disser "vou ter que digitar tudo de novo?"' texto={lead.playbook.se_disser_vou_ter_que_digitar_tudo} />
                  <Bloco titulo="Se perguntar do WhatsApp (é semi-automático)" texto={lead.playbook.se_perguntar_whatsapp_automatico} />
                  <Bloco titulo="Se perguntar de nota fiscal (não temos)" texto={lead.playbook.se_perguntar_nota_fiscal} />
                  <Bloco titulo="Como fechar" texto={lead.playbook.como_fechar} cor="#10B981" />
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* ── FOLLOW-UP ─────────────────────────────────────────────── */}
      {aba === 'followup' && (
        d.followups.length === 0 ? (
          <Vazio texto="Ninguém devendo follow-up. (Entra aqui quem foi abordado há 3+ dias e não respondeu.)" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
              42% das respostas vêm no follow-up — e quase metade dos vendedores nunca manda o segundo toque.
            </p>
            {d.followups.map((f) => (
              <div key={f.id} style={{ border: '1px solid #27272A', borderRadius: 12, background: '#0F1117', padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: '#F9FAFB' }}>{f.nome}</strong>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>
                      abordado há {f.dias} dia{f.dias > 1 ? 's' : ''}, sem resposta
                    </p>
                  </div>
                  <Etiqueta cor={f.qual === 'd7' ? '#F87171' : '#F59E0B'}>
                    {f.qual === 'd7' ? 'D+7 · breakup' : 'D+3'}
                  </Etiqueta>
                </div>
                {f.mensagem && (
                  <div style={{ marginTop: 10, padding: 12, background: '#000', border: '1px solid #1F2937', borderRadius: 8 }}>
                    <p style={{ fontSize: 12, color: '#D1D5DB', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{f.mensagem}</p>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <button onClick={() => enviarFollowup(f)} disabled={ocupado || !f.link || !hoje.dentroDaJanela}
                    style={{ ...btnSec, background: '#065F46', color: '#D1FAE5', border: '1px solid #047857' }}>
                    📲 mandar o {f.qual === 'd7' ? 'breakup' : 'follow-up'}
                  </button>
                  <button onClick={async () => { if (await marcar(f.id, 'respondeu')) carregar() }}
                    disabled={ocupado} style={btnSec}>
                    ✅ ele respondeu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── RESPONDERAM ───────────────────────────────────────────── */}
      {aba === 'respondeu' && (
        d.respondidos.length === 0 ? (
          <Vazio texto="Ninguém respondeu ainda. Marque aqui quando alguém responder — é o que mede a taxa de resposta." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {d.respondidos.map((rq) => (
              <div key={rq.id} style={{ border: '1px solid #27272A', borderRadius: 12, background: '#0F1117', padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ fontSize: 14, color: '#F9FAFB' }}>{rq.nome}</strong>
                    <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>respondeu em {rq.respondeu_em}</p>
                  </div>
                  <Link href={`/abordar/${rq.id}`} style={{ fontSize: 11, color: '#60A5FA', textDecoration: 'none' }}>
                    abrir conversa →
                  </Link>
                </div>
                {rq.playbook && (
                  <details style={{ marginTop: 8 }}>
                    <summary style={{ fontSize: 11, color: '#9CA3AF', cursor: 'pointer' }}>as respostas de objeção dele</summary>
                    <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Bloco titulo='"já tenho sistema"' texto={rq.playbook.se_disser_ja_tenho_sistema} />
                      <Bloco titulo='"tá caro"' texto={rq.playbook.se_disser_ta_caro} />
                      <Bloco titulo="como fechar" texto={rq.playbook.como_fechar} cor="#10B981" />
                    </div>
                  </details>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={async () => { if (await marcar(rq.id, 'fechou')) carregar() }}
                    style={{ ...btnSec, background: '#065F46', color: '#D1FAE5', border: '1px solid #047857' }}>
                    💰 fechou
                  </button>
                  <button onClick={async () => { if (await marcar(rq.id, 'perdido')) carregar() }}
                    style={{ ...btnSec, color: '#F87171' }}>
                    ✕ perdeu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </Tela>
  )
}

/* ── peças ─────────────────────────────────────────────────────────── */

const btnSec: React.CSSProperties = {
  padding: '11px 14px', borderRadius: 10, border: '1px solid #27272A',
  background: '#18181B', color: '#D1D5DB', fontSize: 12, fontWeight: 700,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
}

function Tela({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: '100vh', background: '#09090B' }}>
      <HeaderRadarPRO />
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 16px' }}>{children}</div>
    </main>
  )
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, color: '#4B5563', margin: '0 0 6px', fontWeight: 800, letterSpacing: 0.5 }}>
      {children}
    </p>
  )
}

function Placar({ rotulo, valor, sub, cor }: { rotulo: string; valor: string; sub?: string; cor: string }) {
  return (
    <div style={{ flex: '1 1 120px', padding: '10px 14px', border: '1px solid #27272A', borderRadius: 10, background: '#0F1117' }}>
      <p style={{ fontSize: 10, color: '#6B7280', margin: 0, fontWeight: 700, letterSpacing: 0.3 }}>{rotulo}</p>
      <p style={{ fontSize: 20, color: cor, margin: '2px 0 0', fontWeight: 800 }}>
        {valor}{sub && <span style={{ fontSize: 11, color: '#4B5563', fontWeight: 600 }}> {sub}</span>}
      </p>
    </div>
  )
}

function Etiqueta({ children, cor }: { children: React.ReactNode; cor: string }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 800, color: cor, border: `1px solid ${cor}55`, background: `${cor}12`, padding: '3px 8px', borderRadius: 20 }}>
      {children}
    </span>
  )
}

function Aviso({ children, cor }: { children: React.ReactNode; cor: string }) {
  return (
    <div style={{ padding: '10px 14px', border: `1px solid ${cor}44`, background: `${cor}10`, borderRadius: 10, marginBottom: 14 }}>
      <p style={{ fontSize: 12, color: cor, margin: 0, lineHeight: 1.6 }}>{children}</p>
    </div>
  )
}

function Vazio({ texto }: { texto: string }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', border: '1px dashed #27272A', borderRadius: 12 }}>
      <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{texto}</p>
    </div>
  )
}

function Bloco({ titulo, texto, cor = '#9CA3AF' }: { titulo: string; texto?: string; cor?: string }) {
  if (!texto) return null
  return (
    <div style={{ border: `1px solid ${cor}33`, borderRadius: 10, overflow: 'hidden' }}>
      <p style={{ fontSize: 10, fontWeight: 800, color: cor, background: `${cor}12`, margin: 0, padding: '7px 12px' }}>{titulo}</p>
      <p style={{ fontSize: 12, color: '#D1D5DB', margin: 0, padding: '10px 12px', lineHeight: 1.65, whiteSpace: 'pre-wrap', background: '#000' }}>{texto}</p>
    </div>
  )
}
