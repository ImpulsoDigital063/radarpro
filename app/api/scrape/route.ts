import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

// Rastreia buscas em andamento: chave → PID
const emAndamento: Record<string, number> = {}

export async function POST(req: NextRequest) {
  const { tipo, query, fonte = 'gmaps' } = await req.json()

  if (!['lp', 'shopify', 'agendapro'].includes(tipo)) {
    return NextResponse.json({ error: 'tipo inválido' }, { status: 400 })
  }

  const chave = query ? `${tipo}:${query}` : tipo

  if (emAndamento[chave]) {
    return NextResponse.json({ ok: false, message: `Busca já em andamento` })
  }

  const script = fonte === 'instagram'
    ? 'scripts/scrape-instagram.ts'
    : 'scripts/scrape-gmaps.ts'

  const scriptPath = path.join(process.cwd(), script)

  const args = ['tsx', scriptPath, '--tipo', tipo]
  if (query) args.push(`--query=${query} Palmas TO`)

  // shell: true resolve o problema do npx não ser encontrado no Windows
  const child = spawn('npx', args, {
    cwd: process.cwd(),
    detached: true,
    stdio: 'ignore',
    shell: true,
  })

  emAndamento[chave] = child.pid ?? 0

  child.on('close', () => {
    delete emAndamento[chave]
  })

  child.unref()

  return NextResponse.json({
    ok: true,
    message: `Busca iniciada — os leads aparecerão em alguns minutos`,
    pid: child.pid,
    chave,
  })
}

export async function GET() {
  return NextResponse.json({ emAndamento })
}
