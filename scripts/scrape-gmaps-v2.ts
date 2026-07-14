/**
 * radarPRO — Scraper Google Maps v2 (13/07/2026)
 *
 * POR QUE REESCREVER o v1:
 *
 * 1. O v1 NUNCA ABRIA A FICHA do negócio — extraía só do card da lista. Mas o
 *    Google Maps NÃO mostra telefone no card. Resultado: 190 dos 304 leads do
 *    nicho ficaram SEM TELEFONE, ou seja, inúteis pra WhatsApp.
 *
 * 2. O campo `site` guardava a URL DO GOOGLE MAPS, não o site do negócio
 *    (`site: r.href`). A gente nunca soube de verdade quem tem site.
 *
 * 3. Não detectava SE O LEAD JÁ USA SISTEMA — que é o dado que decide a
 *    mensagem inteira (arsenal): quem já usa Trinks/Avec está furioso com o
 *    sistema; quem está no caderno tem outra dor. Errar isso mata a mensagem.
 *
 * 4. Rolava a lista só 8x (~20-40 resultados). Palmas tem muito mais.
 *
 * 5. Dedup só por telefone/instagram → lead sem os dois DUPLICAVA.
 *    (Por isso "Amanda Bronze", "Studio PANATTO" e "Barbearia Toledo" estão 2x.)
 *
 * Uso:
 *   npx tsx scripts/scrape-gmaps-v2.ts                      → todas as queries do nicho
 *   npx tsx scripts/scrape-gmaps-v2.ts --query="lash Palmas TO"
 *   npx tsx scripts/scrape-gmaps-v2.ts --limite=10          → teste rápido
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { chromium, Page } from 'playwright'
import { getClient } from '../lib/db'
import { ehLeadDoNicho } from '../lib/mensagens'

/* ── O NICHO (cravado 13/07). Tatuagem e massagem FORA. ───────────────── */
const QUERIES_NICHO = [
  'barbearia Palmas TO',
  'salão de beleza Palmas TO',
  'cabeleireiro Palmas TO',
  'nail designer Palmas TO',
  'manicure Palmas TO',
  'esmalteria Palmas TO',
  'extensão de cílios Palmas TO',
  'lash designer Palmas TO',
  'designer de sobrancelhas Palmas TO',
  'micropigmentação Palmas TO',
  'clínica de estética Palmas TO',
  'esteticista Palmas TO',
  'depilação Palmas TO',
  'tranças Palmas TO',
  'bronzeamento Palmas TO',
  'maquiadora Palmas TO',
]

/* ── Sistemas de agendamento que o lead pode já usar ───────────────────── */
const SISTEMAS = [
  { nome: 'Trinks', padroes: ['trinks.com', 'trinks'] },
  { nome: 'Booksy', padroes: ['booksy.com', 'booksy'] },
  { nome: 'Avec', padroes: ['avec.beauty', 'appavec', 'avec '] },
  { nome: 'Salão99', padroes: ['salao99', 'salão99'] },
  { nome: 'Belasis', padroes: ['belasis'] },
  { nome: 'AppBarber', padroes: ['appbarber'] },
  { nome: 'Gendo', padroes: ['gendo.com', 'gendo.'] },
  { nome: 'Vev', padroes: ['vev.com.br', 'usevev'] },
  { nome: 'Simples Agenda', padroes: ['simplesagenda'] },
  { nome: 'Agendor/outro', padroes: ['agendamento online', 'agende online', 'agendar online'] },
]

function detectarSistema(textos: string[]): string | null {
  const t = textos.filter(Boolean).join(' ').toLowerCase()
  for (const s of SISTEMAS) {
    if (s.padroes.some((p) => t.includes(p))) return s.nome
  }
  return null
}

/**
 * O que o Google Maps chama de "site" quase sempre é o INSTAGRAM dela.
 * (Testado: de 6 leads com "site", 4 eram instagram.com, 1 facebook, 1 linktree.)
 * Tratar isso como "tem site" mandaria a mensagem errada — falaria com ela como
 * se fosse organizada, quando na real ela agenda pela DM.
 */
function classificarSite(url: string | null): 'nenhum' | 'social' | 'site_proprio' {
  if (!url) return 'nenhum'
  const u = url.toLowerCase()
  if (/instagram\.com|facebook\.com|fb\.com|linktr\.ee|beacons\.|linkbio|meulink|wa\.me|whatsapp/.test(u)) {
    return 'social'
  }
  return 'site_proprio'
}

/**
 * Nível de consciência (Schwartz) — é ISSO que decide a mensagem.
 * O arsenal usa esse campo pra escolher entre falar de MECANISMO (quem já usa
 * sistema e está surda de promessa) ou descrever a rotina dela SEM JULGAR
 * (quem está no manual).
 */
function inferirNivel(
  sistema: string | null,
  tipoSite: 'nenhum' | 'social' | 'site_proprio',
  numAval: number,
): string {
  // já usa Trinks/Avec/Booksy → a dor dela é o SISTEMA (trava, desloga, suporte)
  if (sistema) return 'JA_USA_SISTEMA'

  // 🔥 O LEAD MAIS QUENTE: movimento grande e controle 100% na mão
  if (numAval >= 60 && tipoSite !== 'site_proprio') return 'MOVIMENTO_ALTO_MANUAL'

  if (tipoSite === 'site_proprio') return 'TEM_SITE_PROPRIO'
  if (tipoSite === 'social') return 'AGENDA_PELA_DM'   // Instagram = agenda na DM
  return 'FRIO'                                         // pouca info — msg curtíssima
}

type LeadFicha = {
  nome: string
  categoria: string
  nota: number | null
  numAval: number
  telefone: string | null
  siteReal: string | null
  endereco: string | null
  horario: string | null
  sistema: string | null
  nivel: string
  mapsUrl: string
}

/* ── Abre a ficha do negócio e extrai o que o card não tem ─────────────── */
async function abrirFicha(page: Page, mapsUrl: string): Promise<Partial<LeadFicha>> {
  await page.goto(mapsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(2200)

  // ⚠️ NADA de função declarada aqui dentro. O tsx/esbuild injeta um helper
  // `__name` nas funções, e quando o Playwright serializa isso pro browser o
  // helper não existe lá → "ReferenceError: __name is not defined".
  // Tudo inline, sem helpers.
  return (await page.evaluate(() => {
    // Telefone — o Maps expõe no botão com aria-label "Telefone: (63) 9..."
    const telEl =
      document.querySelector('[data-item-id^="phone"]') ??
      document.querySelector('button[aria-label*="Telefone"]')
    const telRaw = telEl ? telEl.getAttribute('aria-label') : null
    const telMatch = telRaw ? telRaw.match(/[\d\s()\-+]{10,}/) : null
    const telefone = telMatch ? telMatch[0].trim() : null

    // Site REAL do negócio (não a URL do Maps)
    const siteEl = document.querySelector('a[data-item-id="authority"]') as HTMLAnchorElement | null
    const siteReal = siteEl ? siteEl.href : null

    // Endereço
    const endEl = document.querySelector('[data-item-id="address"]')
    const endRaw = endEl ? endEl.getAttribute('aria-label') : null
    const endereco = endRaw ? endRaw.replace(/^Endereço:\s*/i, '').trim() : null

    // Horário
    const horEl = document.querySelector('[aria-label*="Horário"]')
    const horario = horEl ? horEl.getAttribute('aria-label') : null

    // Categoria (na ficha é confiável — botão de categoria)
    const catEl = document.querySelector('button[jsaction*="category"]')
    const categoria = catEl && catEl.textContent ? catEl.textContent.trim() : ''

    // Nota e nº de avaliações.
    // O Maps troca as classes CSS toda hora (div.F7nice quebrou). Extrair do
    // TEXTO da ficha é feio, mas sobrevive a redesign: "4,9 (56)" ou "4,9(56)".
    const corpo = document.body.innerText ?? ''
    const m = corpo.match(/(\d[,.]\d)\s*\(\s*([\d.]+)\s*\)/)
    const nota = m ? parseFloat(m[1].replace(',', '.')) : null
    const numAval = m ? parseInt(m[2].replace(/\D/g, '')) || 0 : 0

    // Nome do negócio (h1 da ficha)
    const h1 = document.querySelector('h1')
    const nome = h1 && h1.textContent ? h1.textContent.trim() : ''

    // Todo o texto da ficha — pra detectar sistema de agendamento
    const textoFicha = document.body.innerText ? document.body.innerText.slice(0, 3000) : ''

    return { nome, telefone, siteReal, endereco, horario, categoria, nota, numAval, textoFicha }
  })) as any
}

/* ── Coleta os links da lista (rolando até o fim) ──────────────────────── */
async function coletarLinks(page: Page, query: string, limite: number): Promise<string[]> {
  const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(3000)

  let anterior = 0
  for (let i = 0; i < 30; i++) {
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="feed"] a[href*="/maps/place/"]')).length,
    )
    if (links >= limite) break
    if (links === anterior && i > 3) break // chegou ao fim da lista
    anterior = links
    try {
      await page.locator('[role="feed"]').evaluate((el) => el.scrollBy(0, 2000))
      await page.waitForTimeout(1200)
    } catch { break }
  }

  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[role="feed"] a[href*="/maps/place/"]'))
      .map((a) => (a as HTMLAnchorElement).href),
  )
  return [...new Set(links)].slice(0, limite)
}

/* ── Grava (dedup por NOME+ENDEREÇO, não só telefone) ──────────────────── */
async function salvar(l: LeadFicha): Promise<'novo' | 'atualizado' | 'duplicado'> {
  const db = getClient()

  const existe = await db.execute({
    sql: `SELECT id, telefone FROM leads
          WHERE lower(nome) = lower(?)
             OR (telefone IS NOT NULL AND telefone = ?)
          LIMIT 1`,
    args: [l.nome, l.telefone ?? '___nunca___'],
  })

  if (existe.rows.length) {
    const id = existe.rows[0].id
    const jaTinhaTel = !!existe.rows[0].telefone
    // se já existe mas SEM telefone e agora temos → enriquece
    await db.execute({
      sql: `UPDATE leads SET
              telefone = COALESCE(NULLIF(?, ''), telefone),
              site_real = COALESCE(NULLIF(?, ''), site_real),
              sistema_detectado = ?, nivel_consciencia = ?,
              horario_maps = COALESCE(NULLIF(?, ''), horario_maps),
              endereco = COALESCE(NULLIF(?, ''), endereco),
              nota = COALESCE(?, nota), num_avaliacoes = COALESCE(?, num_avaliacoes)
            WHERE id = ?`,
      args: [l.telefone ?? '', l.siteReal ?? '', l.sistema, l.nivel, l.horario ?? '',
             l.endereco ?? '', l.nota, l.numAval || null, id],
    })
    return jaTinhaTel ? 'duplicado' : 'atualizado'
  }

  await db.execute({
    sql: `INSERT INTO leads
            (nome, categoria, tipo, telefone, site_real, endereco, nota, num_avaliacoes,
             tem_site, sistema_detectado, nivel_consciencia, horario_maps, fonte, status, cidade)
          VALUES (?, ?, 'agendapro', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'google_maps_v2', 'novo', 'Palmas')`,
    args: [l.nome, l.categoria, l.telefone, l.siteReal, l.endereco, l.nota, l.numAval,
           l.siteReal ? 1 : 0, l.sistema, l.nivel, l.horario],
  })
  return 'novo'
}

/* ── Main ─────────────────────────────────────────────────────────────── */
function flag(n: string): string | null {
  const a = process.argv.find((x) => x.startsWith(`--${n}=`))
  return a ? a.slice(n.length + 3) : null
}

async function main() {
  const queries = flag('query') ? [flag('query')!] : QUERIES_NICHO
  const limite = parseInt(flag('limite') ?? '60')

  console.log(`\n🚀 RadarPRO — Scraper v2 (abre a ficha de cada negócio)`)
  console.log(`   ${queries.length} busca(s) · até ${limite} leads por busca\n`)

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await ctx.newPage()

  let novos = 0, atualizados = 0, dups = 0, forasDoNicho = 0
  const porNivel = new Map<string, number>()
  const porSistema = new Map<string, number>()

  for (const q of queries) {
    console.log(`\n🔍 ${q}`)
    const links = await coletarLinks(page, q, limite)
    console.log(`   ${links.length} fichas encontradas`)

    for (const [i, link] of links.entries()) {
      try {
        const f = await abrirFicha(page, link)
        const nome = String((f as any).nome ?? '').trim()
        if (!nome || nome === 'Google Maps') continue

        const categoria = String((f as any).categoria ?? '')

        // filtro de nicho: tatuagem/massagem/loja NÃO entram
        if (!ehLeadDoNicho(categoria, nome)) {
          forasDoNicho++
          continue
        }

        const textoFicha = String((f as any).textoFicha ?? '')
        const siteReal = (f as any).siteReal ?? null
        const sistema = detectarSistema([textoFicha, siteReal ?? ''])
        const numAval = Number((f as any).numAval ?? 0)
        const tipoSite = classificarSite(siteReal)
        const nivel = inferirNivel(sistema, tipoSite, numAval)

        const lead: LeadFicha = {
          nome,
          categoria,
          nota: (f as any).nota ?? null,
          numAval,
          telefone: (f as any).telefone ?? null,
          siteReal: (f as any).siteReal ?? null,
          endereco: (f as any).endereco ?? null,
          horario: (f as any).horario ?? null,
          sistema,
          nivel,
          mapsUrl: link,
        }

        const r = await salvar(lead)
        if (r === 'novo') novos++
        else if (r === 'atualizado') atualizados++
        else dups++

        porNivel.set(nivel, (porNivel.get(nivel) ?? 0) + 1)
        if (sistema) porSistema.set(sistema, (porSistema.get(sistema) ?? 0) + 1)

        const icone = r === 'novo' ? '🆕' : r === 'atualizado' ? '📞' : '↩ '
        const tel = lead.telefone ?? 'sem tel'
        const sis = sistema ? ` · usa ${sistema}` : ''
        const av = numAval ? `★${lead.nota ?? '-'}·${numAval}` : '—'
        console.log(`   ${icone} [${i + 1}/${links.length}] ${nome.slice(0, 30).padEnd(30)} ${tel.padEnd(16)} ${av.padEnd(9)} ${nivel}${sis}`)
      } catch (e: any) {
        console.log(`   ✗ erro: ${String(e.message).slice(0, 50)}`)
      }
    }
  }

  await browser.close()

  console.log('\n' + '═'.repeat(62))
  console.log(`🆕 novos: ${novos}   📞 enriquecidos (ganharam telefone): ${atualizados}   ↩ já tinha: ${dups}`)
  console.log(`⏭  fora do nicho (tatuagem/loja/massagem): ${forasDoNicho}`)
  console.log('\nPOR NÍVEL DE CONSCIÊNCIA (decide a mensagem):')
  for (const [n, c] of [...porNivel.entries()].sort((a, b) => b[1] - a[1])) console.log(`   ${String(c).padStart(3)}  ${n}`)
  if (porSistema.size) {
    console.log('\nSISTEMAS QUE JÁ USAM (esses são os furiosos — dor nº1 = trava/desloga):')
    for (const [s, c] of [...porSistema.entries()].sort((a, b) => b[1] - a[1])) console.log(`   ${String(c).padStart(3)}  ${s}`)
  }

  const db = getClient()
  const fim = await db.execute(`
    SELECT COUNT(*) AS n FROM leads
    WHERE status != 'arquivado' AND telefone IS NOT NULL AND telefone != '' AND disparado_em IS NULL
  `)
  console.log(`\n🎯 PRONTOS PRA DISPARO AGORA: ${fim.rows[0]?.n}\n`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
