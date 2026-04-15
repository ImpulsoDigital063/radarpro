/**
 * Repara categorias ruins (ex: "(16)", "Nenhuma avaliação") deduzindo do NOME do lead.
 * Regenera mensagem quando corrige a categoria.
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'
import { gerarMensagemLP, gerarMensagemShopify, gerarMensagemAgendaPRO } from '../lib/mensagens'

type Regra = { re: RegExp; categoria: string }

const REGRAS_LP: Regra[] = [
  { re: /nutric/i,                  categoria: 'Nutricionista' },
  { re: /advoca|advogad/i,          categoria: 'Advogado' },
  { re: /dentist|odonto/i,          categoria: 'Dentista' },
  { re: /arquitet|urbanist/i,       categoria: 'Arquiteto' },
  { re: /psic[oó]log|psican[aá]l/i, categoria: 'Psicólogo' },
  { re: /fisio(?:terap)?/i,         categoria: 'Fisioterapeuta' },
  { re: /fotograf|fot[oó]graf/i,    categoria: 'Fotógrafo' },
  { re: /contad|contabil/i,         categoria: 'Contador' },
  { re: /fonoaudi/i,                categoria: 'Fonoaudiólogo' },
  { re: /terapeut/i,                categoria: 'Terapeuta' },
  { re: /personal/i,                categoria: 'Personal trainer' },
]

const REGRAS_SHOPIFY: Regra[] = [
  { re: /joalh|joia|semijoia|semi joia|pratar|ourives|rel[oó]g|alian[çc]/i, categoria: 'Joalheria' },
  { re: /pet\s?shop|veterin[aá]r|agropet|ra[çc][aã]o/i, categoria: 'Pet shop' },
  { re: /papel|copiador|xerox|livraria|cartorial/i, categoria: 'Papelaria' },
  { re: /perfum|fragr[aâ]n/i,          categoria: 'Perfumaria' },
  { re: /cosm[eé]tic|maquiag|makeup|make up|make\b/i, categoria: 'Loja de cosméticos' },
  { re: /moda|roupas|boutique|fashion|vestu[aá]rio|bazar/i, categoria: 'Loja de roupas' },
  { re: /cal[çc]ad|sapat|t[eê]nis/i,   categoria: 'Loja de calçados' },
  { re: /confei|doce|boloaria|bolo\b/i, categoria: 'Confeitaria' },
  { re: /a[çc]a[ií]/i,                 categoria: 'Açaí' },
  { re: /caf[eé]/i,                    categoria: 'Café' },
]

const REGRAS_AGENDAPRO: Regra[] = [
  { re: /barber|barbear/i,              categoria: 'Barbearia' },
  { re: /sal[aã]o|cabele|hair|beleza/i, categoria: 'Salão de beleza' },
  { re: /est[eé]tica|esteticist|spa\b/i, categoria: 'Clínica estética' },
  { re: /tattoo|tatuag|piercing|ink\b/i, categoria: 'Estúdio de tatuagem' },
  { re: /manicure|nail|esmalt|unha/i,   categoria: 'Nail designer' },
  { re: /massoter|massag/i,             categoria: 'Massoterapeuta' },
  { re: /depila/i,                      categoria: 'Depilação' },
  { re: /sobranc/i,                     categoria: 'Designer de sobrancelhas' },
  { re: /c[ií]lios|lash/i,              categoria: 'Designer de cílios' },
  { re: /maquiag|makeup|make up|make\b/i, categoria: 'Maquiadora' },
  { re: /tatu/i,                        categoria: 'Estúdio de tatuagem' },
]

const DEFAULT_POR_TIPO: Record<string, string> = {
  lp: 'Profissional liberal',
  shopify: 'Comércio local',
  agendapro: 'Serviço com agenda',
}

function deduzirCategoria(nome: string, tipo: string): string {
  const regras =
    tipo === 'lp'       ? REGRAS_LP :
    tipo === 'shopify'  ? REGRAS_SHOPIFY :
    REGRAS_AGENDAPRO
  for (const r of regras) {
    if (r.re.test(nome)) return r.categoria
  }
  return DEFAULT_POR_TIPO[tipo] ?? 'Profissional'
}

function categoriaRuim(cat: string | null): boolean {
  if (!cat) return true
  const t = cat.trim()
  if (t.length < 3) return true
  if (/^\(\d+\)$/.test(t)) return true
  if (t === 'Nenhuma avaliação') return true
  if (/^\d[\d,.\s]*$/.test(t)) return true
  return false
}

async function main() {
  const db = getClient()
  const res = await db.execute(`SELECT id, nome, categoria, tipo FROM leads`)

  let corrigidos = 0
  let mensagensAtualizadas = 0

  for (const row of res.rows as any[]) {
    if (!categoriaRuim(row.categoria)) continue

    const nova = deduzirCategoria(row.nome, row.tipo)
    const primeiroNome = row.nome.split(' ')[0]
    const novaMsg =
      row.tipo === 'lp'      ? gerarMensagemLP(row.nome, nova) :
      row.tipo === 'shopify' ? gerarMensagemShopify(row.nome, nova) :
      gerarMensagemAgendaPRO(row.nome, nova)

    await db.execute({
      sql: `UPDATE leads SET
              categoria = ?,
              mensagem = ?,
              atualizado_em = datetime('now','localtime')
            WHERE id = ?`,
      args: [nova, novaMsg, row.id],
    })

    corrigidos++
    mensagensAtualizadas++
    if (corrigidos <= 10) console.log(`  #${row.id} [${row.tipo}] "${row.categoria}" → "${nova}" (${primeiroNome})`)
  }
  if (corrigidos > 10) console.log(`  ... e mais ${corrigidos - 10}`)
  console.log(`\n✅ Categorias corrigidas: ${corrigidos}`)
  console.log(`✅ Mensagens regeradas: ${mensagensAtualizadas}`)

  const stats = await db.execute(
    `SELECT categoria, COUNT(*) as n FROM leads GROUP BY categoria ORDER BY n DESC LIMIT 15`
  )
  console.log('\nTop 15 categorias após reparo:')
  for (const r of stats.rows) console.log(`  ${r.n}x "${r.categoria}"`)
}

main().catch(e => { console.error(e); process.exit(1) })
