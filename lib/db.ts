import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DATA_DIR = path.join(process.cwd(), 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

const DB_PATH = path.join(DATA_DIR, 'radar.db')

const db = new Database(DB_PATH)

// Habilita WAL para melhor performance
db.pragma('journal_mode = WAL')

// ── Schema ────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT NOT NULL,
    categoria   TEXT,                        -- ex: "Nutricionista", "Loja de roupas"
    tipo        TEXT NOT NULL DEFAULT 'lp',  -- 'lp' | 'shopify' | 'agendapro'
    telefone    TEXT,
    instagram   TEXT,
    site        TEXT,
    endereco    TEXT,
    cidade      TEXT DEFAULT 'Palmas',
    nota        REAL,                        -- nota Google Maps
    tem_site    INTEGER DEFAULT 0,           -- 0 = não | 1 = sim (mas fraco)
    qualificado INTEGER DEFAULT 1,           -- 0 = descartado | 1 = qualificado
    fonte       TEXT,                        -- 'google_maps' | 'instagram'
    mensagem    TEXT,                        -- mensagem personalizada gerada
    status      TEXT DEFAULT 'novo',
    -- status possíveis:
    -- 'novo' | 'abordado' | 'respondeu' | 'consultoria_marcada'
    -- | 'consultoria_feita' | 'proposta_enviada' | 'fechado' | 'sem_interesse'
    observacao  TEXT,
    proximo_followup TEXT,                   -- data ISO
    criado_em   TEXT DEFAULT (datetime('now', 'localtime')),
    atualizado_em TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS buscas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    query       TEXT NOT NULL,
    tipo        TEXT NOT NULL,               -- 'lp' | 'shopify'
    fonte       TEXT NOT NULL,               -- 'google_maps' | 'instagram'
    total       INTEGER DEFAULT 0,
    novos       INTEGER DEFAULT 0,
    rodou_em    TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_tipo   ON leads(tipo);
  CREATE INDEX IF NOT EXISTS idx_leads_fonte  ON leads(fonte);
`)

// ── Helpers ───────────────────────────────────────────────────────────────────

export function inserirLead(lead: {
  nome: string
  categoria?: string
  tipo: 'lp' | 'shopify' | 'agendapro'
  telefone?: string
  instagram?: string
  site?: string
  endereco?: string
  nota?: number
  tem_site?: boolean
  fonte: string
  mensagem?: string
}) {
  // Evita duplicata pelo telefone ou instagram
  const existe = db.prepare(`
    SELECT id FROM leads WHERE telefone = ? OR instagram = ?
  `).get(lead.telefone ?? '', lead.instagram ?? '')

  if (existe) return null

  const stmt = db.prepare(`
    INSERT INTO leads (nome, categoria, tipo, telefone, instagram, site, endereco, nota, tem_site, fonte, mensagem)
    VALUES (@nome, @categoria, @tipo, @telefone, @instagram, @site, @endereco, @nota, @tem_site, @fonte, @mensagem)
  `)

  const result = stmt.run({
    nome:      lead.nome,
    categoria: lead.categoria ?? null,
    tipo:      lead.tipo,
    telefone:  lead.telefone ?? null,
    instagram: lead.instagram ?? null,
    site:      lead.site ?? null,
    endereco:  lead.endereco ?? null,
    nota:      lead.nota ?? null,
    tem_site:  lead.tem_site ? 1 : 0,
    fonte:     lead.fonte,
    mensagem:  lead.mensagem ?? null,
  })

  return result.lastInsertRowid
}

export function listarLeads(filtros?: {
  tipo?: 'lp' | 'shopify' | 'agendapro'
  status?: string
  qualificado?: boolean
}) {
  let query = 'SELECT * FROM leads WHERE 1=1'
  const params: Record<string, unknown> = {}

  if (filtros?.tipo) {
    query += ' AND tipo = @tipo'
    params.tipo = filtros.tipo
  }
  if (filtros?.status) {
    query += ' AND status = @status'
    params.status = filtros.status
  }
  if (filtros?.qualificado !== undefined) {
    query += ' AND qualificado = @qualificado'
    params.qualificado = filtros.qualificado ? 1 : 0
  }

  query += ' ORDER BY criado_em DESC'
  return db.prepare(query).all(params)
}

export function atualizarStatus(id: number, status: string, observacao?: string) {
  db.prepare(`
    UPDATE leads SET status = ?, observacao = ?, atualizado_em = datetime('now', 'localtime')
    WHERE id = ?
  `).run(status, observacao ?? null, id)
}

export function atualizarMensagem(id: number, mensagem: string) {
  db.prepare(`UPDATE leads SET mensagem = ? WHERE id = ?`).run(mensagem, id)
}

export function registrarBusca(busca: {
  query: string
  tipo: string
  fonte: string
  total: number
  novos: number
}) {
  db.prepare(`
    INSERT INTO buscas (query, tipo, fonte, total, novos)
    VALUES (@query, @tipo, @fonte, @total, @novos)
  `).run(busca)
}

export function estatisticas() {
  return {
    total:              (db.prepare(`SELECT COUNT(*) as n FROM leads`).get() as any).n,
    lp:                 (db.prepare(`SELECT COUNT(*) as n FROM leads WHERE tipo='lp'`).get() as any).n,
    shopify:            (db.prepare(`SELECT COUNT(*) as n FROM leads WHERE tipo='shopify'`).get() as any).n,
    agendapro:          (db.prepare(`SELECT COUNT(*) as n FROM leads WHERE tipo='agendapro'`).get() as any).n,
    novos:              (db.prepare(`SELECT COUNT(*) as n FROM leads WHERE status='novo'`).get() as any).n,
    abordados:          (db.prepare(`SELECT COUNT(*) as n FROM leads WHERE status='abordado'`).get() as any).n,
    consultorias:       (db.prepare(`SELECT COUNT(*) as n FROM leads WHERE status='consultoria_marcada'`).get() as any).n,
    fechados:           (db.prepare(`SELECT COUNT(*) as n FROM leads WHERE status='fechado'`).get() as any).n,
  }
}

export default db
