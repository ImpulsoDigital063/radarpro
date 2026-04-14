import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import path from 'path'

export async function POST(req: NextRequest) {
  const { tipo, fonte = 'gmaps' } = await req.json()

  if (!['lp', 'shopify', 'agendapro'].includes(tipo)) {
    return NextResponse.json({ error: 'tipo inválido' }, { status: 400 })
  }

  const script = fonte === 'instagram'
    ? 'scripts/scrape-instagram.ts'
    : 'scripts/scrape-gmaps.ts'

  const scriptPath = path.join(process.cwd(), script)

  return new Promise((resolve) => {
    execFile('npx', ['tsx', scriptPath, '--tipo', tipo], {
      cwd: process.cwd(),
      timeout: 120000,
    }, (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ error: stderr || error.message }, { status: 500 }))
      } else {
        resolve(NextResponse.json({ ok: true, output: stdout }))
      }
    })
  })
}
