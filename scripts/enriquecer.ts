/**
 * radarPRO — Enriquecimento de leads
 * Busca Instagram de todos os leads que ainda não têm
 *
 * Uso:
 *   npx tsx scripts/enriquecer.ts           # todos
 *   npx tsx scripts/enriquecer.ts --tipo lp  # só LP
 *   npx tsx scripts/enriquecer.ts --id 5     # lead específico
 */

import { enriquecerTodos, enriquecerLead } from '../lib/enricher'

async function main() {
  const args    = process.argv.slice(2)
  const tipoArg = args.find(a => a.startsWith('--tipo='))?.split('=')[1] ?? args[args.indexOf('--tipo') + 1]
  const idArg   = args.find(a => a.startsWith('--id='))?.split('=')[1] ?? args[args.indexOf('--id') + 1]

  if (idArg) {
    await enriquecerLead(Number(idArg))
  } else {
    await enriquecerTodos(tipoArg)
  }
}

main().catch(console.error)
