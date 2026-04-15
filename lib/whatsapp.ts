/**
 * WhatsApp via Baileys — conexão única por processo, sobrevive ao HMR do Next.
 *
 * Decisões:
 *  - Singleton em globalThis._wa para não perder conexão em recompile.
 *  - Sessão persistente em .wa-session/ via useMultiFileAuthState.
 *  - QR emitido apenas uma vez (printQRInTerminal:false) — lemos via event `connection.update`
 *    e expomos em `state.qr` para a API GET /api/whatsapp/qr servir ao painel.
 *  - Reconecta automaticamente se não foi logout explícito.
 *  - Não roda em Vercel serverless (WebSocket persistente). Para produção: Railway/VPS ou Evolution API.
 */

import {
  default as makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  type WASocket,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import { resolve } from 'node:path'
import { mkdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { getClient } from './db'

type Status = 'desconectado' | 'conectando' | 'aguardando_qr' | 'conectado'

type WAState = {
  sock:       WASocket | null
  status:     Status
  qr:         string | null   // QR atual (raw string — frontend gera imagem)
  numero:     string | null   // jid conectado (ex: 556299...@s.whatsapp.net)
  ultimaAtualizacao: number
  iniciando:  boolean
}

declare global {
  // eslint-disable-next-line no-var
  var _wa: WAState | undefined
}

const SESSION_DIR = resolve(process.cwd(), '.wa-session')
const MSG_TABLE_READY = { done: false }

function getState(): WAState {
  if (!globalThis._wa) {
    globalThis._wa = {
      sock: null,
      status: 'desconectado',
      qr: null,
      numero: null,
      ultimaAtualizacao: Date.now(),
      iniciando: false,
    }
  }
  return globalThis._wa
}

async function garantirTabelaMensagens() {
  if (MSG_TABLE_READY.done) return
  const db = getClient()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS mensagens_whatsapp (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id    INTEGER,
      telefone   TEXT NOT NULL,
      direcao    TEXT NOT NULL,    -- 'in' | 'out'
      texto      TEXT,
      timestamp  TEXT DEFAULT (datetime('now','localtime'))
    )
  `)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_msg_wa_lead ON mensagens_whatsapp(lead_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_msg_wa_tel  ON mensagens_whatsapp(telefone)`)
  MSG_TABLE_READY.done = true
}

function jidParaTelefone(jid: string): string {
  // ex: 556299999999@s.whatsapp.net → 556299999999
  return jid.split('@')[0].split(':')[0]
}

function telefoneParaJid(telefone: string): string {
  // aceita "62999999999", "+55 62 99999-9999", "5562999999999"
  let limpo = telefone.replace(/\D/g, '')
  if (limpo.length === 11) limpo = '55' + limpo       // DDD + 9 sem país
  if (limpo.length === 10) limpo = '55' + limpo       // DDD + 8 (fixo) sem país
  return `${limpo}@s.whatsapp.net`
}

async function registrarMensagem(args: {
  telefone: string
  direcao: 'in' | 'out'
  texto: string
}) {
  try {
    await garantirTabelaMensagens()
    const db = getClient()
    // vincula ao lead se existir (match por telefone parcial — últimos 8+ dígitos)
    const tail = args.telefone.slice(-8)
    const leadMatch = await db.execute({
      sql: `SELECT id FROM leads WHERE telefone LIKE ? LIMIT 1`,
      args: [`%${tail}%`],
    })
    const leadId = leadMatch.rows[0]?.id ?? null

    await db.execute({
      sql: `INSERT INTO mensagens_whatsapp (lead_id, telefone, direcao, texto) VALUES (?, ?, ?, ?)`,
      args: [leadId as any, args.telefone, args.direcao, args.texto],
    })

    // Mensagem recebida de um lead conhecido: atualiza status para "abordado" se ainda é "novo"
    if (args.direcao === 'in' && leadId) {
      await db.execute({
        sql: `UPDATE leads SET status = 'respondeu', atualizado_em = datetime('now','localtime')
              WHERE id = ? AND status IN ('novo','abordado')`,
        args: [leadId as any],
      })
    }
  } catch (err) {
    console.error('[wa] erro ao registrar mensagem:', err)
  }
}

async function iniciarSocket() {
  const state = getState()
  if (state.iniciando || state.status === 'conectado') return
  state.iniciando = true

  try {
    if (!existsSync(SESSION_DIR)) await mkdir(SESSION_DIR, { recursive: true })
    const { state: authState, saveCreds } = await useMultiFileAuthState(SESSION_DIR)

    const sock = makeWASocket({
      auth: authState,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }) as any,
      browser: ['RadarPRO', 'Chrome', '1.0.0'],
      syncFullHistory: false,
      markOnlineOnConnect: false,
    })

    state.sock = sock
    state.status = 'conectando'

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        state.qr = qr
        state.status = 'aguardando_qr'
        state.ultimaAtualizacao = Date.now()
      }

      if (connection === 'open') {
        state.status = 'conectado'
        state.qr = null
        state.numero = sock.user?.id ? jidParaTelefone(sock.user.id) : null
        state.ultimaAtualizacao = Date.now()
        console.log(`[wa] conectado como ${state.numero}`)
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode
        const deslogado = statusCode === DisconnectReason.loggedOut
        state.sock = null
        state.status = 'desconectado'
        state.qr = null
        state.numero = null
        state.ultimaAtualizacao = Date.now()

        if (!deslogado) {
          console.log('[wa] conexão caiu, reconectando em 3s...')
          setTimeout(() => iniciarSocket().catch(console.error), 3000)
        } else {
          console.log('[wa] logout detectado — sessão limpa')
        }
      }
    })

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue
        const jid = msg.key.remoteJid
        if (!jid || jid.endsWith('@g.us')) continue   // ignora grupos
        const texto =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.imageMessage?.caption ||
          ''
        if (!texto) continue
        await registrarMensagem({
          telefone: jidParaTelefone(jid),
          direcao: 'in',
          texto,
        })
      }
    })
  } finally {
    state.iniciando = false
  }
}

// ── API pública ───────────────────────────────────────────────────────────────

export async function conectar() {
  const state = getState()
  if (state.status === 'conectado') return { status: state.status, numero: state.numero }
  await iniciarSocket()
  return { status: state.status, numero: state.numero }
}

export function statusAtual() {
  const s = getState()
  return {
    status: s.status,
    numero: s.numero,
    qr: s.qr,
    ultimaAtualizacao: s.ultimaAtualizacao,
  }
}

export async function enviarMensagem(telefone: string, texto: string) {
  const state = getState()
  if (state.status !== 'conectado' || !state.sock) {
    throw new Error('WhatsApp desconectado — escaneie o QR em /integracao/whatsapp')
  }
  const jid = telefoneParaJid(telefone)

  // Valida que o número existe no WhatsApp (evita envio pra número inválido)
  const result = await state.sock.onWhatsApp(jid)
  const check = result?.[0]
  if (!check?.exists) {
    throw new Error(`Número ${telefone} não está no WhatsApp`)
  }

  await state.sock.sendMessage(check.jid, { text: texto })
  await registrarMensagem({
    telefone: jidParaTelefone(check.jid),
    direcao: 'out',
    texto,
  })
  return { enviado: true, jid: check.jid }
}

export async function desconectar() {
  const state = getState()
  if (state.sock) {
    try { await state.sock.logout() } catch { /* ignora */ }
    state.sock = null
  }
  state.status = 'desconectado'
  state.qr = null
  state.numero = null
  // Limpa sessão persistida pra forçar novo QR
  try { await rm(SESSION_DIR, { recursive: true, force: true }) } catch { /* ignora */ }
  return { desconectado: true }
}
