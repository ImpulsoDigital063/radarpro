'use client'

import { useEffect, useState } from 'react'

type Licao = {
  id:           number
  lead_id:      number | null
  tipo_oferta:  string | null
  fase:         string | null
  titulo:       string
  observacao:   string
  evidencia:    string | null
  proposta:     string | null
  tipo:         string | null
  resultado:    string | null
  status:       string
  criado_em:    string
}

const FASE_COR: Record<string, string> = {
  abertura:         'bg-blue-500/20 text-blue-300',
  diagnostico:      'bg-purple-500/20 text-purple-300',
  pitch:            'bg-emerald-500/20 text-emerald-300',
  objecao:          'bg-rose-500/20 text-rose-300',
  fechamento:       'bg-amber-500/20 text-amber-300',
  call_alinhamento: 'bg-cyan-500/20 text-cyan-300',
  geral:            'bg-zinc-500/20 text-zinc-300',
}

const TIPO_BADGE: Record<string, string> = {
  aprendizado:        '📘 Aprendizado',
  objecao_nova:       '🛡️ Objeção nova',
  voice_match:        '🎤 Voz/tom',
  few_shot_candidato: '⭐ Exemplo few-shot',
}

export default function LicoesPage() {
  const [licoes, setLicoes]   = useState<Licao[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro]   = useState<'pendente' | 'aprovada' | 'rejeitada' | 'todas'>('pendente')
  const [decidindo, setDecidindo] = useState<number | null>(null)

  async function carregar() {
    setLoading(true)
    try {
      const r = await fetch(`/api/licoes?status=${filtro}`)
      const data = await r.json()
      setLicoes(data.licoes ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [filtro])

  async function decidir(id: number, decisao: 'aprovada' | 'rejeitada') {
    setDecidindo(id)
    try {
      await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decidir_licao', licaoId: id, decisao }),
      })
      await carregar()
    } finally {
      setDecidindo(null)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Lições da máquina</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Cada conversa terminada vira lição candidata. Você aprova → vira regra do agente. Rejeita → some.
          </p>
        </header>

        <div className="flex gap-2 mb-4 text-sm">
          {(['pendente', 'aprovada', 'rejeitada', 'todas'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg border transition ${
                filtro === f
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {f}
            </button>
          ))}
          <a
            href="/"
            className="ml-auto px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
          >
            ← Voltar ao painel
          </a>
        </div>

        {loading && <p className="text-zinc-500">Carregando...</p>}
        {!loading && licoes.length === 0 && (
          <p className="text-zinc-500 italic">
            {filtro === 'pendente'
              ? 'Nenhuma lição pendente. Mande mais leads pra gerar dado.'
              : `Nenhuma lição ${filtro}.`}
          </p>
        )}

        <div className="space-y-3">
          {licoes.map(l => (
            <article
              key={l.id}
              className="border border-zinc-800 rounded-xl bg-zinc-900/40 p-4 space-y-3"
            >
              <div className="flex flex-wrap items-start gap-2">
                {l.fase && (
                  <span className={`text-xs px-2 py-0.5 rounded ${FASE_COR[l.fase] ?? FASE_COR.geral}`}>
                    {l.fase}
                  </span>
                )}
                {l.tipo && (
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {TIPO_BADGE[l.tipo] ?? l.tipo}
                  </span>
                )}
                {l.tipo_oferta && (
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {l.tipo_oferta}
                  </span>
                )}
                {l.resultado && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      l.resultado === 'ganho'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : l.resultado === 'perdido'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    resultado: {l.resultado}
                  </span>
                )}
                <span className="ml-auto text-xs text-zinc-600">{l.criado_em}</span>
              </div>

              <h3 className="font-semibold text-zinc-100">{l.titulo}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{l.observacao}</p>

              {l.evidencia && (
                <div className="border-l-2 border-zinc-700 pl-3 text-sm text-zinc-400 italic">
                  &ldquo;{l.evidencia}&rdquo;
                </div>
              )}

              {l.proposta && (
                <div className="text-sm">
                  <span className="text-zinc-500 text-xs uppercase tracking-wide">Proposta:</span>
                  <p className="text-zinc-200 mt-1">{l.proposta}</p>
                </div>
              )}

              {l.status === 'pendente' && (
                <div className="flex gap-2 pt-2 border-t border-zinc-800">
                  <button
                    disabled={decidindo === l.id}
                    onClick={() => decidir(l.id, 'aprovada')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium disabled:opacity-50 transition"
                  >
                    ✅ Aprovar
                  </button>
                  <button
                    disabled={decidindo === l.id}
                    onClick={() => decidir(l.id, 'rejeitada')}
                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-rose-600 text-zinc-300 hover:text-white text-sm font-medium disabled:opacity-50 transition"
                  >
                    ❌ Rejeitar
                  </button>
                  {l.lead_id && (
                    <a
                      href={`/abordar/${l.lead_id}`}
                      className="ml-auto text-sm text-zinc-500 hover:text-zinc-300 self-center"
                    >
                      ver lead #{l.lead_id} →
                    </a>
                  )}
                </div>
              )}

              {l.status !== 'pendente' && (
                <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                  Status: <span className="text-zinc-300">{l.status}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
