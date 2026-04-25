# RadarPRO — Impulso Digital

Sistema interno de prospecção, qualificação e fechamento de leads pra Impulso Digital (Eduardo Barros, Palmas-TO).

## O que faz

- **Prospecta** leads via Google Maps + Instagram (Playwright local)
- **Enriquece** com bio, seguidores, score qualitativo
- **Funil Tally** — formulários de Diagnóstico (pré-venda) e Briefing (pós-venda)
- **Gera scripts de venda** customizados por lead (Claude / Gemini / OpenAI)
- **Gera Plano de Negócio & Marketing** em PDF (14 seções) pra cliente que fechou
- **Painel `/disparo`** — 14 leads priorizados com playbook calibrado pelos 5 livros (Hill, Hormozi, Voss, Cialdini, Klaff)
- **Painel `/tally`** — funil de conversão dos formulários

## Stack

- Next.js 16 + React 19 (App Router)
- Turso (libSQL) — banco serverless
- Playwright (scripts locais — não roda em Vercel)
- @whiskeysockets/baileys — WhatsApp local (não roda em Vercel)
- Claude Opus 4.6 / Gemini 2.5 / GPT-4o-mini
- Tally — formulários de captação
- Mercado Pago — pagamentos (link único)
- Vercel — deploy da UI

## Env vars (`.env.local`)

```bash
# Banco (obrigatório)
TURSO_URL=libsql://...
TURSO_TOKEN=...

# IA (pelo menos 1 — Gemini é o default)
GEMINI_API_KEY=...
ANTHROPIC_API_KEY=...   # opcional, recomendado pra Plano de Negócio
OPENAI_API_KEY=...      # opcional

# Auth (obrigatório em produção)
TALLY_WEBHOOK_SECRET=...   # HMAC do webhook Tally
INTERNAL_API_KEY=...       # bypass de same-origin pra scripts/testes
DEBUG_KEY=...              # acesso a /api/debug
```

## Scripts úteis

### Prospecção
```bash
npm run radar:lp                 # scrape Google Maps pra LP (Palmas)
npm run radar:shopify            # scrape pra Shopify
npm run enriquecer               # enriquece leads sem IG
npm run ig:login                 # login Instagram (sessão salva)
```

### Disparo
```bash
npm run disparo:14               # gera top-14-disparo.md
npm run disparo:20-perfeitos     # gera lista de 20 leads "perfeitos"
npm run calc:nuvemshop -- --manual
```

### Diagnóstico
```bash
npm run check:disparo-ids        # valida 14 IDs do /disparo no banco
npm run check:categorias         # listagem de categorias do banco
npm run stats                    # estatísticas gerais
npm run cleanup:junk             # limpa leads com dados ruins
```

### Tests / debug
```bash
npm run test:gemini              # testa modelos Gemini disponíveis
npm run test:site                # testa análise de site (Claude)
```

## Estrutura

```
app/
  api/              # 15 endpoints (REST)
  disparo/          # /disparo — playbook 14 leads priorizados
  tally/            # /tally — funil Tally
  licoes/           # /licoes — lições aprendidas das conversas
  integracao/       # /integracao/whatsapp — QR Baileys (LOCAL APENAS)
  abordar/[id]/     # /abordar/123 — abordagem dirigida pra 1 lead
  page.tsx          # /Painel — listagem + filtros completos

components/         # HeaderRadarPRO compartilhado

lib/
  db.ts                 # cliente Turso + initDb cached
  mensagens.ts          # scripts de abordagem por nicho
  disparo-analises.ts   # análises hardcoded dos 14 priorizados
  gemini.ts             # SYSTEM_PROMPTs Gemini
  claude.ts             # SYSTEM_PROMPTs Claude
  openai.ts             # SYSTEM_PROMPTs OpenAI
  enricher.ts           # Playwright Instagram
  whatsapp.ts           # Baileys (local)
  ...

scripts/            # CLI: scrape, enrichment, manutenção
middleware.ts       # auth pros endpoints sensíveis (same-origin + INTERNAL_API_KEY)
```

## Documentação externa

Auditoria minuciosa em `segundo-cerebro/2-PROCESSAMENTO/radar-pro/AUDITORIA-25-04-2026.md`.

Manuais permanentes:
- `segundo-cerebro/4-EXPORTACAO/playbooks/PROSPECCAO-MANUAL-COMPLETO.md` — 1573 linhas, 29 partes
- `segundo-cerebro/4-EXPORTACAO/playbooks/MANUAL-VENDAS-5-LIVROS.md` — Arsenal Psicológico
- `segundo-cerebro/4-EXPORTACAO/playbooks/cases-aprendizado/CASE-JEANE-MANISHA.md` — case didático

## Avisos

- **Vercel não roda Playwright** — busca de leads tem que rodar local
- **Vercel não roda Baileys** — integração WhatsApp tem que rodar local (`npm run dev`)
- **Endpoints sensíveis** (`/api/ai`, `/api/tally/gerar-*`) protegidos por same-origin check + bypass via `INTERNAL_API_KEY`

## Deploy

`git push origin master` → Vercel deploya automaticamente em `radarpro-inky.vercel.app`.

Branch principal: `master`.
