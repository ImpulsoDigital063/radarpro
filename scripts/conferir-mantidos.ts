import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
import { getClient } from '../lib/db'
import { ehLeadDoNicho } from '../lib/mensagens'

async function main() {
  const db = getClient()
  const r = await db.execute(`SELECT nome, categoria, telefone FROM leads`)

  const mantidos = r.rows.filter((x) => {
    const nome = String(x.nome ?? '')
    const ehTeste = /teste|test\b|asdsad|espaco$/i.test(nome)
    return !ehTeste && ehLeadDoNicho(String(x.categoria ?? ''), nome)
  })

  // TATUAGEM entrou de contrabando? (tem "estudio" no nome)
  const suspeitos = mantidos.filter((x) =>
    /tattoo|tatuagem|tatuador|piercing/i.test(String(x.nome) + ' ' + String(x.categoria)),
  )

  console.log(`\n=== MANTIDOS: ${mantidos.length} ===`)
  console.log(`\n🚨 TATUAGEM que entrou de contrabando: ${suspeitos.length}`)
  for (const x of suspeitos) console.log(`   ${x.nome}  [${x.categoria}]`)

  // outros que podem não ser beleza
  const duvidosos = mantidos.filter((x) =>
    /clinica|clínica|odonto|fisio|psic|quiroprax|terapia|nutri|dent/i.test(String(x.nome) + ' ' + String(x.categoria)) &&
    !/estetica|estética|beleza|beauty|pelle|depila/i.test(String(x.nome) + ' ' + String(x.categoria)),
  )
  console.log(`\n⚠️  DUVIDOSOS (clínica/fisio/psico — não é beleza?): ${duvidosos.length}`)
  for (const x of duvidosos.slice(0, 15)) console.log(`   ${x.nome}  [${x.categoria}]`)

  const comTel = mantidos.filter((x) => x.telefone)
  console.log(`\n📞 com telefone: ${comTel.length}\n`)
}
main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
