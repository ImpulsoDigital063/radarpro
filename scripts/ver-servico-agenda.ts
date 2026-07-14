import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
import { getClient } from '../lib/db'

async function main() {
  const db = getClient()
  const r = await db.execute(`
    SELECT nome, telefone, categoria FROM leads
    WHERE categoria IN ('Serviço com agenda', 'Servico com agenda', 'Profissional liberal', 'Patrocinado', 'espaco')
    ORDER BY categoria, nome
  `)
  console.log(`\n=== ${r.rows.length} leads em categoria GENÉRICA (podem esconder beleza) ===\n`)
  for (const x of r.rows) {
    const tel = x.telefone ? '📞' : '  '
    console.log(`${tel} ${String(x.nome).padEnd(42)} [${x.categoria}]`)
  }
}
main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
