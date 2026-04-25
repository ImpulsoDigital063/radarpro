// Gerador de mensagens personalizadas para cada tipo de prospect
//
// Calibração 25/04/2026 baseada em pesquisa de benchmarks 2025-2026:
// - Pitch <80 palavras (Instantly 2026: short bate long em reply rate)
// - Bônus stack categorizado em 4 tipos Hormozi (AMPLIA/ACELERA/REMOVE ESFORÇO/REMOVE RISCO)
// - 3 pontos de ancoragem (agência + Fiverr + DIY) — não 2
// - Fechamento com Risk-Mitigation Close (Klaff) — "protótipo da TUA loja no ar"
// - Follow-up automático pra "tenho site" (script depois do link)
// - UrbanFeet preservado SÓ em Shopify (não cabe em LP de psicólogo/advogado)

export function gerarMensagemLP(nome: string, especialidade: string): string {
  const primeiroNome = nome.split(' ')[0]
  return `Olá ${primeiroNome}! 👋

Vi seu perfil no Instagram — você tem um trabalho incrível com ${especialidade} aqui em Palmas.

Posso te fazer uma pergunta rápida?`
}

export function gerarMensagemShopify(nome: string, categoria: string): string {
  const primeiroNome = nome.split(' ')[0]
  return `Olá ${primeiroNome}! 👋

Vi que você tem uma ${categoria} bem legal aqui em Palmas.

Posso te fazer uma pergunta rápida?`
}

export function gerarMensagemAgendaPRO(nome: string, categoria: string): string {
  const primeiroNome = nome.split(' ')[0]
  return `Olá ${primeiroNome}! 👋

Vi que você tem uma ${categoria} aqui em Palmas.

Posso te fazer uma pergunta rápida?`
}

// ── Script de abordagem WhatsApp (4 mensagens em sequência) ──────────────────
// Padrão validado em 14/04/2026 — nunca disparar tudo junto, uma de cada vez

export type ScriptAbordagem = {
  abertura:                 string                    // msg 1 — abertura genérica (substituída por aberturas customizadas em disparo-analises pros 14 priorizados)
  diagnosticos:             [string, string, string]  // msg 2 — A/B/C rotação por hash do telefone
  pitch_se_so_ig:           string                    // msg 3A — se disser "só Instagram/indicação"
  pitch_se_tem_site:        string                    // msg 3B — se disser "tenho site/página" (1ª resposta, pede o link)
  pitch_se_tem_site_resposta?: string                 // msg 3B-cont — depois que ele manda o link, mensagem com diagnóstico
  fechamento:               string                    // msg 4 — 3 horários concretos + Risk-Mitigation
  call_alinhamento?:        string                    // arma de fechamento pra lead com objeção
}

export function scriptAbordagemLP(nome: string, especialidade: string): ScriptAbordagem {
  const esp = especialidade.toLowerCase()
  return {
    abertura: gerarMensagemLP(nome, especialidade),
    diagnosticos: [
      // A — Espelho: mostra o buraco no Google
      `Posso te perguntar uma coisa?\n\nAgora, se alguém digitar "${especialidade} em Palmas" no Google, você aparece?\n\nOu só seu Insta, que o Google nem indexa direito?`,
      // B — Indicação vs Google (calibrated question OURO)
      `Último cliente novo que apareceu — veio de indicação, ou foi alguém que te achou sozinho pesquisando?\n\nPergunto porque a diferença aí é tudo.`,
      // C — Autoridade: dói onde o ego mora
      `Quando o cliente pede "me manda seu site", o que você responde hoje?\n\nPorque eu vejo muito ${esp} perder cliente só por não ter um link profissional pra mandar.`,
    ],
    // PITCH "SÓ INSTAGRAM" — calibrado <80 palavras + 4 bônus + 3 ancoragens
    pitch_se_so_ig: `Entendi. Vou direto ao ponto.

LP profissional + SEO local + 3 artigos no blog + WhatsApp em 1 clique. Valor de mercado: R$2.500.

*Bônus stack:*
🔥 AMPLIA — 3 artigos SEO ranqueando "${especialidade} em Palmas"
⚡ ACELERA — entrega em 7 dias (mercado faz em 30-60)
🪶 REMOVE ESFORÇO — call de 20 min e tu sai com protótipo Next.js no ar
🛡 REMOVE RISCO — hospedagem vitalícia + garantia de 7 dias

*Mercado:*
• Agência Palmas: R$1.500-3.000 + mensalidade
• Fiverr: R$800-1.200 sem SEO/blog/hospedagem
• Wix DIY: R$0 mas tu paga 40h tuas + zero suporte

*Meu preço: R$499 uma vez.* Topa ver o protótipo da TUA LP antes de decidir?`,
    pitch_se_tem_site: `Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.`,
    pitch_se_tem_site_resposta: `Vi aqui. 3 pontos honestos pra ti:

1. Mobile carrega em [X]s — Google penaliza acima de 2.5s
2. Aparece pra "${especialidade} em Palmas" no Google?
3. WhatsApp em 1 clique de qualquer página?

Se algum desses tá ruim, em 5 min eu te mostro como ficaria — tela compartilhada. Topa?`,
    // FECHAMENTO calibrado — Risk-Mitigation Close (Klaff): cliente VÊ antes de pagar
    fechamento: `Em 20 minutos eu te mostro o protótipo da TUA LP já no ar — não é mockup, é Next.js funcionando — pra tu sentir antes de decidir.

Qual horário é melhor:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?`,
    call_alinhamento: `Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.

Não é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com ${esp}.

Você sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. *Técnica que fecha 10x mais do que quem mostra só mockup.*

Essa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.`,
  }
}

export function scriptAbordagemShopify(nome: string, categoria: string): ScriptAbordagem {
  return {
    abertura: gerarMensagemShopify(nome, categoria),
    diagnosticos: [
      // A — entrega rápida: cliente palmense compra de fora (dói)
      `Deixa eu te perguntar: cliente de Palmas que quer receber HOJE — ele compra de você, ou compra de loja de SP/RJ que vende aqui pela internet?`,
      // B — gargalo WhatsApp + PIX
      `Hoje, quando cai um pedido, como funciona? Negocia frete, manda PIX, confirma recebimento tudo no WhatsApp na mão?\n\nQuanto tempo isso come por semana?`,
      // C — madrugada / domingo
      `Sábado de noite, domingo de manhã — cliente vê seu produto e quer comprar. Você tá lá pra responder, ou o pedido some até segunda?`,
    ],
    // PITCH SHOPIFY "SÓ INSTAGRAM" — calibrado <80 palavras + 4 bônus + 3 ancoragens
    pitch_se_so_ig: `Entendi. Vou direto ao ponto.

Loja Shopify completa + tema customizado + Mercado Pago (PIX/12x) + Melhor Envio + 20 produtos cadastrados. Valor de mercado: R$3.200.

*Bônus stack:*
🔥 AMPLIA — lista de fornecedores do nicho que mapeei
⚡ ACELERA — Shopify $1/mês nos 3 primeiros meses (testa quase de graça)
🪶 REMOVE ESFORÇO — call de entrega gravada (assiste quando precisar)
🛡 REMOVE RISCO — aprova prévia ou devolvo 100%

*Mercado:*
• Agência Palmas: R$1.500-4.000 + mensalidade
• Fiverr: R$1.200-2.000 sem motoboy/integração local
• Shopify DIY: R$0 mas 60h tuas + zero suporte

*Meu preço: R$599 uma vez.* Em Palmas, cliente paga 10h, recebe 14h por motoboy.

Topa ver o protótipo da TUA loja antes de decidir?`,
    pitch_se_tem_site: `Que legal! Qual é o link? Quero dar uma olhada.`,
    pitch_se_tem_site_resposta: `Vi aqui. 3 pontos honestos pra ti:

1. Checkout tem [X] etapas — cada etapa extra = 15-20% de carrinho abandonado
2. Tem motoboy mesmo dia pra Palmas configurado?
3. Mobile carrega em [X]s — acima de 2.5s, cliente desiste

Se algum desses tá ruim, em 5 min eu te mostro como ficaria 30% mais limpo. Tela compartilhada, topa?`,
    fechamento: `Em 20 minutos eu te mostro o protótipo da TUA loja já no ar — não é mockup, é Shopify funcionando — pra tu sentir antes de decidir.

Qual horário é melhor:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?`,
    call_alinhamento: `Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.

Não é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.

Você sai da call com a loja já alinhada pra rodar: *não é mockup, é Shopify no ar com a sua cara.* A GB Nutrition do Gabriel só ficou única porque a gente sentou antes de codar. *Não começo a produção sem essa call.*`,
  }
}

export function scriptAbordagemAgendaPRO(nome: string, categoria: string): ScriptAbordagem {
  return {
    abertura: gerarMensagemAgendaPRO(nome, categoria),
    diagnosticos: [
      // A — gargalo de marcação + comissão
      `Como funciona a agenda aí hoje? Cliente marca pelo WhatsApp ou você já tem algum sistema?\n\nE no fim do mês — você consegue ver quanto cada profissional te deve de comissão, ou ainda faz na mão?`,
      // B — buraco de cancelamento
      `Deixa eu te perguntar: quando alguém cancela em cima da hora, o que acontece aí?\n\nFica buraco na agenda ou você consegue preencher rápido?`,
      // C — financeiro em tempo real
      `Uma coisa que sempre pergunto: você consegue ver em tempo real quanto cada cadeira faturou no dia?\n\nOu o financeiro só fecha no fim do mês, em planilha na mão?`,
    ],
    pitch_se_so_ig: `Então é exatamente onde a SmartAgenda resolve.

Cliente agenda sozinho pelo link, sem baixar app. Dashboard financeiro em tempo real (cadeira × cadeira). Lista de espera notifica a fila quando cancela — agenda se recompõe sozinha. QR code A5 pro balcão.

*R$47/mês (Plano Solo) + setup R$147.* 7 dias de garantia.

Os 10 primeiros travam esse preço pra sempre (Clube Fundador).`,
    pitch_se_tem_site: `Você já tem sistema de agendamento ou o cliente ainda marca no WhatsApp?\n\nE o financeiro/comissão — o sistema atual te mostra em tempo real quanto cada profissional te deve?`,
    fechamento: `Em 15 minutos eu te mostro a SmartAgenda configurada pro TEU caso — tu testa marcando como cliente, vê dashboard, vê cancelamento na prática.

Qual horário é melhor:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?`,
  }
}

// ── Roteador de ofertas ──────────────────────────────────────────────────────

export type TipoOferta = 'lp-solo' | 'agendapro-solo' | 'combo' | 'shopify-solo'

const CATEGORIAS_PURO_AGENDA = [
  'barbearia', 'salão de beleza', 'salao de beleza',
  'clínica estética', 'clinica estetica',
  'estúdio de tatuagem', 'estudio de tatuagem',
  'massoterapeuta', 'depilação', 'depilacao',
  'cabeleireiro',
]

const CATEGORIAS_COMBO = [
  'nutricionista', 'personal trainer', 'psicólogo', 'psicologo',
  'fisioterapeuta', 'dentista', 'maquiadora', 'fotógrafo', 'fotografo',
  'nail designer', 'sobrancelha', 'designer de sobrancelhas',
  'médico esteta', 'medico esteta', 'esteticista',
  'fonoaudiólogo', 'fonoaudiologo', 'terapeuta',
]

// Categorias que casam com Shopify (FIT estrito após calibração 25/04)
// Cuidado: ordem importa, MATCH usa includes() (parcial). Termos amplos
// como 'loja' não entram aqui — vão pra LP por default.
const CATEGORIAS_SHOPIFY_MATCH = [
  // Moda (foto vende, ticket >R$80, vende pra fora)
  'moda feminina', 'moda masculina', 'moda fitness', 'moda festa', 'moda praia',
  'loja de roupas', 'loja de calçados', 'loja de calcados',
  'loja de acessórios', 'loja de acessorios',
  'lingerie', 'boutique',
  // Joias
  'joalheria', 'semi-joias', 'semi joias', 'semijoias',
  // Saúde/beleza (produto físico)
  'loja de suplementos', 'whey protein', 'suplemento',
  'perfumaria', 'cosméticos', 'cosmeticos', 'skincare', 'maquiagem',
  // Esportivo (Copa timing)
  'loja de artigos esportivos', 'artigos esportivos', 'camisa de time',
  // Nicho
  'loja de artesanato', 'artesanato',
]

// Categorias EXPLICITAMENTE NÃO-FIT pra Shopify — mesmo que apareçam no
// scrape, NÃO entram no funil. Auditoria 25/04 confirmou: tiro perdido.
const CATEGORIAS_NAO_FIT = [
  'papelaria',
  'pet shop', 'petshop',
  'açaí', 'acai', 'sorveteria',
  'café', 'cafe', 'lanchonete',
  'floricultora', 'floricultura', 'floricultor',
  'empório', 'emporio', 'mercado', 'mercadinho',
  'material de construção', 'material de construcao',
  'confeitaria', 'doceria',
  'loja de bebida', 'distribuidora de bebida',
]

export function detectarTipoOferta(categoria: string): TipoOferta {
  const cat = categoria.toLowerCase()

  // Filtro NÃO-FIT primeiro — categorias descartadas em auditoria 25/04
  // (papelaria, açaí, café, floricultora, etc) ainda recebem 'lp-solo'
  // como fallback técnico, mas top-20-perfeitos.ts vai filtrar elas.
  // (Não retornamos 'no-fit' como tipo pra não quebrar contratos
  // existentes — quem usa a função espera um TipoOferta válido.)

  if (CATEGORIAS_SHOPIFY_MATCH.some(c => cat.includes(c))) return 'shopify-solo'

  // AgendaPRO fora do foco de prospecção atual: tudo que não é
  // loja/produto físico vira LP. CATEGORIAS_PURO_AGENDA e CATEGORIAS_COMBO
  // seguem exportadas pra uso em outras telas, mas não roteiam mais.
  return 'lp-solo'
}

// Helper: lead deve ser ignorado na prospecção?
// Usado por scripts/top-20-perfeitos.ts pra filtrar antes de listar.
export function categoriaEhNaoFit(categoria: string): boolean {
  const cat = (categoria ?? '').toLowerCase()
  return CATEGORIAS_NAO_FIT.some(c => cat.includes(c))
}

// Oferta combo — setup AgendaPRO GRÁTIS como gancho da LP
// Só vale pros 10 primeiros que fecham LP com a Impulso (promoção sazonal)
export function scriptAbordagemCombo(nome: string, categoria: string): ScriptAbordagem {
  const esp = categoria.toLowerCase()
  return {
    abertura: gerarMensagemLP(nome, categoria),
    diagnosticos: [
      // A — duplo ataque: Google + agenda
      `Posso te perguntar duas coisas rápidas?\n\n1. Se alguém digitar "${esp} em Palmas" no Google agora, você aparece?\n2. E cliente novo — marca horário pelo WhatsApp ou você já tem algum sistema?`,
      // B — indicação + gargalo
      `Último cliente novo veio de indicação ou te achou sozinho no Google?\n\nE pra marcar horário — é tudo pelo WhatsApp ainda?`,
      // C — site + agenda
      `Quando cliente pede "me manda seu site pra ver os horários", o que você responde?\n\nResponde cada horário na mão no WhatsApp, ou tem um link onde ele marca sozinho?`,
    ],
    pitch_se_so_ig: `Então é perfeito o que eu faço — monto duas coisas que trabalham juntas:

*1. LP profissional* — você aparece no Google quando alguém pesquisa "${esp} em Palmas". Hospedagem vitalícia + 3 artigos SEO. R$499.

*2. SmartAgenda* — cliente agenda sozinho pelo link. Dashboard financeiro em tempo real. Lista de espera preenche cancelamento sozinha. R$47/mês.

*Promoção do combo:* o setup do AgendaPRO (R$147) sai de graça pros 10 primeiros que fecham a LP comigo.

Topa ver os dois rodando antes de decidir?`,
    pitch_se_tem_site: `Que legal! Qual é o link? Quero dar uma olhada.\n\nE pra agenda — você já tem algum sistema onde cliente marca sozinho, ou ainda é tudo pelo WhatsApp?`,
    fechamento: `Em 20 minutos eu te mostro a TUA LP no ar + a SmartAgenda configurada — tu vê os dois funcionando antes de decidir.

Qual horário é melhor:
- Quinta (15h)?
- Sexta (14h)?
- Segunda (10h)?`,
    call_alinhamento: `Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* com a equipe Impulso.

Não é pitch — é pra te conhecer. Sua visão, seus valores, o que te move como ${esp}. É daí que sai o projeto único: LP com a SUA cara, SmartAgenda configurada pro SEU jeito de trabalhar.

Essa call é o que separa entrega Impulso de agência qualquer. *Sem ela eu não começo.*`,
  }
}

// Roteador — olha a categoria do lead e devolve o script com a oferta certa
export function escolherScriptAbordagem(params: {
  nome: string
  categoria: string
}): { tipo: TipoOferta; script: ScriptAbordagem } {
  const tipo = detectarTipoOferta(params.categoria)
  switch (tipo) {
    case 'shopify-solo':
      return { tipo, script: scriptAbordagemShopify(params.nome, params.categoria) }
    case 'combo':
    case 'agendapro-solo':
    case 'lp-solo':
    default:
      return { tipo: 'lp-solo', script: scriptAbordagemLP(params.nome, params.categoria) }
  }
}

// Distribui os 3 diagnósticos 33/33/33 por hash do telefone (determinístico)
// Mesmo lead cai sempre na mesma variante — permite A/B/C tracking real
export function pickDiagnostico(
  script: ScriptAbordagem,
  telefone: string,
): { texto: string; variante: 'A' | 'B' | 'C' } {
  const digits = telefone.replace(/\D/g, '')
  const hash = digits.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const idx = hash % 3
  return {
    texto: script.diagnosticos[idx],
    variante: (['A', 'B', 'C'] as const)[idx],
  }
}

// ── Objeções universais — framework LAER (Listen-Acknowledge-Empathize-Respond)
// Calibrado 25/04/2026 com base em pesquisa de objection handling 2025

export type ObjecaoCalibrada = {
  contexto: string                // quando essa objeção tipicamente aparece
  nota_interna: string            // o que Eduardo deve fazer ANTES de responder (instrução privada)
  acknowledge_label: string       // mirror + label (Voss tactical empathy) — frase calibrada de validação
  resposta: string                // resposta pronta pra mandar no WhatsApp depois do label
}

export const OBJECOES_IMPULSO: Record<string, ObjecaoCalibrada> = {
  ja_tenho_instagram: {
    contexto: 'Lead diz que vende/atende pelo Insta e não precisa de site',
    nota_interna: 'NÃO ataca o Insta. Reconhece que funciona pra quem já segue. Reframe: site capta cliente NOVO que NUNCA ouviu falar.',
    acknowledge_label: 'Faz sentido. Me parece que tu tá vendo o Insta como o canal completo — e ele realmente capta quem já te conhece.',
    resposta: 'Site capta quem ainda NÃO te conhece — quem tá pesquisando "[especialidade] em Palmas" no Google agora e nunca ouviu falar de ti. São dois funis diferentes. Link da bio do Insta apontando pra LP = converte quem veio do Insta também. Soma, não substitui.',
  },
  quanto_custa: {
    contexto: 'Lead pediu o preço diretamente',
    nota_interna: 'NUNCA esconda preço. Manda o número claro e oferece ver o protótipo.',
    acknowledge_label: 'Perfeito, vamo direto.',
    resposta: 'R$499 uma vez. 7 dias de entrega. 7 dias de garantia. Em 20 min eu te mostro o protótipo da TUA LP rodando antes de tu decidir.',
  },
  vou_pensar: {
    contexto: 'Lead recuou após pitch — sinal de objeção escondida',
    nota_interna: 'NÃO pressiona. Pergunta calibrada que descobre o que ele precisa pensar.',
    acknowledge_label: 'Faz sentido. Decisão de site não é compra de impulso.',
    resposta: 'Posso te perguntar uma coisa? O que tu precisa pensar especificamente — preço, prazo, escopo, ou tu quer ver mais um case real antes? Pergunto pra te mandar a coisa certa, não te encher.',
  },
  sem_dinheiro: {
    contexto: 'Lead diz que tá apertado financeiramente',
    nota_interna: 'NÃO insiste. Respeita. Mas mantém porta aberta pra retomar.',
    acknowledge_label: 'Tranquilo. Me parece que esse não é o momento certo pra investir.',
    resposta: 'Sem stress. Fica com meu contato — quando virar prioridade, me chama. Posso te mandar 1 conteúdo grátis sobre [especialidade] no Google enquanto isso, se quiser. Sem pitch.',
  },
  ja_tentei_antes: {
    contexto: 'Lead já tentou site/agência antes e não deu certo (case Jeane / Manisha 25/04)',
    nota_interna: 'NÃO defenda. NUNCA diga "comigo é diferente". Mirror + investigar o que aconteceu antes.',
    acknowledge_label: 'Já tentou e não rolou? Me parece que tu tá com a sensação de que isso não é pra ti — ou foi específico daquele caso?',
    resposta: 'Me conta o que aconteceu da última vez. Quem fez? O que entregaram? Onde travou? Pergunto porque a maioria que me diz isso testou agência genérica que não entendeu o nicho. Se for o teu caso, eu te mostro como evito esse buraco específico — sem prometer nada antes de tu me contar.',
  },
  preciso_falar_com_socio: {
    contexto: 'Decisão envolve outra pessoa (sócio, marido/esposa, gestor)',
    nota_interna: 'Decisão multi-stakeholder = Consensus-Based Close. Facilita reunião com os 2.',
    acknowledge_label: 'Faz total sentido — decisão de R$500+ não se fecha solo.',
    resposta: 'Posso te ajudar a montar a conversa? Posso te apresentar a proposta em 20 min com vocês 2 juntos no WhatsApp ou call — aí ninguém precisa explicar pro outro depois. Quinta às 15h, sexta às 14h ou segunda 10h?',
  },
  agora_nao_da_tempo: {
    contexto: 'Lead alega que tá ocupado / não é hora',
    nota_interna: 'Calibrated question pra descobrir o REAL motivo — "não é prioridade" geralmente é "não vejo valor ainda".',
    acknowledge_label: 'Entendi. Me parece que tu tá numa fase apertada de tempo.',
    resposta: 'Quando tu acha que faria sentido a gente conversar de novo? Pergunto pra eu te chamar no momento certo, não desperdiçar teu tempo agora.',
  },
}

// ── Follow-up timeline (cadência D+3 / D+7 / D+30) ───────────────────────────
// Os follow-ups específicos por lead estão em lib/disparo-analises.ts
// Esses aqui são templates GENÉRICOS pra leads SEM análise customizada

export const FOLLOWUP_TIMELINE = [
  { dia: 3,  mensagem: 'Oi, voltei rapidinho. Pensando: o que eu te mostrei faz sentido pra teu caso, ou é coisa diferente que tu precisa? Sem stress se tu quiser ajustar a direção.' },
  { dia: 7,  mensagem: 'Última mensagem da minha parte. Vou parar de incomodar. Se em algum momento isso te bater, tu sabe onde me achar.' },
  { dia: 30, mensagem: '[reabordagem após mute de 30 dias — usar trigger event ou novidade real]' },
]

// Link direto pro WhatsApp com mensagem pré-preenchida
export function gerarLinkWhatsApp(telefone: string, mensagem: string): string {
  const numero = telefone.replace(/\D/g, '')
  const numeroCompleto = numero.startsWith('55') ? numero : `55${numero}`
  const mensagemEncoded = encodeURIComponent(mensagem)
  return `https://wa.me/${numeroCompleto}?text=${mensagemEncoded}`
}

// Link direto pro Instagram (handle sem @)
export function gerarLinkInstagram(handle: string): string {
  const username = handle.replace(/^@/, '').trim()
  return `https://instagram.com/${username}`
}

// Categorias para LP — profissionais liberais com cliente que PESQUISA antes
// Calibração FIT 25/04/2026: tirei serviços de baixa autoridade (Coach,
// Professor, Personal organizer) — quem fecha LP precisa ter reputação
// construída + cliente pesquisa antes de marcar.
export const CATEGORIAS_LP = [
  // Saúde mental e corporal — paciente pesquisa autoridade antes
  'Nutricionista', 'Psicólogo', 'Fisioterapeuta', 'Fonoaudiólogo',
  'Terapeuta', 'Médico esteta', 'Dentista', 'Podólogo',
  // Estética — nicho injetáveis (Erlane case) é prioridade alta
  'Esteticista', 'Biomédica esteta', 'Designer de sobrancelhas',
  // Especialistas com ticket alto
  'Personal trainer', 'Advogado', 'Arquiteto',
  'Designer de interiores', 'Fotógrafo casamento',
]

// Categorias para Shopify — produto físico que CABE foto + ticket >R$80
// + vende pra fora OU motoboy mesmo dia FAZ DIFERENÇA
//
// Calibração FIT 25/04/2026: tirei papelaria/açaí/café/empório/floricultora
// (negócios LOCAIS sem dor de e-commerce real). Tirei pet shop também
// (cliente vai presencial toda semana). Adicionei nichos quentes.
export const CATEGORIAS_SHOPIFY = [
  // Moda — alta probabilidade, foto vende
  'Loja de roupas', 'Loja de calçados', 'Loja de acessórios',
  'Moda feminina', 'Moda masculina', 'Moda fitness',
  'Moda festa', 'Moda praia', 'Lingerie', 'Boutique',
  // Joias — ticket alto + decisão visual
  'Joalheria', 'Semi-joias',
  // Saúde & Beleza com produto físico
  'Loja de suplementos', 'Perfumaria importada', 'Loja de cosméticos',
  'Skincare', 'Loja de maquiagem',
  // Esportivo — Copa 2026 timing
  'Loja de artigos esportivos', 'Camisa de time',
  // Nicho com ticket ou venda pra fora
  'Loja de artesanato',
]

// Categorias DESCARTADAS (NÃO fit) — não prospectar, não vale tempo
// Mantém aqui pra documentar a decisão e justificar pra quem pergunta
export const CATEGORIAS_NAO_FIT_SHOPIFY = [
  'Papelaria',          // cliente local, ticket baixo
  'Pet shop',           // cliente recorrente presencial (ração)
  'Açaí',               // venda na hora, sem catálogo
  'Sorveteria',         // mesmo problema
  'Café', 'Lanchonete', // venda urgente, sem ticket
  'Floricultora',       // já tem WhatsApp + delivery próprio
  'Empório', 'Mercado', // cliente compra perto de casa
  'Material de construção', // volume + B2B
  'Confeitaria',        // sob encomenda WhatsApp já funciona
  'Loja de bebida',     // restrição legal
]

// Queries para o Google Maps — LP
export const QUERIES_GMAPS_LP = [
  'nutricionista Palmas TO', 'personal trainer Palmas TO',
  'psicólogo Palmas TO', 'fisioterapeuta Palmas TO',
  'dentista estético Palmas TO', 'médico esteta Palmas TO',
  'esteticista Palmas TO', 'fotógrafo Palmas TO',
  'coach Palmas TO', 'maquiadora Palmas TO',
]

// Queries para o Google Maps — Shopify
export const QUERIES_GMAPS_SHOPIFY = [
  'loja de roupas Palmas TO', 'loja de calçados Palmas TO',
  'confeitaria Palmas TO', 'loja de suplementos Palmas TO',
  'pet shop Palmas TO', 'papelaria Palmas TO',
  'joalheria Palmas TO', 'loja de cosméticos Palmas TO',
  'açaí Palmas TO', 'loja de acessórios Palmas TO',
]

// Hashtags Instagram — LP
export const HASHTAGS_INSTAGRAM_LP = [
  'nutricionistapalmas', 'personaltrainerpalmas',
  'psicologopalmas', 'fisioterapeutapalmas',
  'estetistapalmas', 'fotografopalmas',
  'maquiadorapalmas', 'naildesignerpalmas',
  'coachpalmas', 'dentistapalmas',
]

// Hashtags Instagram — Shopify
export const HASHTAGS_INSTAGRAM_SHOPIFY = [
  'modapalmas', 'lojapalmas',
  'confeitariapalmas', 'suplementospalmas',
  'roupaspalmas', 'calcadospalmas',
  'docespalmas', 'petshoppalmas',
  'papelariapamas', 'joiaspalmas',
]

// Categorias para AgendaPRO
export const CATEGORIAS_AGENDAPRO = [
  'Barbearia', 'Salão de beleza', 'Nail designer',
  'Clínica estética', 'Estúdio de tatuagem',
  'Psicólogo', 'Personal trainer', 'Fisioterapeuta',
  'Nutricionista', 'Dentista', 'Massoterapeuta',
  'Depilação', 'Sobrancelha', 'Maquiadora', 'Fotógrafo',
]

// Queries Google Maps — AgendaPRO
export const QUERIES_GMAPS_AGENDAPRO = [
  'barbearia Palmas TO', 'salão de beleza Palmas TO',
  'nail designer Palmas TO', 'clínica estética Palmas TO',
  'estúdio de tatuagem Palmas TO', 'psicólogo Palmas TO',
  'personal trainer Palmas TO', 'fisioterapeuta Palmas TO',
  'massoterapeuta Palmas TO', 'depilação Palmas TO',
]

// Hashtags Instagram — AgendaPRO
export const HASHTAGS_INSTAGRAM_AGENDAPRO = [
  'barbeariapalmas', 'salaodebelezapalmas', 'nailpalmas',
  'esteticapalmas', 'tatuagempalmas', 'psicologopalmas',
  'personalpalmas', 'fisiopalmas', 'massagempalmas', 'depilacaopalmas',
]
