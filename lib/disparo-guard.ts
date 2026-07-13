/**
 * disparo-guard — trava de segurança do disparo de WhatsApp.
 *
 * Contexto (13/07/2026): o RadarPRO NUNCA disparou em volume. A tabela
 * mensagens_whatsapp nem existia no Turso, e 1 lead tinha disparado_em.
 * O endpoint /api/whatsapp/send mandava na hora, sem intervalo, sem
 * checar se o lead já tinha sido abordado e sem teto diário.
 *
 * Disparar em volume assim = número banido. O WhatsApp bane por padrão de
 * robô: rajada, intervalo fixo, mesmo texto, número novo mandando pra
 * desconhecido. Este módulo existe pra que o primeiro disparo real não
 * seja também o último.
 *
 * Regras:
 *   1. LIMITE DIÁRIO       — teto de mensagens por dia (default 40)
 *   2. INTERVALO ALEATÓRIO — espera entre envios, variando (default 45-90s)
 *   3. JANELA DE HORÁRIO   — só dispara em horário comercial (default 9h-19h)
 *   4. ANTI-DUPLICADO      — nunca manda 2x pro mesmo lead/telefone
 *
 * Nenhuma delas é opcional no caminho de disparo em lote.
 */

import { getClient } from './db'

export type GuardConfig = {
  limiteDiario: number
  intervaloMinMs: number
  intervaloMaxMs: number
  horaInicio: number
  horaFim: number
  diasUteisApenas: boolean
}

export const GUARD_PADRAO: GuardConfig = {
  limiteDiario: 40,
  intervaloMinMs: 45_000,
  intervaloMaxMs: 90_000,
  horaInicio: 9,
  horaFim: 19,
  diasUteisApenas: false,
}

/** Aquecimento: número novo não sai mandando 40/dia. Sobe devagar. */
export const RAMPA_AQUECIMENTO: Record<number, number> = {
  1: 10, // dia 1  — 10 mensagens
  2: 15,
  3: 20,
  4: 25,
  5: 30,
  6: 35,
  7: 40, // a partir do dia 7, teto normal
}

export type GuardVeredito =
  | { pode: true }
  | { pode: false; motivo: string; codigo: 'fora_de_horario' | 'limite_diario' | 'ja_abordado' | 'sem_telefone' }

async function garantirTabela() {
  const db = getClient()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS disparos_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id    INTEGER,
      telefone   TEXT NOT NULL,
      enviado_em TEXT DEFAULT (datetime('now','localtime'))
    )
  `)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_disparo_tel  ON disparos_log(telefone)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_disparo_data ON disparos_log(enviado_em)`)
}

/** Quantas mensagens já saíram hoje. */
export async function enviadasHoje(): Promise<number> {
  await garantirTabela()
  const db = getClient()
  const r = await db.execute(`
    SELECT COUNT(*) AS n FROM disparos_log
    WHERE date(enviado_em) = date('now','localtime')
  `)
  return Number(r.rows[0]?.n ?? 0)
}

/** Esse telefone (ou lead) já recebeu mensagem alguma vez? */
export async function jaAbordado(telefone: string, leadId?: number): Promise<boolean> {
  await garantirTabela()
  const db = getClient()
  const tel = normalizarTelefone(telefone)

  const porTel = await db.execute({
    sql: `SELECT 1 FROM disparos_log WHERE telefone = ? LIMIT 1`,
    args: [tel],
  })
  if (porTel.rows.length > 0) return true

  if (leadId) {
    const porLead = await db.execute({
      sql: `SELECT 1 FROM leads WHERE id = ? AND disparado_em IS NOT NULL LIMIT 1`,
      args: [leadId],
    })
    if (porLead.rows.length > 0) return true
  }
  return false
}

/** Registra o envio — é o que alimenta o anti-duplicado e o limite diário. */
export async function registrarDisparo(telefone: string, leadId?: number) {
  await garantirTabela()
  const db = getClient()
  await db.execute({
    sql: `INSERT INTO disparos_log (lead_id, telefone) VALUES (?, ?)`,
    args: [leadId ?? null, normalizarTelefone(telefone)],
  })
  if (leadId) {
    await db.execute({
      sql: `UPDATE leads SET disparado_em = datetime('now','localtime'), status = 'abordado' WHERE id = ?`,
      args: [leadId],
    })
  }
}

export function normalizarTelefone(t: string): string {
  const so = String(t).replace(/\D/g, '')
  return so.startsWith('55') ? so : `55${so}`
}

/** Pode disparar pra esse lead agora? */
export async function podeDisparar(
  telefone: string,
  leadId?: number,
  cfg: GuardConfig = GUARD_PADRAO,
): Promise<GuardVeredito> {
  if (!telefone || normalizarTelefone(telefone).length < 12) {
    return { pode: false, codigo: 'sem_telefone', motivo: 'Telefone ausente ou inválido' }
  }

  const agora = new Date()
  const hora = agora.getHours()
  const dia = agora.getDay()

  if (cfg.diasUteisApenas && (dia === 0 || dia === 6)) {
    return { pode: false, codigo: 'fora_de_horario', motivo: 'Fim de semana — disparo bloqueado' }
  }
  if (hora < cfg.horaInicio || hora >= cfg.horaFim) {
    return {
      pode: false,
      codigo: 'fora_de_horario',
      motivo: `Fora da janela (${cfg.horaInicio}h–${cfg.horaFim}h). Disparar de madrugada é assinatura de robô.`,
    }
  }

  const hoje = await enviadasHoje()
  if (hoje >= cfg.limiteDiario) {
    return {
      pode: false,
      codigo: 'limite_diario',
      motivo: `Limite diário atingido (${hoje}/${cfg.limiteDiario}). Continue amanhã.`,
    }
  }

  if (await jaAbordado(telefone, leadId)) {
    return { pode: false, codigo: 'ja_abordado', motivo: 'Esse lead já foi abordado — não mandar 2x.' }
  }

  return { pode: true }
}

/** Intervalo aleatório entre envios. Fixo = padrão de robô. */
export function intervaloAleatorioMs(cfg: GuardConfig = GUARD_PADRAO): number {
  const { intervaloMinMs: min, intervaloMaxMs: max } = cfg
  return Math.floor(min + Math.random() * (max - min))
}

export const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Teto do dia considerando a rampa de aquecimento do número. */
export function limiteDoDia(diaDeAquecimento: number, cfg: GuardConfig = GUARD_PADRAO): number {
  if (diaDeAquecimento >= 7) return cfg.limiteDiario
  return RAMPA_AQUECIMENTO[Math.max(1, diaDeAquecimento)] ?? 10
}
