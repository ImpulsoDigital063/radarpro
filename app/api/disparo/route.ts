import { NextResponse } from 'next/server'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

export const dynamic = 'force-dynamic'

export async function GET() {
  const filePath = join(process.cwd(), 'top-14-disparo.md')
  if (!existsSync(filePath)) {
    return NextResponse.json(
      {
        ok: false,
        erro: 'Arquivo top-14-disparo.md não encontrado. Rode `npx tsx scripts/top-14-disparo.ts` localmente pra gerar e faça commit + push.',
      },
      { status: 404 },
    )
  }
  const md = readFileSync(filePath, 'utf-8')
  const stat = statSync(filePath)
  return NextResponse.json({
    ok: true,
    md,
    geradoEm: stat.mtime.toISOString(),
    tamanho: stat.size,
  })
}
