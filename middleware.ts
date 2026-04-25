import { NextResponse, type NextRequest } from 'next/server'

// Middleware de auth pra endpoints sensíveis.
//
// Estratégia: same-origin check + bypass via header de API key interna.
//
// Por que NÃO é auth perfeito: chamadas server-side (renderização Next) podem
// não ter Origin/Referer; SDR humano via UI tem ambos. Mas REDUZ DRASTICAMENTE
// o ataque: drive-by externo perde origem, perde ataque.
//
// Endpoints PROTEGIDOS:
// - /api/ai          (chama Claude/Gemini = $$)
// - /api/analyze     (Claude site analysis)
// - /api/enrich      (Playwright Instagram)
// - /api/scrape      (Playwright Google Maps)
// - /api/tally/gerar-plano        (Claude/Gemini/OpenAI grandes — $$)
// - /api/tally/gerar-script-venda (Claude/Gemini/OpenAI — $$)
//
// Endpoints PÚBLICOS (auth própria ou dados não-sensíveis):
// - /api/webhooks/tally          (HMAC-SHA256 próprio)
// - /api/debug                   (header x-debug-key próprio)
// - /api/whatsapp/qr             (UI Eduardo)
// - /api/leads                   (UI Eduardo)
// - /api/disparo                 (UI Eduardo)
// - /api/licoes                  (UI Eduardo)

const ENDPOINTS_PROTEGIDOS = [
  '/api/ai',
  '/api/analyze',
  '/api/enrich',
  '/api/scrape',
  '/api/tally/gerar-plano',
  '/api/tally/gerar-script-venda',
]

const ALLOWED_ORIGINS = [
  'https://radarpro-inky.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
]

function isProtegido(path: string): boolean {
  return ENDPOINTS_PROTEGIDOS.some((p) => path.startsWith(p))
}

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.some((o) => origin === o || origin.startsWith(o + '/'))
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Não interfere com rotas não-API (UI, assets)
  if (!path.startsWith('/api/')) return NextResponse.next()

  // Endpoints não-protegidos seguem
  if (!isProtegido(path)) return NextResponse.next()

  // Bypass via header de API key interna (uso programático, scripts, testes)
  const apiKey = process.env.INTERNAL_API_KEY
  if (apiKey && req.headers.get('x-api-key') === apiKey) {
    return NextResponse.next()
  }

  // Same-origin check pelo Origin OU Referer (browser sempre envia 1 dos 2 em fetch)
  const origin = req.headers.get('origin') || ''
  const referer = req.headers.get('referer') || ''
  if (origin && isAllowedOrigin(origin)) return NextResponse.next()
  if (referer && ALLOWED_ORIGINS.some((o) => referer.startsWith(o))) return NextResponse.next()

  // Sem origin nem referer válido — barra
  return NextResponse.json(
    { error: 'unauthorized', message: 'cross-origin request bloqueada' },
    { status: 401 },
  )
}

export const config = {
  matcher: '/api/:path*',
}
