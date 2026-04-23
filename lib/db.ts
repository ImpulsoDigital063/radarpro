import { createClient, type Client } from '@libsql/client'

// ── Conexão ───────────────────────────────────────────────────────────────────

let _client: Client | null = null

export function getClient(): Client {
  if (!_client) {
    const url = process.env.TURSO_URL?.replace(/\s/g, '')
    const authToken = process.env.TURSO_TOKEN?.replace(/\s/g, '')
    if (!url) throw new Error('TURSO_URL não configurada no .env.local')
    _client = createClient({ url, authToken })
  }
  return _client
}

// ── Schema ────────────────────────────────────────────────────────────────────

export async function initDb() {
  const db = getClient()
  await db.batch([
    `CREATE TABLE IF NOT EXISTS leads (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      nome             TEXT NOT NULL,
      categoria        TEXT,
      tipo             TEXT NOT NULL DEFAULT 'lp',
      telefone         TEXT,
      instagram        TEXT,
      instagram_url    TEXT,
      instagram_bio    TEXT,
      instagram_seguidores TEXT,
      site             TEXT,
      endereco         TEXT,
      cidade           TEXT DEFAULT 'Palmas',
      nota             REAL,
      num_avaliacoes   INTEGER DEFAULT 0,
      tem_site         INTEGER DEFAULT 0,
      tem_ecommerce    INTEGER DEFAULT 0,
      tem_agendamento  INTEGER DEFAULT 0,
      qualificado      INTEGER DEFAULT 1,
      fonte            TEXT,
      mensagem         TEXT,
      score            INTEGER DEFAULT 0,
      status           TEXT DEFAULT 'novo',
      notas            TEXT,
      proximo_followup TEXT,
      criado_em        TEXT DEFAULT (datetime('now', 'localtime')),
      atualizado_em    TEXT DEFAULT (datetime('now', 'localtime'))
    )`,
    `CREATE TABLE IF NOT EXISTS buscas (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      query     TEXT NOT NULL,
      tipo      TEXT NOT NULL,
      fonte     TEXT NOT NULL,
      total     INTEGER DEFAULT 0,
      novos     INTEGER DEFAULT 0,
      rodou_em  TEXT DEFAULT (datetime('now', 'localtime'))
    )`,
    `CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`,
    `CREATE INDEX IF NOT EXISTS idx_leads_tipo   ON leads(tipo)`,
    `CREATE INDEX IF NOT EXISTS idx_leads_fonte  ON leads(fonte)`,
  ], 'write')

  // Migration idempotente — colunas novas (script playbook + termômetro + arsenal pré-carregado)
  for (const col of [
    `ALTER TABLE leads ADD COLUMN script_json TEXT`,
    `ALTER TABLE leads ADD COLUMN script_gerado_em TEXT`,
    `ALTER TABLE leads ADD COLUMN termometro TEXT`,              // 'quente' | 'morno' | 'frio'
    `ALTER TABLE leads ADD COLUMN termometro_acao TEXT`,
    `ALTER TABLE leads ADD COLUMN termometro_atualizado_em TEXT`,
    `ALTER TABLE leads ADD COLUMN tipo_oferta TEXT`,             // 'lp-solo' | 'shopify-solo' | 'agendapro-solo' | 'combo'
    `ALTER TABLE leads ADD COLUMN variante_diagnostico TEXT`,    // 'A' | 'B' | 'C' (rotação por hash do telefone)
    `ALTER TABLE leads ADD COLUMN disparado_em TEXT`,            // timestamp do primeiro envio via arsenal
    `ALTER TABLE leads ADD COLUMN respondeu_em TEXT`,            // timestamp da primeira resposta
    `ALTER TABLE leads ADD COLUMN tempo_resposta_horas REAL`,    // derivado: respondeu_em - disparado_em
    `ALTER TABLE leads ADD COLUMN fase_travou TEXT`,             // onde a conversa morreu
    `ALTER TABLE leads ADD COLUMN objecao_tipo TEXT`,            // categoria de objeção
    `ALTER TABLE leads ADD COLUMN converteu_call INTEGER DEFAULT 0`,  // aceitou os 3 horários?
    `ALTER TABLE leads ADD COLUMN fechou INTEGER DEFAULT 0`,
    `ALTER TABLE leads ADD COLUMN motivo_perdido TEXT`,
  ]) {
    try { await db.execute(col) } catch { /* coluna já existe */ }
  }

  // Tabela de lições aprendidas — alimenta a máquina conforme conversas acontecem
  await db.execute(`
    CREATE TABLE IF NOT EXISTS licoes (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id      INTEGER,
      tipo_oferta  TEXT,                              -- 'lp-solo' | 'shopify-solo' | etc
      fase         TEXT,                              -- 'abertura' | 'diagnostico' | 'pitch' | 'objecao' | 'fechamento' | 'call_alinhamento'
      titulo       TEXT NOT NULL,                     -- resumo curto da lição
      observacao   TEXT NOT NULL,                     -- explicação completa
      evidencia    TEXT,                              -- trecho da conversa que provou
      proposta     TEXT,                              -- mudança sugerida (copy nova, regra nova, exemplo a anexar)
      tipo         TEXT DEFAULT 'aprendizado',        -- 'aprendizado' | 'objecao_nova' | 'voice_match' | 'few_shot_candidato'
      resultado    TEXT,                              -- 'ganho' | 'perdido' | 'neutro' (resultado da conversa que gerou)
      status       TEXT DEFAULT 'pendente',           -- 'pendente' | 'aprovada' | 'rejeitada' | 'aplicada'
      criado_em    TEXT DEFAULT (datetime('now','localtime')),
      decidida_em  TEXT,
      decidida_por TEXT                               -- 'eduardo' | 'auto' (futuro: aprovação automática se score alto)
    )
  `)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_licoes_status ON licoes(status)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_licoes_lead   ON licoes(lead_id)`)
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_licoes_oferta ON licoes(tipo_oferta)`)
}

// Garante schema criado uma vez por processo
let _ready: Promise<void> | null = null
async function ready() {
  if (!_ready) _ready = initDb()
  await _ready
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export async function inserirLead(lead: {
  nome: string
  categoria?: string
  tipo: 'lp' | 'shopify' | 'agendapro'
  telefone?: string
  instagram?: string
  instagram_url?: string
  instagram_bio?: string
  instagram_seguidores?: string
  site?: string
  endereco?: string
  nota?: number
  num_avaliacoes?: number
  tem_site?: boolean
  tem_ecommerce?: boolean
  tem_agendamento?: boolean
  fonte: string
  mensagem?: string
  score?: number
}): Promise<bigint | null> {
  await ready()
  const db = getClient()

  const existe = await db.execute({
    sql: `SELECT id FROM leads WHERE (telefone = ? AND telefone IS NOT NULL AND telefone != '')
          OR (instagram = ? AND instagram IS NOT NULL AND instagram != '')`,
    args: [lead.telefone ?? '', lead.instagram ?? ''],
  })
  if (existe.rows.length > 0) return null

  const result = await db.execute({
    sql: `INSERT INTO leads (
      nome, categoria, tipo, telefone,
      instagram, instagram_url, instagram_bio, instagram_seguidores,
      site, endereco, nota, num_avaliacoes,
      tem_site, tem_ecommerce, tem_agendamento,
      fonte, mensagem, score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      lead.nome,
      lead.categoria ?? null,
      lead.tipo,
      lead.telefone ?? null,
      lead.instagram ?? null,
      lead.instagram_url ?? null,
      lead.instagram_bio ?? null,
      lead.instagram_seguidores ?? null,
      lead.site ?? null,
      lead.endereco ?? null,
      lead.nota ?? null,
      lead.num_avaliacoes ?? 0,
      lead.tem_site ? 1 : 0,
      lead.tem_ecommerce ? 1 : 0,
      lead.tem_agendamento ? 1 : 0,
      lead.fonte,
      lead.mensagem ?? null,
      lead.score ?? 0,
    ],
  })

  return result.lastInsertRowid ?? null
}

export async function listarLeads(filtros?: {
  tipo?: string
  status?: string
}): Promise<any[]> {
  await ready()
  const db = getClient()
  let sql = 'SELECT * FROM leads WHERE 1=1'
  const args: any[] = []

  if (filtros?.tipo)   { sql += ' AND tipo = ?';   args.push(filtros.tipo) }
  if (filtros?.status) { sql += ' AND status = ?'; args.push(filtros.status) }
  sql += ' ORDER BY criado_em DESC'

  const result = await db.execute({ sql, args })
  return result.rows as any[]
}

export async function atualizarStatus(id: number, status: string, observacao?: string) {
  await ready()
  const db = getClient()
  await db.execute({
    sql: `UPDATE leads SET status = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
    args: [status, id],
  })
}

export async function atualizarMensagem(id: number, mensagem: string) {
  await ready()
  const db = getClient()
  await db.execute({
    sql: `UPDATE leads SET mensagem = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
    args: [mensagem, id],
  })
}

export async function atualizarNotas(id: number, notas: string) {
  await ready()
  const db = getClient()
  await db.execute({
    sql: `UPDATE leads SET notas = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
    args: [notas, id],
  })
}

export async function atualizarFollowup(id: number, data: string) {
  await ready()
  const db = getClient()
  await db.execute({
    sql: `UPDATE leads SET proximo_followup = ?, atualizado_em = datetime('now','localtime') WHERE id = ?`,
    args: [data, id],
  })
}

export async function registrarBusca(busca: {
  query: string; tipo: string; fonte: string; total: number; novos: number
}) {
  await ready()
  const db = getClient()
  await db.execute({
    sql: `INSERT INTO buscas (query, tipo, fonte, total, novos) VALUES (?, ?, ?, ?, ?)`,
    args: [busca.query, busca.tipo, busca.fonte, busca.total, busca.novos],
  })
}

export async function estatisticas() {
  await ready()
  const db = getClient()
  const r = await db.batch([
    `SELECT COUNT(*) as n FROM leads`,
    `SELECT COUNT(*) as n FROM leads WHERE tipo='lp'`,
    `SELECT COUNT(*) as n FROM leads WHERE tipo='shopify'`,
    `SELECT COUNT(*) as n FROM leads WHERE tipo='agendapro'`,
    `SELECT COUNT(*) as n FROM leads WHERE status='novo'`,
    `SELECT COUNT(*) as n FROM leads WHERE status='abordado'`,
    `SELECT COUNT(*) as n FROM leads WHERE status='consultoria_marcada'`,
    `SELECT COUNT(*) as n FROM leads WHERE status='fechado'`,
  ], 'read')

  return {
    total:        Number(r[0].rows[0].n),
    lp:           Number(r[1].rows[0].n),
    shopify:      Number(r[2].rows[0].n),
    agendapro:    Number(r[3].rows[0].n),
    novos:        Number(r[4].rows[0].n),
    abordados:    Number(r[5].rows[0].n),
    consultorias: Number(r[6].rows[0].n),
    fechados:     Number(r[7].rows[0].n),
  }
}

export default getClient
