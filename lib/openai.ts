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
- **Bullets** pra listas de ação ou diagnóstico
- **Blockquote (> )** pra destaques estratégicos (slogan, oportunidade única, regra de ouro, KPI principal)
- **Negrito** pra decisões-chave
- NUNCA use frases paralelas estruturadas (Primeiro... Segundo...)

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
