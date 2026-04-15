'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

type StatusResp = {
  status: 'desconectado' | 'conectando' | 'aguardando_qr' | 'conectado'
  qr?: string | null
  numero?: string | null
  error?: string
}

const LABELS: Record<StatusResp['status'], string> = {
  desconectado:  'Desconectado',
  conectando:    'Conectando...',
  aguardando_qr: 'Escaneie o QR Code',
  conectado:     'Conectado',
}

const CORES: Record<StatusResp['status'], string> = {
  desconectado:  'bg-zinc-500',
  conectando:    'bg-yellow-500 animate-pulse',
  aguardando_qr: 'bg-blue-500 animate-pulse',
  conectado:     'bg-emerald-500',
}

export default function WhatsAppPage() {
  const [state, setState] = useState<StatusResp>({ status: 'desconectado' })
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const poll = useRef<ReturnType<typeof setInterval> | null>(null)

  async function fetchStatus() {
    try {
      const r = await fetch('/api/whatsapp/qr', { cache: 'no-store' })
      const data: StatusResp = await r.json()
      setState(data)
      setErro(data.error ?? null)
      if (data.qr) {
        const img = await QRCode.toDataURL(data.qr, { width: 320, margin: 1 })
        setQrImage(img)
      } else if (data.status === 'conectado') {
        setQrImage(null)
      }
    } catch (err: any) {
      setErro(err.message)
    }
  }

  async function logout() {
    if (!confirm('Desconectar o WhatsApp? A sessão será apagada e será necessário escanear o QR novamente.')) return
    await fetch('/api/whatsapp/logout', { method: 'POST' })
    setQrImage(null)
    fetchStatus()
  }

  useEffect(() => {
    fetchStatus()
    poll.current = setInterval(fetchStatus, 3000)
    return () => { if (poll.current) clearInterval(poll.current) }
  }, [])

  const conectado = state.status === 'conectado'

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-sm text-zinc-400 hover:text-zinc-100">← voltar ao painel</a>

        <h1 className="text-3xl font-bold mt-4 mb-2">Integração WhatsApp</h1>
        <p className="text-zinc-400 mb-6">
          Conecte um número dedicado (chip novo + WhatsApp Business aquecido) para disparar
          mensagens diretamente do painel.
        </p>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <span className={`h-3 w-3 rounded-full ${CORES[state.status]}`} />
            <span className="font-medium">{LABELS[state.status]}</span>
            {state.numero && (
              <span className="ml-auto text-sm text-zinc-400 font-mono">
                {state.numero}
              </span>
            )}
          </div>

          {erro && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-300">
              {erro}
            </div>
          )}

          {!conectado && qrImage && (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-lg">
                <img src={qrImage} alt="QR Code WhatsApp" width={320} height={320} />
              </div>
              <div className="text-sm text-zinc-400 text-center max-w-md">
                <p className="mb-1"><strong className="text-zinc-200">No celular:</strong></p>
                <ol className="text-left space-y-1">
                  <li>1. Abra o WhatsApp Business</li>
                  <li>2. Toque em <strong>⋮ → Aparelhos conectados</strong></li>
                  <li>3. Toque em <strong>Conectar um aparelho</strong></li>
                  <li>4. Aponte a câmera para este QR Code</li>
                </ol>
              </div>
            </div>
          )}

          {!conectado && !qrImage && state.status !== 'aguardando_qr' && (
            <div className="text-center py-8 text-zinc-400">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-700 border-t-emerald-500 mx-auto mb-4" />
              Iniciando conexão com o WhatsApp...
            </div>
          )}

          {conectado && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded">
                <p className="text-emerald-300 font-medium">✅ WhatsApp conectado</p>
                <p className="text-sm text-zinc-400 mt-1">
                  O painel agora envia mensagens diretas pelos cards dos leads.
                </p>
              </div>
              <button
                onClick={logout}
                className="w-full py-2 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm"
              >
                Desconectar e limpar sessão
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded text-sm text-amber-200/90">
          <p className="font-medium mb-2">⚠ Regras de segurança antes de disparar</p>
          <ul className="space-y-1 list-disc list-inside text-amber-200/70">
            <li>Use chip <strong>dedicado</strong> — nunca o pessoal</li>
            <li>Instale <strong>WhatsApp Business</strong> e configure foto, bio e status</li>
            <li>Aqueça o número por <strong>2-3 dias</strong> (conversas normais com 10-20 contatos)</li>
            <li>Começar devagar: <strong>20-30 abordagens/dia</strong> nos primeiros dias</li>
            <li>Intervalo de <strong>30-60s</strong> entre mensagens</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
