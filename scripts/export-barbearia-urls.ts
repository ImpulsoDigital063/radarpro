import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { getClient } from '../lib/db'

async function main() {
  const db = getClient()

  const r = await db.execute(
    `SELECT id, nome, categoria, site, instagram, instagram_url, instagram_bio, nota, num_avaliacoes
     FROM leads
     WHERE categoria LIKE '%barbear%'
     ORDER BY num_avaliacoes DESC, nota DESC`
  )

  console.error(`Total leads barbearia: ${r.rows.length}`)

  const urls: string[] = []
  let comSiteReal = 0, comIg = 0

  for (const row of r.rows) {
    const site  = (row.site as string | null)?.trim()
    const ig    = (row.instagram as string | null)?.trim()
    const igUrl = (row.instagram_url as string | null)?.trim()
    const nome  = row.nome as string

    // só sites reais (não Google Maps)
    if (site && /^https?:\/\//i.test(site) && !/google\.com\/maps/i.test(site)) {
      urls.push(site)
      comSiteReal++
    }

    if (igUrl && /^https?:\/\//i.test(igUrl)) {
      urls.push(igUrl)
      comIg++
    } else if (ig) {
      const handle = ig.replace(/^@/, '').trim()
      if (handle && !/^\d+$/.test(handle)) {
        urls.push(`https://instagram.com/${handle}`)
        comIg++
      }
    }
  }

  console.error(`Sites reais: ${comSiteReal} | Instagram: ${comIg} | Total URLs: ${urls.length}`)
  console.log(urls.join('\n'))
}

main().catch(e => { console.error(e); process.exit(1) })
