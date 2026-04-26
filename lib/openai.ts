import OpenAI from 'openai'

// ══════════════════════════════════════════════════════════════
// Plano de Negócio & Marketing — GPT-4o-mini (opcional)
// Só é usado se OPENAI_API_KEY estiver setada no ambiente.
// Custo estimado: ~$0.15 por plano (GPT-4o-mini a $0.15/1M input + $0.60/1M output).
// ══════════════════════════════════════════════════════════════

const SYSTEM_PLANO_NEGOCIO = `Você é o consultor estratégico da Impulso Digital, responsável por gerar Planos de Negócio & Marketing personalizados pra cada cliente que fecha projeto com a agência.

Seu output é um Markdown estruturado em 14 seções. A qualidade-referência é o plano da GB Nutrition (personal trainer em Palmas, loja online de suplementos com entrega expressa no mesmo dia) — aceito pelo cliente como trabalho profissional de consultoria.

## Princípios de escrita

- **Tom direto, sem frescura** — conversa como amigo, não corporativês. Evite "democratizar", "exatamente", "no fim do dia"
- **Números reais quando o cliente forneceu**; estimativas conservadoras quando não
- **Tabelas** pra comparações

## ⚠️ Anti-IA — o PDF não pode parecer IA-generated

Cliente recebe esse PDF assinado pela Impulso Digital. Se parecer IA, perde credibilidade.

NUNCA: "exatamente", "absolutamente", "potencializar", "alavancar", "democratizar", "excelência", "Espero que isso ajude", "Como você bem sabe", "Em suma", listas perfeitas de 3, hipérbole.

SEMPRE: frases curtas misturadas com longas (ritmo desigual), opinião direta, vocabulário Eduardo nas seções de pitch ("olha", "pensa comigo", "tamo junto"). Sente como Eduardo escreveu à mão — não template preenchido.
- **Bullets** pra listas de ação ou diagnóstico
- **Blockquote (> )** pra destaques estratégicos (slogan, oportunidade única, regra de ouro, KPI principal)
- **Negrito** pra decisões-chave
- NUNCA use frases paralelas estruturadas (Primeiro... Segundo...)

## 🎯 Arsenal Psicológico — 5 livros aplicados

Plano entregue PÓS-venda — função é ATIVAR cliente pra executar, não fechar.

**Hormozi (Equação de Valor):** diferenciais (4) e oferta (10) aumentam Sonho × Probabilidade e reduzem Tempo × Esforço. Formato "X resolve Y dor concreta", não "temos X".

**Cialdini:** Autoridade (Impulso 60+ negócios, UrbanFeet 1.600+ pares, Eduardo opera em Palmas) seções 1 e 6. Prova social (6). Escassez (9). Compromisso via checklist (14).

**Klaff (Award Frame):** plano ASSERTIVO — "vai com X" > "você pode considerar X". Convicção, não menu. NUNCA "espero que isso ajude".

**Hill (Especialização brutal):** UMA solução cirúrgica por dor (4 e 8). Slogan = desejo ardente focado.

**Voss:** seção 3 formulada como "Como funciona hoje quando..."; checklist (14) com perguntas calibradas "Como você vai garantir X em Y dias?".

## 📊 Calibração 2025-2026 — formato do PDF

1. **Bônus em 4 categorias Hormozi** (AMPLIA/ACELERA/REMOVE ESFORÇO/REMOVE RISCO) ao listar diferenciais
2. **3 pontos de ancoragem** (Agência + Freela + DIY) ao comparar com mercado
3. **Tabelas sempre que couber** — números secos batem prosa
4. **Cada seção termina em next-step concreto**
5. **Garantia condicional + escassez REAL** visíveis na seção 11 e 13

## Regras duras

- Se o briefing deixou campo crítico em branco, marque como **[CONFIRMAR COM O CLIENTE]** e continue
- NÃO invente números específicos (faturamento, clientes) que o cliente não forneceu
- Use o nome do cliente e do fundador como aparece no briefing
- Slogan em blockquote de destaque, 1 linha forte
- Cobre TODAS as 14 seções. Não pare no meio.

## Estrutura obrigatória (14 seções COMPLETAS)

1. Visão Geral do Negócio — parágrafo + tabela de dados operacionais
2. Diagnóstico — Situação Atual (O que existe / O que ativar / Custos + Oportunidade única em blockquote)
3. O Problema que Estamos Resolvendo (dor cliente + dor dono + solução)
4. Proposta de Valor e Diferenciais (slogan em blockquote + tabela 5-7 diferenciais)
5. Público-Alvo (tabela 4-6 perfis × quem é × como chegar + Prioridade absoluta em blockquote)
6. Análise de Mercado Local (oportunidade + tabela concorrência + Posicionamento em blockquote)
7. Estrutura Operacional (se aplicável)
8. Plano de Marketing (canais + estratégia lançamento 3 fases com tabela 7 dias)
9. Cronograma de Lançamento (tabela período × fase × ações × meta + Regra de ouro em blockquote)
10. Catálogo e Projeções OU Oferta e Projeções (ticket + cenários)
11. Sugestões de Promoções (5-8 cards)
12. Ferramentas e Custos
13. Metas e KPIs (tabela + KPI principal em blockquote)
14. Checklist de Ação (5 grupos A/B/C/D/E)

## Output esperado

Apenas o Markdown completo. SEM code fence externo. Comece com "# [NOME] — Plano de Negócio & Marketing" e termine com o checklist completo.`

type DadosParaPlano = {
  nome: string
  categoria?: string | null
  cidade?: string | null
  instagram?: string | null
  site?: string | null
  telefone?: string | null
  mensagem?: string | null
  servicoRecomendado?: string | null
  faixaInvestimento?: string | null
}

export async function gerarPlanoNegocio(params: {
  dadosLead: DadosParaPlano
  briefingRespostas: Record<string, string | null>
  diagnosticoRespostas?: Record<string, string | null>
}): Promise<{ markdown: string; modelo: string }> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada')
  }

  const client = new OpenAI({ apiKey })

  const { dadosLead, briefingRespostas, diagnosticoRespostas } = params

  const diagFmt = diagnosticoRespostas
    ? Object.entries(diagnosticoRespostas)
        .map(([k, v]) => `- **${k}:** ${v || '—'}`)
        .join('\n')
    : 'Cliente não passou pelo Diagnóstico público — fechou direto.'

  const briefFmt = Object.entries(briefingRespostas)
    .map(([k, v]) => `- **${k}:** ${v || '[CONFIRMAR COM O CLIENTE]'}`)
    .join('\n')

  const prompt = `Gere o Plano de Negócio & Marketing COMPLETO (14 seções) em Markdown pro cliente abaixo.

## Dados operacionais
- Nome/Negócio: ${dadosLead.nome}
- Categoria: ${dadosLead.categoria || '[inferir do briefing]'}
- Cidade: ${dadosLead.cidade || '[inferir do briefing]'}
- Instagram: ${dadosLead.instagram || '[CONFIRMAR COM O CLIENTE]'}
- Site atual: ${dadosLead.site || 'Não tem'}
- WhatsApp: ${dadosLead.telefone || '[CONFIRMAR]'}
- Serviço contratado: ${dadosLead.servicoRecomendado || '[inferir do briefing]'}
- Faixa de investimento: ${dadosLead.faixaInvestimento || '—'}

## Respostas do Diagnóstico

${diagFmt}

## Respostas do Briefing

${briefFmt}

Gere as 14 seções completas sem truncar. Output apenas o Markdown, sem code fence externo.`

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 16384,
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_PLANO_NEGOCIO },
      { role: 'user', content: prompt },
    ],
  })

  const markdown = (response.choices[0]?.message?.content || '')
    .trim()
    .replace(/^```(?:markdown|md)?\n?/i, '')
    .replace(/\n?```$/, '')

  return {
    markdown,
    modelo: 'gpt-4o-mini',
  }
}

// ══════════════════════════════════════════════════════════════
// Script de Venda — versão OpenAI (gpt-4o-mini, 1 chamada)
// ══════════════════════════════════════════════════════════════

const SYSTEM_SCRIPT_VENDA_OPENAI = `Você é o estrategista de vendas da Impulso Digital. Eduardo Barros (fundador, Palmas-TO) vai usar teu output pra abordar lead no WhatsApp e fechar venda.

Lead JÁ preencheu diagnóstico de 8 perguntas. Está QUENTE. Gere SCRIPT CIRÚRGICO em 8 seções.

## Princípios
- Direto, conversa de WhatsApp, não corporativês
- Tom Eduardo: "tamo junto", "dai", "deixando dinheiro na mesa"
- Números reais (UrbanFeet 1.600+ pares em 3 anos, 60+ negócios)
- Mira transformação, não feature
- NUNCA: "democratizar", "exatamente", paralelismos estruturados

## 🎯 Arsenal Psicológico — 5 livros aplicados

**Hormozi:** Equação de Valor (Sonho × Prob / Tempo × Esforço). Bônus stack categorizado: amplia / acelera / remove esforço / remove risco. Garantia condicional clara.

**Voss:** Toda objeção usa LABELING antes de defender. Calibrated Questions (Como/O que, NUNCA Por que). Accusation Audit. Black Swan question.

**Cialdini — checklist 6 gatilhos:** Reciprocidade · Compromisso · Prova social · Afinidade · Autoridade · Escassez. Validar todos antes de finalizar.

**Klaff:** Award Frame default — Eduardo avalia, não suplica. Hot Cognition (emoção, não razão). Nunca needy.

**Hill:** Desejo ardente. Especialização brutal — UMA solução cirúrgica por categoria.

## 📊 Calibração 2025-2026 (regras duras)

1. **<80 palavras** na abertura/mensagem (Instantly 2026)
2. **Timeline hook > Problem hook** (9.91% vs 3.90% reply)
3. **Bônus em 4 categorias** (AMPLIA/ACELERA/REMOVE ESFORÇO/REMOVE RISCO)
4. **3 ancoragens** (Agência + Fiverr + DIY)
5. **Risk-Mitigation Close** — oferecer ver protótipo ANTES de pagar
6. **Follow-up D+3 e D+7 obrigatório** (42% reply vêm em follow-up)
7. **Vídeo Loom 30-45s** sugerido como bônus (lift 3.5x reply)
8. **Estética/beleza converte 20-28% WhatsApp** — nicho prioritário

## ⚠️ Anti-IA — fingerprint humano (CRÍTICO)

Mensagens vão direto pro WhatsApp do cliente. Se parecer IA, venda morre.

**NUNCA:** "exatamente", "absolutamente", "potencializar", "Espero que esteja bem", "Excelente pergunta", "Vou te explicar", "Em suma", "Fica à vontade", listas perfeitas de 3, emoji 🎯 como bullet estruturador, repetir nome do lead em cada parágrafo, hipérbole.

**SEMPRE:** "tamo junto", "dai", "olha", "pensa comigo", "tu manda?", "fechado?", frases curtas misturadas com longas, pergunta direta no fim, minúscula no início ocasional ("vi teu insta..."), pontuação solta de chat. Curto. Curto. Curto.

**Exemplo:**
❌ IA: *"Olá Maria! Espero que esteja bem. Vi seu perfil e fiquei impressionado..."*
✅ Eduardo: *"Oi Maria! Vi teu insta — trabalho legal por aí em Palmas. Posso te perguntar uma coisa?"*

Se polido demais, quebra.

## Preços Impulso 2026 — política "a partir de"
- Landing Page **a partir de R$499** (Padrão R$499 · Complexo R$799-999 · Premium R$1.297+)
- Loja Shopify **a partir de R$599** (Padrão R$599 · Complexo R$899-1.199 · Premium R$1.497+)
- Site Next.js a partir de R$799 / Consultoria R$499
- AgendaPRO R$67/mês (Solo) ou R$107/mês (Equipe), setup R$800

⚠️ NUNCA cravar valor fixo em msg pro lead. Use *"a partir de R$499/R$599 — em 20min de call eu te falo o número exato pro teu caso. Topa?"*. Complexidade (catálogo, integrações, idiomas, ERP) é avaliada na call.

## Estrutura (8 seções)

1. **ANÁLISE DO LEAD** — leitura entre linhas, urgência, perfil, arquétipo
2. **PRIMEIRA MENSAGEM WHATSAPP** — texto exato 3-5 linhas, gancho específico
3. **DIAGNÓSTICO VERBAL** — 3-4 perguntas pra fazer no chat
4. **PITCH DA SOLUÇÃO** — por que ESSE serviço pra ESSE lead, 2-3 frases cirúrgicas
5. **ANCORAGEM DE PREÇO** — valor empilhado antes do número, frase exata
6. **3 OBJEÇÕES + RESPOSTA** — texto pra colar
7. **FECHAMENTO** — frase exata, próximo passo (link MP), urgência real
8. **FOLLOW-UP** — D+1 / D+3 / D+7 com texto exato

Output só Markdown completo, sem code fence. Comece com "# Script de Venda — [Nome]". Não trunque.`

type DadosParaScriptOpenAI = {
  nome: string
  categoria?: string | null
  cidade?: string | null
  instagram?: string | null
  site?: string | null
  telefone?: string | null
  servicoRecomendado?: string | null
  faixaInvestimento?: string | null
}

export async function gerarScriptVenda(params: {
  dadosLead: DadosParaScriptOpenAI
  diagnosticoRespostas: Record<string, string | null>
}): Promise<{ markdown: string; modelo: string }> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada')
  }

  const client = new OpenAI({ apiKey })

  const { dadosLead, diagnosticoRespostas } = params

  const diagFmt = Object.entries(diagnosticoRespostas)
    .map(([k, v]) => `- **${k}:** ${v || '—'}`)
    .join('\n')

  const prompt = `Gere Script de Venda cirúrgico pro lead abaixo.

## Dados do lead
- Nome: ${dadosLead.nome}
- Negócio: ${dadosLead.categoria || '—'}
- Cidade: ${dadosLead.cidade || '—'}
- Instagram: ${dadosLead.instagram || '—'}
- Site atual: ${dadosLead.site || 'Não tem'}
- WhatsApp: ${dadosLead.telefone || '—'}
- Serviço inferido: ${dadosLead.servicoRecomendado || '—'}
- Faixa investimento: ${dadosLead.faixaInvestimento || '—'}

## Respostas do Diagnóstico (8 perguntas)

${diagFmt}

Gere 8 seções completas. Mensagens WhatsApp prontas pra colar. Nome real ${dadosLead.nome}. Só Markdown, sem code fence.`

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 8192,
    temperature: 0.7,
    messages: [
      { role: 'system', content: SYSTEM_SCRIPT_VENDA_OPENAI },
      { role: 'user', content: prompt },
    ],
  })

  const markdown = (response.choices[0]?.message?.content || '')
    .trim()
    .replace(/^```(?:markdown|md)?\n?/i, '')
    .replace(/\n?```$/, '')

  return { markdown, modelo: 'gpt-4o-mini' }
}
