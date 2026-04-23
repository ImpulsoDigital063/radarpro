'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Lead = {
  id:                    number
  nome:                  string
  categoria:             string | null
  telefone:              string | null
  instagram:             string | null
  nota:                  number | null
  num_avaliacoes:        number | null
  tipo_oferta:           string | null
  variante_diagnostico:  string | null
  disparado_em:          string | null
  status:                string
}

type Sequencia = {
  msg1_abertura:         string
  msg2_diagnostico:      string
  msg3a_pitch_so_ig:     string
  msg3b_pitch_tem_site:  string
  msg4_fechamento:       string
  arma_call_alinhamento: string | null
}

type ArsenalResponse = {
  tipo_oferta: string
  variante:    'A' | 'B' | 'C'
  sequencia:   Sequencia
}

const FASE_LABEL: Record<keyof Sequencia, string> = {
  msg1_abertura:         'Msg 1 — Abertura',
  msg2_diagnostico:      'Msg 2 — Diagnóstico',
  msg3a_pitch_so_ig:     'Msg 3A — Pitch (se "só Instagram")',
  msg3b_pitch_tem_site:  'Msg 3B — Pitch (se "tenho site")',
  msg4_fechamento:       'Msg 4 — Fechamento (3 horários)',
  arma_call_alinhamento: '🎯 Arma — Call de alinhamento (objeção de unicidade)',
}

const OFERTA_COR: Record<string, string> = {
  'lp-solo':        'bg-blue-500/20 text-blue-300 border-blue-500/40',
  'shopify-solo':   'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'agendapro-solo': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'combo':          'bg-amber-500/20 text-amber-300 border-amber-500/40',
}

export default function AbordarPage() {
  const params = useParams<{ id: string }>()
  const leadId = Number(params.id)

  const [lead, setLead]         = useState<Lead | null>(null)
  const [arsenal, setArsenal]   = useState<ArsenalResponse | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [gerando, setGerando]   = useState(false)
  const [enviando, setEnviando] = useState<string | null>(null)
  const [waStatus, setWaStatus] = useState<string>('')
  const [erro, setErro]         = useState<string>('')

  async function carregarLead() {
    setCarregando(true)
    try {
      const r = await fetch(`/api/leads?id=${leadId}`)
      const data = await r.json()
      const l = Array.isArray(data) ? data[0] : data.lead ?? data
      setLead(l)
    } finally {
      setCarregando(false)
    }
  }

  async function gerarArsenal() {
    setErro('')
    setGerando(true)
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'gerar_abordagem_arsenal', leadId }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error ?? 'falha ao gerar')
      setArsenal(data)
      await carregarLead()
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setGerando(false)
    }
  }

  async function checarWhatsApp() {
    try {
      const r = await fetch('/api/whatsapp/qr')
      const data = await r.json()
      setWaStatus(data.status ?? 'desconhecido')
    } catch { setWaStatus('erro') }
  }

  async function enviarMensagem(chave: keyof Sequencia, texto: string | null) {
    if (!texto || !lead?.telefone) {
      setErro('lead sem telefone ou mensagem vazia')
      return
    }
    setErro('')
    setEnviando(chave)
    try {
      const r = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefone: lead.telefone, mensagem: texto }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error ?? 'falha ao enviar')

      // Marca primeiro disparo
      if (chave === 'msg1_abertura') {
        await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'marcar_disparo', leadId }),
        })
        await carregarLead()
      }
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setEnviando(null)
    }
  }

  useEffect(() => {
    carregarLead()
    checarWhatsApp()
  }, [leadId])

  if (carregando) {
    return <main className="min-h-screen bg-zinc-950 text-zinc-400 p-6">Carregando lead...</main>
  }
  if (!lead) {
    return <main className="min-h-screen bg-zinc-950 text-rose-400 p-6">Lead {leadId} não encontrado.</main>
  }

  const linkWa = lead.telefone
    ? `https://wa.me/${lead.telefone.replace(/\D/g, '')}`
    : null

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-300">← painel</a>
          <h1 className="text-2xl font-bold">{lead.nome}</h1>
          <div className="flex flex-wrap gap-2 text-sm">
            {lead.categoria && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">{lead.categoria}</span>
            )}
            {lead.nota && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-300">
                ⭐ {lead.nota} ({lead.num_avaliacoes ?? 0} aval)
              </span>
            )}
            {lead.telefone && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">📱 {lead.telefone}</span>
            )}
            {lead.instagram && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-pink-300">@{lead.instagram}</span>
            )}
            <span className={`px-2 py-0.5 rounded ml-auto text-xs ${
              waStatus === 'conectado' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              WhatsApp: {waStatus || '...'}
            </span>
          </div>
          {lead.tipo_oferta && (
            <div className="flex gap-2 text-xs pt-1">
              <span className={`px-2 py-1 rounded border ${OFERTA_COR[lead.tipo_oferta] ?? 'bg-zinc-800 border-zinc-700'}`}>
                Oferta: {lead.tipo_oferta}
              </span>
              {lead.variante_diagnostico && (
                <span className="px-2 py-1 rounded border border-zinc-700 bg-zinc-800 text-zinc-300">
                  Variante: {lead.variante_diagnostico}
                </span>
              )}
              {lead.disparado_em && (
                <span className="px-2 py-1 rounded border border-zinc-700 bg-zinc-800 text-zinc-400">
                  Disparado: {lead.disparado_em}
                </span>
              )}
            </div>
          )}
        </header>

        {!arsenal && (
          <section className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40">
            <p className="text-zinc-300 mb-4">
              Arsenal pré-carregado: o sistema detecta a categoria, escolhe oferta + variante de diagnóstico
              determinística (mesmo lead → mesma variante sempre, pra medir conversão real).
            </p>
            <button
              onClick={gerarArsenal}
              disabled={gerando}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition"
            >
              {gerando ? 'Gerando...' : '⚡ Gerar arsenal'}
            </button>
          </section>
        )}

        {erro && (
          <div className="border border-rose-700 bg-rose-950/40 rounded-lg p-3 text-rose-300 text-sm">
            {erro}
          </div>
        )}

        {arsenal && (
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-3 py-1 rounded border ${OFERTA_COR[arsenal.tipo_oferta] ?? 'bg-zinc-800'}`}>
                {arsenal.tipo_oferta}
              </span>
              <span className="px-3 py-1 rounded bg-zinc-800 text-zinc-300">
                Variante {arsenal.variante}
              </span>
              <button
                onClick={gerarArsenal}
                disabled={gerando}
                className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 underline"
              >
                regerar
              </button>
            </div>

            {(Object.entries(arsenal.sequencia) as [keyof Sequencia, string | null][])
              .filter(([, texto]) => !!texto)
              .map(([chave, texto]) => (
                <article
                  key={chave}
                  className="border border-zinc-800 rounded-xl bg-zinc-900/40 overflow-hidden"
                >
                  <header className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-zinc-300">{FASE_LABEL[chave]}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(texto ?? '')}
                        className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                      >
                        Copiar
                      </button>
                      {linkWa && (
                        <a
                          href={`${linkWa}?text=${encodeURIComponent(texto ?? '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        >
                          wa.me
                        </a>
                      )}
                      <button
                        onClick={() => enviarMensagem(chave, texto)}
                        disabled={enviando === chave || waStatus !== 'conectado' || !lead.telefone}
                        className="text-xs px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                        title={
                          waStatus !== 'conectado'
                            ? 'Conecte o WhatsApp em /integracao/whatsapp'
                            : !lead.telefone ? 'Lead sem telefone' : 'Disparar via Baileys'
                        }
                      >
                        {enviando === chave ? 'Enviando...' : 'Enviar via WA'}
                      </button>
                    </div>
                  </header>
                  <pre className="px-4 py-3 text-sm text-zinc-200 whitespace-pre-wrap font-sans">
                    {texto}
                  </pre>
                </article>
              ))}

            <footer className="pt-4 border-t border-zinc-800 flex gap-3 text-sm">
              <a
                href={`/licoes`}
                className="text-zinc-400 hover:text-zinc-200"
              >
                Ver lições aprendidas →
              </a>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500">
                Quando esta conversa fechar (ganho/perdido), volte e rode <code className="text-zinc-300">analisar_conversa</code> pra alimentar a máquina.
              </span>
            </footer>
          </section>
        )}
      </div>
    </main>
  )
}
