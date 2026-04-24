import Anthropic from '@anthropic-ai/sdk'

// ══════════════════════════════════════════════════════════════
// Plano de Negócio & Marketing — Claude Sonnet 4.6 (Nível 2)
//
// Stack recomendada:
// - Modelo: claude-sonnet-4-6 (64k max_tokens nativos via streaming,
//   qualidade muito superior ao Gemini Flash pra texto longo estruturado)
// - Streaming: obrigatório pra max_tokens > 16k (evita HTTP timeout)
// - Prompt caching na system instruction: system prompt grande (~4k tokens)
//   é cacheado com ephemeral (5min TTL). Primeira chamada paga ~1.25x write,
//   demais pagam ~0.1x = ~90% de economia no prefix.
// - adaptive thinking desativado (não precisa pra esse caso; reduz custo)
// ══════════════════════════════════════════════════════════════

const SYSTEM_PLANO_NEGOCIO = `Você é o consultor estratégico da Impulso Digital, responsável por gerar Planos de Negócio & Marketing personalizados pra cada cliente que fecha projeto com a agência.

Seu output é um Markdown estruturado em 14 seções. A qualidade-referência é o plano da GB Nutrition (personal trainer em Palmas, loja online de suplementos com entrega expressa no mesmo dia) — aceito pelo cliente como trabalho profissional de consultoria.

## Princípios de escrita

- **Tom direto, sem frescura** — conversa como amigo, não corporativês. Evite "democratizar", "exatamente", "no fim do dia"
- **Números reais quando o cliente forneceu**; estimativas conservadoras quando não (marque com "estimativa")
- **Tabelas** pra comparações (diferenciais, público, cronograma, ferramentas)
- **Bullets** pra listas de ação ou diagnóstico
- **Blockquote (> )** pra destaques estratégicos (slogan, oportunidade única, regra de ouro, KPI principal)
- **Negrito** pra decisões-chave dentro de parágrafos
- **Cada seção tem função no funil** — não é enfeite

## Regras duras

- Se o briefing deixou campo crítico em branco, marque como **[CONFIRMAR COM O CLIENTE]** e continue
- NÃO invente números específicos (faturamento, clientes) que o cliente não forneceu
- Use o nome do cliente e do fundador como aparece no briefing
- Slogan em blockquote de destaque, 1 linha forte
- Linguagem estratégica mas acessível (cliente não precisa saber o que é "CTR" ou "ROAS")
- NUNCA use frases paralelas estruturadas (Primeiro... Segundo... Terceiro...)

## Estrutura obrigatória (14 seções COMPLETAS — não pare no meio)

1. Visão Geral do Negócio — parágrafo + tabela de dados operacionais
2. Diagnóstico — Situação Atual (O que existe / O que ativar / Custos e plataformas + Oportunidade única em blockquote)
3. O Problema que Estamos Resolvendo (dor do cliente final + dor do dono + solução)
4. Proposta de Valor e Diferenciais (slogan em blockquote grande + tabela 5-7 diferenciais)
5. Público-Alvo (tabela 4-6 perfis × quem é × como chegar + Prioridade absoluta em blockquote)
6. Análise de Mercado Local (oportunidade em bullets + tabela concorrência + Posicionamento em blockquote)
7. Estrutura Operacional (se aplicável — só se tem logística física; caso contrário, escreva "Não aplicável — plano foca em captação digital")
8. Plano de Marketing (posicionamento + canais IG negócio + IG pessoal se tiver + WhatsApp + estratégia lançamento 3 fases com tabela 7 dias)
9. Cronograma de Lançamento (tabela período × fase × ações × meta, Dias 1-3/4-5/6-12/Semanas 3-4/Mês 2+ + Regra de ouro em blockquote)
10. Catálogo e Projeções (se tem produtos físicos) OU Oferta e Projeções (se serviço) — ticket médio + cenários conservador/realista/otimista
11. Sugestões de Promoções (5-8 cards formato: **NOME** — Duração / Oferta / Por que funciona)
12. Ferramentas e Custos (tabela ferramenta × função × custo + Custo fixo real)
13. Metas e KPIs (tabela indicador × meta cobrindo lançamento/mês 1/mês 3/mês 6 + KPI principal em blockquote)
14. Checklist de Ação (5 grupos A/B/C/D/E com 3-5 passos numerados cada)

## Output esperado

Apenas o Markdown completo das 14 seções. SEM code fence externo (\`\`\`), SEM explicação antes ou depois. Comece com "# [NOME_NEGÓCIO] — Plano de Negócio & Marketing" e termine com a seção 14 completa. Cobre todas as 14 seções sem truncar.`

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
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada')
  }

  const client = new Anthropic({ apiKey })

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

## Respostas do Diagnóstico (pré-venda, 8 perguntas)

${diagFmt}

## Respostas do Briefing (pós-venda, 19 perguntas)

${briefFmt}

## Instruções finais

- Gere as 14 seções COMPLETAS — não pare no meio nem resuma. Cobre todas do início ao fim.
- Foco no serviço contratado: se LP, otimizar captação; se Shopify, operação de loja; se AgendaPRO, conversão de agendamento; se Consultoria, roteiro de sessões.
- Tabelas sempre que couber (melhor que prosa).
- Slogan em blockquote grande no início da seção 4.
- Output apenas o Markdown, sem code fence externo.`

  // Streaming obrigatório pra max_tokens > 16k (evita HTTP timeout)
  // finalMessage() coleta a resposta completa
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 16384,
    system: [
      {
        type: 'text',
        text: SYSTEM_PLANO_NEGOCIO,
        cache_control: { type: 'ephemeral' }, // cache do system prompt (5min TTL)
      },
    ],
    messages: [{ role: 'user', content: prompt }],
  })

  const finalMessage = await stream.finalMessage()

  const markdown = finalMessage.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
    .replace(/^```(?:markdown|md)?\n?/i, '')
    .replace(/\n?```$/, '')

  return {
    markdown,
    modelo: 'claude-sonnet-4-6',
  }
}
