/**
 * Exporta os leads COM avaliações coletadas pra um JSON que os agentes vão
 * estudar um por um. Cada agente lê as avaliações reais daquele negócio e
 * escreve a mensagem daquele dono — não um template.
 *
 *   npx tsx scripts/exportar-para-estudo.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { writeFileSync } from 'fs'
import { getClient } from '../lib/db'
import { detectarNicho } from '../lib/nichos'
import { situacaoDoLead } from '../lib/playbook-local'

const SAIDA = process.argv.find((a) => a.startsWith('--out='))?.split('=')[1]
  ?? 'leads-para-estudo.json'

async function main() {
  const db = getClient()

  const r = await db.execute(`
    SELECT id, nome, categoria, telefone, nota, num_avaliacoes,
           site_real, sistema_detectado, nivel_consciencia, reviews_texto
    FROM leads
    WHERE status != 'arquivado' AND telefone IS NOT NULL
      AND reviews_texto IS NOT NULL
    ORDER BY num_avaliacoes DESC
  `)

  const leads = (r.rows as any[]).map((l) => {
    let reviews: { nota: number | null; texto: string }[] = []
    try { reviews = JSON.parse(l.reviews_texto) } catch { /* ignora */ }

    return {
      id: l.id,
      nome: l.nome,
      categoria: l.categoria,
      nicho: detectarNicho(l.categoria ?? '', l.nome ?? '') ?? 'OUTRO',
      situacao: situacaoDoLead(l),
      sistema_detectado: l.sistema_detectado ?? null,
      // ⚠️ nota e num_avaliacoes vão pro ESTUDO, mas o agente está PROIBIDO
      // de escrever esses números na mensagem (só vendedor lê contagem de review)
      _sinal_interno: { nota: l.nota, num_avaliacoes: l.num_avaliacoes },
      site: l.site_real ?? null,
      // as piores primeiro — a dor é o que vende
      avaliacoes: reviews.slice(0, 15).map((v) => ({ nota: v.nota, texto: v.texto })),
      negativas: reviews.filter((v) => (v.nota ?? 5) <= 3).length,
    }
  })

  writeFileSync(SAIDA, JSON.stringify(leads, null, 2), 'utf8')
  console.log(`${leads.length} leads exportados pra ${SAIDA}`)
  console.log(`  com avaliação negativa: ${leads.filter((l) => l.negativas > 0).length}`)
  console.log(`  já usam sistema       : ${leads.filter((l) => l.sistema_detectado).length}`)
}

main().catch((e) => { console.log('ERRO:', e.message); process.exit(1) })
