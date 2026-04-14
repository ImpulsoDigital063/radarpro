import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

// Rastreia buscas em andamento: tipo → PID
const emAndamento: Record<string, number> = {}

export async function POST(req: NextRequest) {
  const { tipo, fonte = 'gmaps' } = await req.json()

  if (!['lp', 'shopify', 'agendapro'].includes(tipo)) {
    return NextResponse.json({ error: 'tipo inválido' }, { status: 400 })
  }

  // Evita disparar a mesma busca duas vezes
  if (emAndamento[tipo]) {
    return NextResponse.json({ ok: false, message: `Busca ${tipo} já em andamento (PID ${emAndamento[tipo]})` })
  }

  const script = fonte === 'instagram'
    ? 'scripts/scrape-instagram.ts'
    : 'scripts/scrape-gmaps.ts'

  const scriptPath = path.join(process.cwd(), script)

  // Dispara em background e retorna imediatamente
  const child = spawn('npx', ['tsx', scriptPath, '--tipo', tipo], {
    cwd: process.cwd(),
    detached: true,
    stdio: 'ignore',
  })

  emAndamento[tipo] = child.pid ?? 0

  child.on('close', () => {
    delete emAndamento[tipo]
  })

  child.unref()

  return NextResponse.json({
    ok: true,
    message: `Busca ${tipo} iniciada — os leads aparecerão automaticamente`,
    pid: child.pid,
  })
}

export async function GET() {
  return NextResponse.json({ emAndamento })
}
