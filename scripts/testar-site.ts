import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { analisarSiteLead } from '../lib/site-analyzer'

async function main() {
  const url  = process.argv[2] || 'https://evsuplementosinjetaveis.com'
  const nome = process.argv[3] || 'Teste'

  console.log(`\n🔍 Analisando: ${url}\n`)
  const r = await analisarSiteLead(url, nome)
  console.log(JSON.stringify(r, null, 2))
}

main().catch(console.error)
