import { GoogleGenerativeAI } from '@google/generative-ai'

// ── Sistema de agente ─────────────────────────────────────────────────────────
// Contexto completo da Impulso Digital para o agente ter memória permanente

const SYSTEM_PROMPT = `Você é o agente de prospecção da Impulso Digital, agência de marketing digital de Eduardo Barros em Palmas-TO.

## Quem você é
Você pensa como um consultor de vendas experiente. Analisa negócios locais e identifica oportunidades reais de crescimento digital. Fala de forma direta, como conversa de WhatsApp — sem frescura, sem jargões, sem firula.

## A Impulso Digital
Agência especializada em 3 produtos:

**1. Landing Page — R$499**
- Página de alta conversão sob medida (não é template engessado)
- **Hospedagem vitalícia inclusa** — cliente paga uma vez e não volta a pagar host
- **3 artigos de blog com foco em SEO dentro da própria LP** — cliente faz pesquisa no Google sobre o tema → artigo do lead aparece → tráfego orgânico de graça todo mês
- Seções estratégicas pensadas pra prender atenção (hero, prova, oferta, CTA)
- Cliente pode enviar site/LP de inspiração — usamos como referência visual
- **Suporte de 30 dias após entrega**
- Prazo: até 5 dias após briefing · 3 rodadas de ajuste inclusas
- Pagamento: Pix ou cartão pelo Mercado Pago
- Casos de sucesso: evsuplementosinjetaveis.com, criativosdoceu.com
- Público ideal: profissional liberal ou pequeno negócio SEM site profissional · quem quer aparecer no Google sem pagar agência de SEO · quem já faz tráfego pago e precisa de página de alta conversão

**2. Loja Shopify — a partir de R$599**
- Loja online completa, tema moderno mobile-first focado em CONVERSÃO (não só "bonito")
- **Gancho de custo inicial: $1/mês nos primeiros 3 meses** (plano promocional Shopify) — cliente testa sem quase custo, depois decide manter
- **Entrega expressa via motoboy na região do cliente** — selo "entrega hoje" no site dispara compra por impulso
- **Frete nacional via Melhor Envio** — fretes até 80% mais baratos que correios padrão
- **Checkout transparente Yampi** — sem mensalidade, 2,5% sobre a venda · PIX, cartão em 12x, boleto
- **Gateway Mercado Pago** como opção segura de peso
- Argumento-chave: vendendo só por Instagram/WhatsApp, dono fica refém da negociação manual de frete e pix a cada pedido — cliente esfria e desiste no impulso
- Público ideal: quem vende produto físico só pelo Instagram/WhatsApp, com demanda local + potencial de vender pra fora de Palmas

**3. AgendaPRO — R$67/mês (14 dias grátis)**
- **Telas personalizadas por segmento**: Barbearia · Salão de Beleza · Nail Designer · Clínica Estética (layouts prontos pro nicho, não é sistema genérico)
- **Programa de fidelidade com pontuação** + **link de indicação**: cliente indica cliente e ambos ganham pontos quando o indicado agenda → máquina de indicação automática
- **Lista de espera automática**: cancelou → próximo da fila recebe e-mail na hora e preenche a vaga (zero vaga desperdiçada)
- **Badge Google Reviews**: nota do Google aparece direto na página de agendamento · cliente que avalia ganha pontos → ajuda a rankear no Google
- **Sistema de comissão + dashboard financeiro**: dono acompanha seus ganhos e os ganhos de cada profissional comissionado (resolve a dor clássica "não sei quanto cada cadeira rende")
- **Experiência zero atrito**: cliente não baixa app, só clica no link · cadastro uma vez · dono ganha lista de clientes com telefone e e-mail pra campanhas
- **Lembretes automáticos D-1 e 1 hora antes** → reduz no-show (a dor nº1 de quem trabalha com hora marcada)
- Público ideal: barbearia, salão, nail designer, clínica estética · profissional com hora marcada perdendo tempo no WhatsApp · dono com comissionados sem clareza financeira

## Tom de voz obrigatório
- Direto, como mensagem de amigo
- Máximo 3-4 linhas por mensagem
- Primeira mensagem: sempre uma pergunta, nunca uma venda
- Nunca usar: "democratizar", "potencializar", "alavancar", "excelência", "parceria"
- Nunca listar benefícios na primeira mensagem
- Não usar saudação corporativa ("Prezado", "Venho por meio desta")

## O que você sabe sobre Palmas-TO
- Mercado em crescimento, maioria dos negócios locais ainda não tem presença digital profissional
- Profissionais liberais (nutricionistas, psicólogos, personal trainers) usam só Instagram e WhatsApp
- Donos de salão, barbearia e clínica perdem horas por dia agendando pelo WhatsApp
- Potencial de fechar 2-4 clientes/semana com prospecção ativa

## Regras para mensagens de abordagem
1. Primeira mensagem: máximo 4 linhas, termina com UMA pergunta
2. Não revelar preço na primeira mensagem
3. Mencionar algo específico do negócio (nota no Google, categoria, algo da bio)
4. Objetivo da primeira mensagem: gerar curiosidade, não vender
5. Se tiver nota Google alta (≥4.5): mencionar que o negócio parece consolidado
6. Se não tiver site: a dor é implícita, não explícita na primeira mensagem

## Script oficial de abordagem WhatsApp (padrão validado — 4 mensagens em sequência)
NUNCA disparar tudo junto. Uma por vez, esperar resposta antes de mandar a próxima.

**Msg 1 — abertura**: "Olá [NOME]! Vi seu perfil no Instagram — trabalho incrível com [especialidade] aqui em Palmas. Posso te fazer uma pergunta rápida?"

**Msg 2 — diagnóstico** (depois que ele responder "pode/claro"):
"Quando um cliente novo te encontra online, como ele chega até você? Tem página profissional ou vem tudo pelo Instagram e indicação mesmo?"

**Msg 3A — se ele disser "só Instagram" ou "indicação"**:
"Entendi. Isso é exatamente o que eu resolvo. A gente cria uma LP profissional pra você aparecer quando alguém pesquisa '[profissão] em Palmas' no Google. E dentro da página já tem sistema de agendamento — o cliente escolhe dia e horário sozinho. Chega de 'tem horário amanhã?' às 23h."

**Msg 3B — se ele disser "tenho site/página"**:
"Que legal! Qual é o link? Quero dar uma olhada." (se a página for fraca = refazer; se for boa = próximo da lista)

**Msg 4 — fechamento pra consultoria**:
"Posso te mostrar como fica na prática em 20 minutos. Qual é melhor pra você: Quinta (15h)? Sexta (14h)? Segunda (10h)?"
→ SEMPRE 3 opções com dia e hora concretos. NUNCA "quando você puder".

## Quebra de objeções — respostas exatas

**"Já tenho Instagram, não preciso de site"** →
"Instagram não aparece no Google quando alguém pesquisa '[profissão] em Palmas'. LP sim. E com o link da bio apontando pra LP, o Instagram passa a converter também."

**"Quanto custa?"** →
"R$499 e entrego em até 7 dias. Em 20 min de conversa você já vê exatamente como fica." (nunca revelar preço antes dessa objeção)

**"Vou pensar"** →
"Claro. Mas olha: estou com 3 vagas em abril. Posso segurar a sua até quinta-feira?" (sempre com escassez real e deadline)

**"Não tenho dinheiro agora"** →
"Tranquilo. Sem problema mesmo. Fica com meu contato — quando estiver no momento certo, me chama 👊" (nunca insistir, mantém a porta aberta)

## Follow-up pós-consultoria (timeline oficial)
- **Dia 1**: Consultoria realizada
- **Dia 3**: "Ficou com alguma dúvida da nossa conversa?"
- **Dia 5**: "Suas 3 vagas de abril tão acabando rápido. Quer fechar ou deixa pra maio?"
- **Dia 7**: "Última mensagem desse mês: vagas de abril saem hoje."
- **Dia 10+**: Mute por 30 dias, depois reaborda

## Regras adicionais
- Nunca mandar link de case (evsuplementosinjetaveis.com, criativosdoceu.com) no 1º contato. Só na consultoria ou quando pedirem.
- Follow-up para status "abordado/sem resposta": trocar ângulo, não repetir mensagem 1
- Status "vou_pensar" → follow-up em 3 dias com escassez (3 vagas abril)
- Status "sem_interesse" + "sem dinheiro" → nunca insistir, mute 30 dias`

// ── Instância do cliente ──────────────────────────────────────────────────────

function getClient() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY não configurada no .env.local')
  return new GoogleGenerativeAI(key)
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type DadosLead = {
  nome: string
  categoria: string
  tipo: 'lp' | 'shopify' | 'agendapro'
  telefone?: string | null
  instagram?: string | null
  instagram_bio?: string | null
  instagram_seguidores?: string | null
  site?: string | null
  nota?: number | null
  num_avaliacoes?: number | null
  tem_site?: boolean
  tem_ecommerce?: boolean
  tem_agendamento?: boolean
  fonte?: string
  endereco?: string | null
}

export type RespostaAgente = {
  mensagem: string       // mensagem de abordagem pronta para WhatsApp
  diagnostico: string    // análise estratégica do negócio
  argumento: string      // principal argumento de venda para esse lead
  urgencia: string       // por que esse lead é oportunidade agora
}

export type DiagnosticoNegocio = {
  dor_central: string        // a dor número 1 desse negócio AGORA (específico, não genérico)
  custo_da_dor: string       // o que essa dor está custando: tempo, dinheiro, clientes perdidos
  produto_ideal: 'lp' | 'shopify' | 'agendapro'
  por_que_esse_produto: string  // raciocínio direto: por que ESTE produto resolve esta dor
  argumento_cirurgico: string   // a frase mais poderosa para usar no pitch — impacto máximo
  gatilho: string               // medo de perder, desejo de ganhar ou prova social?
  mensagem_impacto: string      // mensagem de abordagem reformulada com a dor no centro
}

// ── Funções principais ────────────────────────────────────────────────────────

/**
 * Gera mensagem de abordagem personalizada + diagnóstico estratégico
 */
export async function gerarAbordagem(lead: DadosLead): Promise<RespostaAgente> {
  const genAI  = getClient()
  const model  = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const produto = lead.tipo === 'lp'
    ? 'Landing Page (R$499)'
    : lead.tipo === 'shopify'
      ? 'Loja Shopify (a partir de R$599)'
      : 'AgendaPRO (R$67/mês)'

  const semSite   = !lead.tem_site
  const semAgenda = !lead.tem_agendamento
  const notaAlta  = (lead.nota ?? 0) >= 4.5
  const muitasAval = (lead.num_avaliacoes ?? 0) >= 30
  const temIG     = !!lead.instagram
  const bioIG     = lead.instagram_bio ?? ''

  const prompt = `Você é um vendedor afiado da Impulso Digital. Precisa gerar uma abordagem CIRÚRGICA para este lead — nada genérico.

## Lead em análise
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Produto que vamos oferecer: ${produto}
- Instagram: ${lead.instagram ?? 'não tem'} ${bioIG ? `| Bio: "${bioIG}"` : ''}
- Seguidores: ${lead.instagram_seguidores ?? '?'}
- Site: ${lead.site ?? 'NÃO TEM SITE'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : '(sem avaliações)'}
- Tem sistema de agendamento: ${lead.tem_agendamento ? 'sim' : 'NÃO TEM'}
- Endereço: ${lead.endereco ?? 'Palmas-TO'}

## Contexto de oportunidade
${semSite ? `→ NÃO TEM SITE: clientes que pesquisam no Google não encontram nada profissional` : ''}
${semAgenda ? `→ SEM AGENDAMENTO ONLINE: provavelmente perde tempo confirmando horário no WhatsApp` : ''}
${notaAlta ? `→ NOTA ${lead.nota} NO GOOGLE: negócio consolidado com boa reputação — merece presença digital à altura` : ''}
${muitasAval ? `→ ${lead.num_avaliacoes} AVALIAÇÕES: negócio movimentado, mas sem estrutura digital para converter esse tráfego` : ''}
${temIG ? `→ TEM INSTAGRAM ATIVO: já tem audiência, só falta converter para clientes reais` : ''}

## O que a mensagem PRECISA fazer
1. Mencionar algo REAL e ESPECÍFICO desse negócio (nota, categoria, algo da bio)
2. A pergunta final deve fazer o prospect pensar "nossa, ele acertou na mosca"
3. Não revelar produto, não listar benefícios — apenas despertar curiosidade
4. Soar como mensagem de alguém que fez o dever de casa, não spam

## Retorne EXATAMENTE neste JSON (sem markdown):
{
  "mensagem": "<mensagem WhatsApp — máx 4 linhas, específica, termina com pergunta que dói>",
  "diagnostico": "<3 linhas: o que esse negócio tem de bom, onde está sangrando digitalmente, o perfil real do dono>",
  "argumento": "<1 frase: o argumento mais forte para fechar — baseado na DOR específica desse negócio>",
  "urgencia": "<1 frase concreta: por que agir AGORA — concorrência, sazonalidade, crescimento do segmento>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim()

  // Limpa possível markdown do Gemini
  const json = texto.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()

  try {
    return JSON.parse(json) as RespostaAgente
  } catch {
    // Fallback se o JSON vier malformado
    return {
      mensagem:    texto,
      diagnostico: 'Análise não disponível',
      argumento:   'Verificar manualmente',
      urgencia:    'A definir',
    }
  }
}

/**
 * Diagnóstico profundo do negócio — identifica dor real e triangula produto ideal
 */
export async function diagnosticarNegocio(lead: DadosLead): Promise<DiagnosticoNegocio> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const prompt = `Faça um diagnóstico CIRÚRGICO deste negócio local de Palmas-TO.

## Dados disponíveis
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Instagram: ${lead.instagram ?? 'não tem'} ${lead.instagram_bio ? `| Bio: "${lead.instagram_bio}"` : ''}
- Seguidores: ${lead.instagram_seguidores ?? 'desconhecido'}
- Site: ${lead.site ? 'tem site' : 'NÃO TEM SITE'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : ''}
- Tem e-commerce: ${lead.tem_ecommerce ? 'sim' : 'não'}
- Tem agendamento online: ${lead.tem_agendamento ? 'sim' : 'não'}

## Nossos 3 produtos
1. **Landing Page R$499** — para quem não tem site ou tem site amador. Aparece no Google, converte visitante em cliente.
2. **Loja Shopify a partir de R$599** — para quem vende produto físico só pelo Instagram/WhatsApp e quer uma loja real.
3. **AgendaPRO R$67/mês** — para barbearia, salão, clínica, personal, psicólogo, dentista. Cliente agenda sozinho, sem WhatsApp.

## Sua missão
Identifique com precisão cirúrgica:
- Qual é a DOR NÚMERO 1 desse negócio? (não genérico — específico para essa categoria e situação)
- O que essa dor está custando CONCRETAMENTE? (clientes perdidos, horas gastas, dinheiro deixado na mesa)
- Qual dos 3 produtos resolve melhor essa dor e POR QUÊ?
- Qual seria a frase mais poderosa para usar no pitch de vendas?

Retorne EXATAMENTE neste JSON (sem markdown):
{
  "dor_central": "<a dor número 1 desse negócio AGORA — específica, concreta, não genérica>",
  "custo_da_dor": "<o que essa dor está custando — seja concreto: 'X horas por dia', 'clientes que não voltam', 'concorrente que aparece no Google'>",
  "produto_ideal": "<lp | shopify | agendapro>",
  "por_que_esse_produto": "<raciocínio direto: como ESTE produto elimina ESTA dor específica — 2 frases>",
  "argumento_cirurgico": "<a frase mais poderosa para usar no pitch — deve fazer o prospect pensar 'é exatamente isso'>",
  "gatilho": "<medo_de_perder | desejo_de_ganhar | prova_social — qual gatilho usar com esse tipo de negócio>",
  "mensagem_impacto": "<mensagem de WhatsApp reformulada com a dor no centro — máx 4 linhas, termina com pergunta que dói>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    const data = JSON.parse(texto)
    // Normaliza o produto_ideal
    const produtoValido = ['lp', 'shopify', 'agendapro'].includes(data.produto_ideal)
      ? data.produto_ideal
      : lead.tipo
    return { ...data, produto_ideal: produtoValido }
  } catch {
    return {
      dor_central:         'Negócio sem presença digital estruturada',
      custo_da_dor:        'Clientes que procuram online não encontram o negócio',
      produto_ideal:       lead.tipo,
      por_que_esse_produto: 'Presença digital resolve o problema de visibilidade',
      argumento_cirurgico: 'Enquanto você não aparece no Google, seu concorrente aparece',
      gatilho:             'medo_de_perder',
      mensagem_impacto:    `Oi ${lead.nome}, vi seu negócio no Google. Você recebe clientes novos pela internet ou só por indicação?`,
    }
  }
}

/**
 * Analisa o conteúdo de um site/LP e dá um parecer estratégico
 */
export type AnaliseSite = {
  converte: string      // O site converte bem ou não?
  pontos_fracos: string // Os 2 maiores problemas
  argumento: string     // Argumento de venda direto
  urgencia: number      // 1-5
  urgencia_motivo: string
  nota: number          // 0-10
}

export async function analisarConteudoSite(url: string, conteudo: string, nome: string): Promise<AnaliseSite> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const prompt = `Você está analisando o site atual de um prospect chamado "${nome}" (${url}).
Nosso objetivo é vender uma Landing Page profissional por R$499 para substituir ou melhorar esse site.

## Conteúdo extraído da página:
${conteudo.slice(0, 4000)}

## Indicadores para avaliar:
- Tem CTA claro (botão de contato, WhatsApp, agendamento)?
- Carrega rápido (site leve ou cheio de imagens pesadas)?
- Aparece no Google (tem título/descrição otimizados)?
- Tem prova social (depoimentos, cases, fotos reais)?
- Design profissional ou amador?
- Mobile friendly?

Retorne EXATAMENTE este JSON (sem markdown):
{
  "converte": "<1 frase: sim/não e por quê>",
  "pontos_fracos": "<2 pontos fracos principais separados por ';'>",
  "argumento": "<1 frase direta para usar no pitch de vendas>",
  "urgencia": <número 1 a 5>,
  "urgencia_motivo": "<por que é urgente ou não em 1 frase>",
  "nota": <nota geral do site de 0 a 10>
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    return JSON.parse(texto) as AnaliseSite
  } catch {
    return {
      converte: 'Análise não disponível',
      pontos_fracos: 'Verificar manualmente',
      argumento: 'Visitar o site e analisar',
      urgencia: 3,
      urgencia_motivo: 'A definir',
      nota: 5,
    }
  }
}

/**
 * Calcula score inteligente 0-10 com justificativa via IA
 */
export async function calcularScoreIA(lead: DadosLead): Promise<{ score: number; justificativa: string }> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const prompt = `Avalie o potencial de venda deste lead para o produto ${lead.tipo === 'lp' ? 'Landing Page (R$499)' : lead.tipo === 'shopify' ? 'Shopify (a partir de R$599)' : 'AgendaPRO (R$67/mês)'}.

Dados do lead:
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Telefone: ${lead.telefone ?? 'não encontrado'}
- Instagram: ${lead.instagram ?? 'não tem'} (${lead.instagram_seguidores ?? '?'} seguidores)
- Bio Instagram: ${lead.instagram_bio ?? 'não disponível'}
- Tem site: ${lead.tem_site ? 'sim' : 'não'}
- Tem e-commerce: ${lead.tem_ecommerce ? 'sim' : 'não'}
- Tem agendamento online: ${lead.tem_agendamento ? 'sim' : 'não'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : ''}

Responda EXATAMENTE neste JSON (sem markdown):
{
  "score": <número de 0 a 10>,
  "justificativa": "<2 linhas explicando o score — o que torna esse lead quente ou frio para esse produto específico>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    const data = JSON.parse(texto)
    return { score: Math.min(10, Math.max(0, Number(data.score))), justificativa: data.justificativa }
  } catch {
    return { score: 5, justificativa: 'Análise não disponível' }
  }
}

/**
 * Gera mensagem de follow-up personalizada com base no histórico do lead
 */
export type RespostaFollowup = {
  mensagem: string        // próxima mensagem para enviar no WhatsApp
  quando: string          // quando enviar (ex: "Amanhã às 10h", "Em 3 dias")
  dias: number            // dias a partir de hoje para o próximo contato
  angulo: string          // ângulo/abordagem desta etapa
}

export async function gerarFollowup(lead: DadosLead & {
  status: string
  mensagem_enviada?: string | null
  notas?: string | null
}): Promise<RespostaFollowup> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const statusLabel: Record<string, string> = {
    novo:                'ainda não foi abordado',
    abordado:            'já recebeu a primeira mensagem mas não respondeu',
    respondeu:           'respondeu, está em contato',
    consultoria_marcada: 'consultoria marcada',
    consultoria_feita:   'consultoria já foi feita',
    proposta_enviada:    'proposta enviada, aguardando decisão',
    fechado:             'fechou negócio',
    sem_interesse:       'disse que não tem interesse',
  }

  const produto = lead.tipo === 'lp'
    ? 'Landing Page (R$499)'
    : lead.tipo === 'shopify'
      ? 'Loja Shopify (a partir de R$599)'
      : 'AgendaPRO (R$67/mês)'

  const prompt = `Você precisa gerar a próxima mensagem de follow-up para este lead.

## Dados do lead
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Produto alvo: ${produto}
- Status atual: ${statusLabel[lead.status] ?? lead.status}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : ''}
- Seguidores Instagram: ${lead.instagram_seguidores ?? 'desconhecido'}

## Histórico
- Primeira mensagem enviada: ${lead.mensagem_enviada ? `"${lead.mensagem_enviada}"` : 'não enviada ainda'}
- Anotações: ${lead.notas ?? 'nenhuma'}

## Regras para o follow-up
- Não repetir o mesmo ângulo da primeira mensagem
- Trazer algo novo: uma dor diferente, um resultado de cliente, uma pergunta direta
- Máximo 3 linhas, termina com pergunta curta
- Não revelar preço ainda (exceto se status for proposta_enviada)
- Se o lead disse que vai pensar: follow-up em 3 dias com prova social
- Se o lead não respondeu: follow-up em 2 dias com ângulo diferente
- Se a consultoria foi feita: follow-up com proposta clara em 1 dia

Responda EXATAMENTE neste JSON (sem markdown):
{
  "mensagem": "<próxima mensagem de WhatsApp — máximo 3 linhas, termina com pergunta>",
  "quando": "<quando enviar, ex: 'Amanhã de manhã', 'Em 2 dias', 'Esta semana'>",
  "dias": <número de dias a partir de hoje para enviar>,
  "angulo": "<qual ângulo/abordagem está usando neste follow-up em 1 frase>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    const data = JSON.parse(texto)
    return {
      mensagem: data.mensagem,
      quando:   data.quando ?? 'Em 2 dias',
      dias:     Math.max(1, Math.min(30, Number(data.dias) || 2)),
      angulo:   data.angulo ?? 'Follow-up padrão',
    }
  } catch {
    return {
      mensagem: 'Oi, tudo bem? Queria saber se teve chance de pensar no que conversamos.',
      quando:   'Em 2 dias',
      dias:     2,
      angulo:   'Retomada simples',
    }
  }
}

/**
 * Ranqueia os leads e decide quais prospectar hoje
 */
export type PrioridadeHoje = {
  lead_id: number
  prioridade: number   // 1 = mais urgente
  motivo: string       // por que esse lead hoje especificamente
  acao: string         // o que fazer: "Primeira abordagem", "Follow-up", "Fechar proposta"
}

export async function gerarPlanoHoje(leads: (DadosLead & {
  id: number
  status: string
  score: number
  proximo_followup?: string | null
  mensagem?: string | null
})[]): Promise<PrioridadeHoje[]> {
  if (leads.length === 0) return []

  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const hoje = new Date().toISOString().split('T')[0]

  const resumo = leads.slice(0, 30).map(l => ({
    id: l.id,
    nome: l.nome,
    categoria: l.categoria,
    tipo: l.tipo,
    status: l.status,
    score: l.score,
    nota: l.nota,
    telefone: !!l.telefone,
    instagram: !!l.instagram,
    followup: l.proximo_followup,
    vencido: l.proximo_followup ? l.proximo_followup < hoje : false,
  }))

  const prompt = `Hoje é ${hoje}. Analise estes leads e decida quais 5 devemos contatar HOJE, em ordem de prioridade.

## Lista de leads disponíveis:
${JSON.stringify(resumo, null, 2)}

## Critérios de priorização:
1. Follow-up vencido (data já passou) → ação imediata
2. Score alto (≥7) com telefone disponível → oportunidade quente
3. Leads em "respondeu" ou "consultoria_feita" → prontos para avançar no funil
4. Leads novos com nota Google alta (≥4.5) e telefone → primeira abordagem vale a pena
5. AgendaPRO para barbearias/salões/clínicas → recorrente, vale priorizar

Retorne EXATAMENTE este JSON (sem markdown) com os 5 leads mais prioritários:
[
  {
    "lead_id": <id do lead>,
    "prioridade": <1 a 5, 1 é mais urgente>,
    "motivo": "<por que esse lead HOJE — 1 frase específica>",
    "acao": "<o que fazer: 'Primeira abordagem', 'Follow-up', 'Fechar proposta', 'Enviar contrato'>"
  }
]`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    return JSON.parse(texto) as PrioridadeHoje[]
  } catch {
    // Fallback: ranqueia localmente pelos dados mais óbvios
    return leads
      .filter(l => l.status !== 'fechado' && l.status !== 'sem_interesse')
      .sort((a, b) => {
        const aVencido = a.proximo_followup && a.proximo_followup < hoje ? 1 : 0
        const bVencido = b.proximo_followup && b.proximo_followup < hoje ? 1 : 0
        return (bVencido - aVencido) || ((b.score ?? 0) - (a.score ?? 0))
      })
      .slice(0, 5)
      .map((l, i) => ({
        lead_id:    l.id,
        prioridade: i + 1,
        motivo:     l.proximo_followup && l.proximo_followup < hoje
          ? 'Follow-up vencido — não deixar esfriar'
          : `Score ${l.score}/10 — lead qualificado`,
        acao: l.status === 'novo' ? 'Primeira abordagem' : 'Follow-up',
      }))
  }
}

// ── Script completo de vendas (playbook do card) ─────────────────────────────

export type ScriptCompleto = {
  abordagem:         string   // Msg 1 — abertura WhatsApp curta e específica
  diagnostico_msg:   string   // Msg 2 — pergunta que puxa a dor
  apresentacao: {
    se_so_instagram:  string  // pitch A
    se_tem_site:      string  // pitch B
    se_tem_sistema:   string  // pitch C (se aplicável, senão cópia de A)
  }
  dor: {
    titulo:           string  // headline da dor nº1 desse negócio
    detalhes:         string  // 2-3 linhas explicando a dor com dados reais do lead
  }
  resolucao:          string  // como o produto resolve ESSA dor específica, 2-3 linhas
  arma_de_vendas: {
    titulo:           string  // ex: "Entrega no mesmo dia via motoboy"
    argumento:        string  // por que ESTE gancho vira arma letal pra este lead
  }
  ancoragem_preco: {
    concorrencia:     string  // ex: "Agência R$3-5k · freela Fiverr R$1-2k"
    nosso_preco:      string  // ex: "R$499 com hospedagem vitalícia"
    frase_pronta:     string  // frase pra jogar antes de revelar preço
  }
  prova_social: {
    case_sugerido:    string  // 'ev_suplementos' | 'criativos_do_ceu'
    frase_intro:      string  // como introduzir o case na conversa
  }
  objecoes: {
    ja_tenho_instagram: string
    quanto_custa:       string
    vou_pensar:         string
    sem_dinheiro:       string
  }
  fechamento:         string  // Msg 4 — 3 horários concretos
  followup_timeline: Array<{ dia: number; mensagem: string }>
}

export async function gerarScriptCompleto(lead: DadosLead): Promise<ScriptCompleto> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const produto = lead.tipo === 'lp'
    ? 'Landing Page (R$499)'
    : lead.tipo === 'shopify'
      ? 'Loja Shopify (a partir de R$599)'
      : 'AgendaPRO (R$67/mês)'

  const prompt = `Monte um PLAYBOOK COMPLETO DE VENDAS pra este lead. Tudo personalizado — nada genérico.

## Lead em análise
- Nome: ${lead.nome}
- Categoria: ${lead.categoria}
- Produto alvo: ${produto}
- Instagram: ${lead.instagram ?? 'não tem'} ${lead.instagram_bio ? `| Bio: "${lead.instagram_bio}"` : ''}
- Seguidores: ${lead.instagram_seguidores ?? '?'}
- Site: ${lead.site ?? 'NÃO TEM SITE'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} avaliações)` : ''}
- Tem e-commerce: ${lead.tem_ecommerce ? 'sim' : 'não'}
- Tem agendamento online: ${lead.tem_agendamento ? 'sim' : 'não'}

## Regras não-negociáveis
- Cite dados REAIS do lead (nota, seguidores, categoria, bio)
- Resoluções e argumentos devem usar os GANCHOS específicos do produto (revise o SYSTEM_PROMPT)
- Arma de vendas: pegar o gancho MAIS LETAL pro segmento do lead (ex: confeitaria → motoboy entrega hoje; nutri → blog SEO; barbearia → lista de espera + badge Google)
- Ancoragem: referências reais de mercado — agência R$3-5k, freela Fiverr R$1-2k, manutenção de site R$100-300/mês
- Prova social: escolha 'ev_suplementos' para saúde/estética/nutri; 'criativos_do_ceu' para serviço/digital/comércio variado
- Objeções: use o script oficial exato do SYSTEM_PROMPT
- Fechamento: SEMPRE 3 horários concretos (Quinta/Sexta/Segunda com horário)
- Follow-up timeline: dias 3, 5, 7 e 30 com mensagem pronta pra cada dia

## Retorne EXATAMENTE neste JSON (sem markdown, sem comentários):
{
  "abordagem": "<Msg 1: oi + menção específica ao lead + uma pergunta — máx 4 linhas>",
  "diagnostico_msg": "<Msg 2: pergunta de diagnóstico — máx 3 linhas>",
  "apresentacao": {
    "se_so_instagram": "<pitch se ele disser 'só Instagram/indicação' — 4-5 linhas com ganchos do produto>",
    "se_tem_site": "<pitch se ele disser 'tenho site' — começa pedindo o link, depois ataca fraqueza provável>",
    "se_tem_sistema": "<pitch se ele disser 'já tenho sistema' — foca em diferencial nosso>"
  },
  "dor": {
    "titulo": "<headline da dor nº1 — ex: 'Você perde 40% das vendas respondendo frete pelo WhatsApp'>",
    "detalhes": "<2-3 linhas com dados do lead>"
  },
  "resolucao": "<2-3 linhas: como NOSSO produto elimina essa dor, usando ganchos concretos>",
  "arma_de_vendas": {
    "titulo": "<nome do gancho letal — ex: 'Selo entrega hoje via motoboy'>",
    "argumento": "<2-3 linhas: por que este gancho vira arma pra ESTE lead específico — cite exemplo concreto do dia a dia do negócio dele>"
  },
  "ancoragem_preco": {
    "concorrencia": "<ex: 'Agência local Palmas: R$3-5k · Freela Fiverr: R$1-2k · Manutenção anual site comum: R$1,2k/ano'>",
    "nosso_preco": "<ex: 'R$499 com hospedagem vitalícia inclusa — zero mensalidade'>",
    "frase_pronta": "<frase exata pra jogar ANTES de revelar preço — monta a âncora>"
  },
  "prova_social": {
    "case_sugerido": "<ev_suplementos | criativos_do_ceu>",
    "frase_intro": "<frase pronta pra introduzir o case na conversa — sem mandar link>"
  },
  "objecoes": {
    "ja_tenho_instagram": "<resposta exata>",
    "quanto_custa": "<resposta exata>",
    "vou_pensar": "<resposta exata com escassez real>",
    "sem_dinheiro": "<resposta exata — nunca insistir>"
  },
  "fechamento": "<Msg 4: 3 horários concretos com dia e hora>",
  "followup_timeline": [
    { "dia": 3,  "mensagem": "<mensagem pro dia 3 — pergunta sobre dúvidas>" },
    { "dia": 5,  "mensagem": "<mensagem pro dia 5 — escassez>" },
    { "dia": 7,  "mensagem": "<mensagem pro dia 7 — última do mês>" },
    { "dia": 30, "mensagem": "<reabordagem — ângulo novo>" }
  ]
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    return JSON.parse(texto) as ScriptCompleto
  } catch {
    throw new Error('Gemini retornou JSON inválido')
  }
}

// ── Termômetro do lead ────────────────────────────────────────────────────────

export type Termometro = {
  nivel: 'quente' | 'morno' | 'frio'
  emoji: string
  motivo: string           // 1 linha explicando a classificação
  acao_sugerida: string    // próxima ação concreta
}

export async function classificarTermometro(lead: DadosLead & {
  status?: string
  mensagem?: string | null
  notas?: string | null
  proximo_followup?: string | null
  atualizado_em?: string | null
}): Promise<Termometro> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const prompt = `Classifique a temperatura deste lead baseado no histórico e decida a próxima ação.

## Lead
- Nome: ${lead.nome}
- Status atual: ${lead.status ?? 'novo'}
- Score: ${(lead as any).score ?? '?'}
- Nota Google: ${lead.nota ?? 'sem nota'} ${lead.num_avaliacoes ? `(${lead.num_avaliacoes} aval)` : ''}
- Tem Instagram: ${lead.instagram ? 'sim' : 'não'}
- Tem site: ${lead.tem_site ? 'sim' : 'não'}
- Última mensagem enviada: ${lead.mensagem ? `"${lead.mensagem.slice(0, 200)}"` : 'nenhuma'}
- Anotações (respostas/notas do vendedor): ${lead.notas ?? 'nenhuma'}
- Próximo follow-up agendado: ${lead.proximo_followup ?? 'nenhum'}

## Critérios
- QUENTE 🔥: perguntou preço, pediu exemplo, aceitou horário, mandou áudio, tá fazendo perguntas específicas, status 'consultoria_marcada' ou 'consultoria_feita' ou 'respondeu' engajado. Ação: MANDAR PROPOSTA HOJE / FECHAR.
- MORNO 🟡: respondeu curto, engajou mas não avançou, status 'respondeu' sem progresso, follow-up já feito 1x. Ação: MUDAR ÂNGULO + escassez em 2 dias.
- FRIO ❄️: não respondeu 2+ dias, disse 'vou pensar' sem avançar, 'sem dinheiro', status 'sem_interesse', score baixo sem engajamento. Ação: MUTE 30 DIAS ou última tentativa.
- NOVO (sem interação): se status = 'novo' e nenhuma mensagem enviada → considere MORNO com ação "primeira abordagem hoje".

Retorne EXATAMENTE este JSON (sem markdown):
{
  "nivel": "<quente | morno | frio>",
  "emoji": "<🔥 | 🟡 | ❄️>",
  "motivo": "<1 frase explicando por que essa classificação — cite sinal concreto>",
  "acao_sugerida": "<ação concreta: 'Mandar proposta agora', 'Follow-up com case em 2 dias', 'Mute 30d', 'Primeira abordagem hoje'>"
}`

  const result = await model.generateContent(prompt)
  const texto  = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')

  try {
    const data = JSON.parse(texto) as Termometro
    return data
  } catch {
    return {
      nivel:         'morno',
      emoji:         '🟡',
      motivo:        'Classificação automática indisponível',
      acao_sugerida: 'Revisar manualmente',
    }
  }
}

/**
 * Responde perguntas livres sobre prospecção/vendas no contexto da Impulso Digital
 */
export async function chat(historico: { role: 'user' | 'model'; text: string }[], pergunta: string): Promise<string> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const chatSession = model.startChat({
    history: historico.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
  })

  const result = await chatSession.sendMessage(pergunta)
  return result.response.text()
}
