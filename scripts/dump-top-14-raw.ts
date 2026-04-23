// Dump os 14 leads selecionados (mesmos filtros do top-14-disparo) com TODOS
// os campos disponíveis no banco. Saída JSON pra análise manual.
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { writeFileSync } from 'fs'
import { getClient } from '../lib/db'
import { detectarTipoOferta } from '../lib/mensagens'

async function main() {
  const db = getClient()
  const res = await db.execute(
    `SELECT id, nome, categoria, telefone, instagram, instagram_url, instagram_bio,
            instagram_seguidores, site, endereco, nota, num_avaliacoes,
            tem_site, tem_ecommerce, tem_agendamento, tipo, status, fonte,
            mensagem, notas, score, criado_em
       FROM leads
      WHERE status = 'novo'
        AND telefone IS NOT NULL AND telefone != ''
        AND (instagram IS NOT NULL AND instagram != '' OR instagram_url IS NOT NULL AND instagram_url != '')
      ORDER BY num_avaliacoes DESC NULLS LAST, nota DESC NULLS LAST`,
  )

  const rows = res.rows as any[]
  const CATEGORIAS_GENERICAS = [
    'profissional liberal', 'comércio local', 'comercio local',
    'serviços locais', 'servicos locais', 'estabelecimento',
    'empresa', 'loja', 'serviço', 'servico',
  ]
  const filtrados = rows.filter((r: any) => {
    const cat = (r.categoria ?? '').trim().toLowerCase()
    if (!cat) return false
    if (/^[\d().,\s-]+$/.test(cat)) return false
    if (CATEGORIAS_GENERICAS.includes(cat)) return false
    if (/\bshopping\b/.test((r.nome ?? '').toLowerCase())) return false
    return true
  })

  const lp: any[] = []
  const shopify: any[] = []
  for (const r of filtrados) {
    const oferta = detectarTipoOferta(r.categoria ?? '')
    if (oferta === 'shopify-solo' && shopify.length < 7) shopify.push({ ...r, oferta })
    else if (oferta === 'lp-solo' && lp.length < 7) lp.push({ ...r, oferta })
    if (lp.length === 7 && shopify.length === 7) break
  }

  const out = { lp, shopify }
  const outPath = resolve(process.cwd(), 'top-14-raw.json')
  writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf-8')
  console.error(`Dump salvo em: ${outPath}`)
  console.log(JSON.stringify(out, null, 2))
}

main().catch(e => { console.error(e); process.exit(1) })
