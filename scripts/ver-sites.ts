import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
import { getClient } from '../lib/db'

async function main() {
  const db = getClient()
  const r = await db.execute(`
    SELECT nome, site_real, nivel_consciencia FROM leads
    WHERE site_real IS NOT NULL AND site_real != ''
    ORDER BY id DESC LIMIT 15
  `)
  console.log('\n=== o que o scraper chamou de "site" ===\n')
  for (const x of r.rows) {
    const url = String(x.site_real)
    let tipo = 'SITE PRÓPRIO'
    if (/instagram\.com/i.test(url)) tipo = '📷 INSTAGRAM'
    else if (/facebook\.com/i.test(url)) tipo = '📘 FACEBOOK'
    else if (/linktr|beacons|linkbio/i.test(url)) tipo = '🔗 LINKTREE'
    else if (/wa\.me|whatsapp/i.test(url)) tipo = '💬 WHATSAPP'
    console.log(`${tipo.padEnd(16)} ${String(x.nome).slice(0, 26).padEnd(26)} ${url.slice(0, 46)}`)
  }
}
main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
