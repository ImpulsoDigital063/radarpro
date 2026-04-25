// Gerador de mensagens personalizadas para cada tipo de prospect

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
  abertura:            string                    // msg 1 — dispara primeiro (já é o gerarMensagem*)
  diagnosticos:        [string, string, string]  // msg 2 — A/B/C rotação por hash do telefone (33/33/33)
  pitch_se_so_ig:      string                    // msg 3A — se disser "só Instagram/indicação"
  pitch_se_tem_site:   string                    // msg 3B — se disser "tenho site/página"
  fechamento:          string                    // msg 4 — 3 opções concretas, nunca "quando puder"
  call_alinhamento?:   string                    // arma de fechamento pra lead hot com objeção ("mas e o meu caso?") — LP/Shopify/Combo. AgendaPRO solo não usa (SaaS padronizado).
}

export function scriptAbordagemLP(nome: string, especialidade: string): ScriptAbordagem {
  const esp = especialidade.toLowerCase()
  return {
    abertura: gerarMensagemLP(nome, especialidade),
    diagnosticos: [
      // A — Espelho: mostra o buraco no Google
      `Posso te perguntar uma coisa?\n\nAgora, se alguém digitar "${especialidade} em Palmas" no Google, você aparece?\n\nOu só seu Insta, que o Google nem indexa direito?`,
      // B — Dependência: força a autoconsciência da indicação
      `Último cliente novo que apareceu — veio de indicação, ou foi alguém que te achou sozinho pesquisando?\n\nPergunto porque a diferença aí é tudo.`,
      // C — Autoridade: dói onde o ego mora
      `Quando o cliente pede "me manda seu site", o que você responde hoje?\n\nPorque eu vejo muito ${esp} perder cliente só por não ter um link profissional pra mandar.`,
    ],
    pitch_se_so_ig: `Entendi. É exatamente onde eu resolvo.\n\nAntes de falar preço, deixa eu te mostrar o que você leva:\n\n→ Página profissional de 8-10 seções (Hero, Dores, Serviços, Prova social, FAQ) — agência cobra R$1.500 por isso\n→ SEO local configurado — você aparece quando alguém pesquisa "${especialidade} em Palmas" no Google (R$500)\n→ Mobile-first de verdade — 80% do cliente abre no celular (R$300)\n→ WhatsApp integrado em toda página — cliente fala com você em 1 clique (R$200)\n\n*Valor de mercado: R$2.500.*\n\nE GRÁTIS empilhado:\n✓ Hospedagem VITALÍCIA — você NUNCA paga mensalidade (R$600-1.200/ano que você não desembolsa pra sempre)\n✓ 3 artigos SEO no blog — tráfego orgânico sem depender de Meta Ads\n\nPra referência de mercado:\n• Agência local Palmas: R$1.500-3.000 + mensalidade\n• Freela Fiverr: R$800-1.200, sem SEO, sem blog, sem hospedagem\n\n*Meu preço: R$499 uma vez.* 7 dias de garantia. Entrega em 7 dias.`,
    pitch_se_tem_site: `Que legal! Me manda o link — em 2 minutos eu te mostro o que ele tá deixando de fazer por você.`,
    fechamento: `Posso te mostrar como fica na prática em 20 minutos.\n\nQual é melhor pra você:\n- Quinta (15h)?\n- Sexta (14h)?\n- Segunda (10h)?`,
    call_alinhamento: `Antes da gente fechar, tem uma etapa do processo: *call de alinhamento* (20 min) com a equipe Impulso.\n\nNão é venda. É um briefing de 8 perguntas pra eu captar sua visão, valores e essência do trabalho com ${esp}.\n\nVocê sai da call com um *protótipo funcional* da sua LP rodando — não mockup estático, é Next.js no ar. Técnica que a equipe validou: fecha 10x mais do que quem mostra só mockup.\n\nEssa call faz parte do processo — não começo a produção sem ela. É o que garante que a LP sai com a SUA cara, não genérica.`,
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
    pitch_se_so_ig: `Entendi. Deixa eu te mostrar o que você leva antes de falar preço.\n\n→ Setup Shopify completo — tema profissional, domínio, SSL, checkout otimizado (agência cobra R$1.500)\n→ Tema MPN customizado — mesmo tema que a UrbanFeet e o Gabriel usam, não é template genérico (R$1.000)\n→ Integrações prontas — Mercado Pago (PIX/cartão 12x), Melhor Envio (5+ transportadoras), WhatsApp (R$400)\n→ 20 produtos cadastrados — fotos, descrição, preço, variação, estoque (R$300)\n\n*Valor de mercado: R$3.200.*\n\nE GRÁTIS empilhado:\n✓ Shopify $1/mês nos primeiros 3 meses — programa promocional, quase de graça pra testar\n✓ Lista de fornecedores do nicho que a Impulso mapeou\n✓ Scripts de prospecção pra puxar os primeiros 10 clientes\n✓ Call de entrega ao vivo gravada — *o vídeo fica seu*, esqueceu algo daqui a 6 meses você revê\n\nPra referência de mercado:\n• Agência local Palmas: R$1.500-4.000 + mensalidade\n• Freela Fiverr: R$1.200-2.000, sem tema custom, sem integração local, sem call\n\n*Meu preço: R$599 uma vez.* Entrega em 7-10 dias.\n\nPalmas recebe no dia (PIX 10h → em casa 14h via motoboy nos 2 horários fixos). Brasil todo via Melhor Envio até 80% mais barato que Correios.\n\nGancho de ticket médio grátis: "frete grátis a partir de R$250" faz cliente levar 2 pra fechar o valor. Você define a regra.\n\nCase real: o *Gabriel* (GB Nutrition, personal trainer aqui em Palmas) vendia suplemento no WhatsApp — cada pedido ele confirmava PIX, combinava entrega, era gargalo. Hoje a loja dele tá automatizada. Palmas recebe no dia, Brasil todo no checkout. *O Gabriel parou de ser atendente. Voltou a ser personal.*`,
    pitch_se_tem_site: `Que legal! Qual é o link? Quero dar uma olhada.`,
    fechamento: scriptAbordagemLP(nome, categoria).fechamento,
    call_alinhamento: `Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* (30 min) com a equipe Impulso.\n\nNão é venda. É *diagnóstico operacional ao vivo* — a gente senta e mapeia: motoboy parceiro ou app, quais horários de corte, Mercado Pago no seu CNPJ, regra de frete grátis por ticket, fornecedores do seu nicho.\n\nVocê sai da call com a loja já alinhada pra rodar: não é mockup, é Shopify no ar com a sua cara. A GB Nutrition do Gabriel e a UrbanFeet só ficaram únicas porque a gente sentou antes de codar. *Não começo a produção sem essa call.*`,
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
    pitch_se_so_ig: `Então é exatamente onde o AgendaPRO resolve.\n\nIsso aqui é a *SmartAgenda* — feita pra ${categoria.toLowerCase()}. Cliente agenda sozinho pelo link, sem baixar app. Você não responde mais WhatsApp de madrugada pra marcar horário.\n\nE tem coisa que concorrente na faixa não entrega:\n• Dashboard financeiro em tempo real — quanto cada cadeira faturou, quanto cada profissional te deve de comissão\n• Lista de espera que notifica a fila inteira quando alguém cancela — agenda se recompõe sozinha\n• QR code A5 pro balcão — cliente aponta e agenda\n\nR$47/mês (Plano Solo) + setup R$147. 7 dias de garantia pra testar.\n\nAcredita: depois que você conhecer essa SmartAgenda, não vive mais sem.\n\nE os 10 primeiros travam esse preço pra sempre (Clube Fundador).`,
    pitch_se_tem_site: `Você já tem sistema de agendamento ou o cliente ainda marca no WhatsApp?\n\nE o financeiro/comissão — o sistema atual te mostra em tempo real quanto cada profissional te deve?`,
    fechamento: scriptAbordagemLP(nome, categoria).fechamento,
  }
}

// ── Roteador de ofertas ──────────────────────────────────────────────────────
// Princípio: RadarPRO detecta categoria do lead e carrega o arsenal certo ANTES
// de qualquer mensagem sair. Três ofertas paralelas com regras claras:
//
//  • combo          — LP R$499 + SmartAgenda R$47/mês com setup R$147 GRÁTIS
//                     (promoção sazonal: só pros 10 primeiros que fecham LP
//                     com a Impulso Digital — Clube Fundador do ecossistema)
//  • lp-solo        — LP R$499 pura (profissional sem agenda como gargalo)
//  • agendapro-solo — SmartAgenda R$47/mês + setup R$147 cheio (negócio puro
//                     agenda: barbearia, salão, tatuagem, etc — não precisa LP)

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

const CATEGORIAS_SHOPIFY_MATCH = [
  'loja de roupas', 'loja de calçados', 'loja de calcados',
  'loja de acessórios', 'loja de acessorios',
  'joalheria', 'confeitaria', 'açaí', 'acai',
  'café', 'cafe', 'empório', 'emporio',
  'loja de suplementos', 'perfumaria',
  'loja de cosméticos', 'loja de cosmeticos',
  'pet shop', 'petshop', 'papelaria',
  'loja de artesanato', 'floricultora', 'floricultura',
]

export function detectarTipoOferta(categoria: string): TipoOferta {
  const cat = categoria.toLowerCase()
  if (CATEGORIAS_SHOPIFY_MATCH.some(c => cat.includes(c))) return 'shopify-solo'
  // AgendaPRO fora do foco de prospecção atual (23/04): tudo que não é
  // loja/produto físico vira LP. CATEGORIAS_PURO_AGENDA e CATEGORIAS_COMBO
  // seguem exportadas pra uso em outras telas, mas não roteiam mais.
  return 'lp-solo'
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
    pitch_se_so_ig: `Então é perfeito o que eu faço — monto duas coisas que trabalham juntas:\n\n*1. LP profissional* — você aparece no Google quando alguém pesquisa "${esp} em Palmas". Link próprio pra passar no Insta, WhatsApp, cartão. Hospedagem vitalícia + 3 artigos SEO no blog pra puxar tráfego orgânico. R$499, entrega em 7 dias.\n\n*2. SmartAgenda (AgendaPRO)* — cliente agenda sozinho pelo link, sem baixar app. Dashboard financeiro em tempo real. Lista de espera que preenche cancelamentos automaticamente. Chega de WhatsApp de madrugada. R$47/mês (Plano Solo).\n\n*Promoção do combo:* o setup do AgendaPRO Solo (R$147) sai de graça pros 10 primeiros que fecham a LP comigo. Depois disso volta pro preço cheio.\n\nAcredita: depois que você conhecer essa SmartAgenda, não vive mais sem.`,
    pitch_se_tem_site: `Que legal! Qual é o link? Quero dar uma olhada.\n\nE pra agenda — você já tem algum sistema onde cliente marca sozinho, ou ainda é tudo pelo WhatsApp?`,
    fechamento: `Posso te mostrar como os dois funcionam juntos numa call rápida de 20 min.\n\nQual é melhor pra você:\n- Quinta (15h)?\n- Sexta (14h)?\n- Segunda (10h)?`,
    call_alinhamento: `Antes da gente fechar, tem uma etapa obrigatória do processo: *call de alinhamento* com a equipe Impulso.\n\nNão é pitch — é pra te conhecer. Sua visão, seus valores, o que te move como ${esp}. É daí que sai o projeto único: LP com a SUA cara, SmartAgenda configurada pro SEU jeito de trabalhar.\n\nEssa call é o que separa entrega Impulso de agência qualquer. Sem ela eu não começo.`,
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

// ── Objeções + respostas prontas (padrão validado) ───────────────────────────

export const OBJECOES_IMPULSO = {
  ja_tenho_instagram: `Instagram não aparece no Google quando alguém pesquisa "[profissão] em Palmas".\nLP sim. E com o link da bio apontando pra LP, o Instagram passa a converter também.`,
  quanto_custa:       `R$499 e entrego em até 7 dias.\nEm 20 min de conversa você já vê exatamente como fica.`,
  vou_pensar:         `Claro. Mas olha: estou com 3 vagas em abril.\nPosso segurar a sua até quinta-feira?`,
  sem_dinheiro:       `Tranquilo. Sem problema mesmo.\nFica com meu contato — quando estiver no momento certo, me chama 👊`,
}

// ── Follow-up timeline pós-consultoria ───────────────────────────────────────

export const FOLLOWUP_TIMELINE = [
  { dia: 3,  mensagem: 'Ficou com alguma dúvida da nossa conversa?' },
  { dia: 5,  mensagem: 'Suas 3 vagas de abril tão acabando rápido. Quer fechar ou deixa pra maio?' },
  { dia: 7,  mensagem: 'Última mensagem desse mês: vagas de abril saem hoje.' },
  { dia: 30, mensagem: '[reabordagem após mute de 30 dias]' },
]

// Link direto pro WhatsApp com mensagem pré-preenchida
export function gerarLinkWhatsApp(telefone: string, mensagem: string): string {
  // Limpa o telefone — só números
  const numero = telefone.replace(/\D/g, '')
  // Adiciona DDI 55 se não tiver
  const numeroCompleto = numero.startsWith('55') ? numero : `55${numero}`
  const mensagemEncoded = encodeURIComponent(mensagem)
  return `https://wa.me/${numeroCompleto}?text=${mensagemEncoded}`
}

// Categorias para LP — profissionais liberais
export const CATEGORIAS_LP = [
  // Saúde
  'Nutricionista',
  'Personal trainer',
  'Psicólogo',
  'Fisioterapeuta',
  'Terapeuta',
  'Fonoaudiólogo',
  'Médico esteta',
  'Dentista',
  // Beleza
  'Esteticista',
  'Designer de sobrancelhas',
  'Maquiadora',
  'Nail designer',
  'Cabeleireiro',
  // Serviços
  'Fotógrafo',
  'Coach',
  'Personal organizer',
  'Professor particular',
  'Videógrafo',
]

// Categorias para Shopify — negócios com produto físico
export const CATEGORIAS_SHOPIFY = [
  // Moda
  'Loja de roupas',
  'Loja de calçados',
  'Loja de acessórios',
  'Joalheria',
  // Alimentação
  'Confeitaria',
  'Açaí',
  'Café',
  'Empório',
  // Saúde & Beleza
  'Loja de suplementos',
  'Perfumaria',
  'Loja de cosméticos',
  // Outros
  'Pet shop',
  'Papelaria',
  'Loja de artesanato',
  'Floricultora',
]

// Queries para o Google Maps — LP
export const QUERIES_GMAPS_LP = [
  'nutricionista Palmas TO',
  'personal trainer Palmas TO',
  'psicólogo Palmas TO',
  'fisioterapeuta Palmas TO',
  'dentista estético Palmas TO',
  'médico esteta Palmas TO',
  'esteticista Palmas TO',
  'fotógrafo Palmas TO',
  'coach Palmas TO',
  'maquiadora Palmas TO',
]

// Queries para o Google Maps — Shopify
export const QUERIES_GMAPS_SHOPIFY = [
  'loja de roupas Palmas TO',
  'loja de calçados Palmas TO',
  'confeitaria Palmas TO',
  'loja de suplementos Palmas TO',
  'pet shop Palmas TO',
  'papelaria Palmas TO',
  'joalheria Palmas TO',
  'loja de cosméticos Palmas TO',
  'açaí Palmas TO',
  'loja de acessórios Palmas TO',
]

// Hashtags Instagram — LP
export const HASHTAGS_INSTAGRAM_LP = [
  'nutricionistapalmas',
  'personaltrainerpalmas',
  'psicologopalmas',
  'fisioterapeutapalmas',
  'estetistapalmas',
  'fotografopalmas',
  'maquiadorapalmas',
  'naildesignerpalmas',
  'coachpalmas',
  'dentistapalmas',
]

// Hashtags Instagram — Shopify
export const HASHTAGS_INSTAGRAM_SHOPIFY = [
  'modapalmas',
  'lojapalmas',
  'confeitariapalmas',
  'suplementospalmas',
  'roupaspalmas',
  'calcadospalmas',
  'docespalmas',
  'petshoppalmas',
  'papelariapamas',
  'joiaspalmas',
]

// Categorias para AgendaPRO — profissionais que trabalham com agendamento
export const CATEGORIAS_AGENDAPRO = [
  'Barbearia',
  'Salão de beleza',
  'Nail designer',
  'Clínica estética',
  'Estúdio de tatuagem',
  'Psicólogo',
  'Personal trainer',
  'Fisioterapeuta',
  'Nutricionista',
  'Dentista',
  'Massoterapeuta',
  'Depilação',
  'Sobrancelha',
  'Maquiadora',
  'Fotógrafo',
]

// Queries Google Maps — AgendaPRO
export const QUERIES_GMAPS_AGENDAPRO = [
  'barbearia Palmas TO',
  'salão de beleza Palmas TO',
  'nail designer Palmas TO',
  'clínica estética Palmas TO',
  'estúdio de tatuagem Palmas TO',
  'psicólogo Palmas TO',
  'personal trainer Palmas TO',
  'fisioterapeuta Palmas TO',
  'massoterapeuta Palmas TO',
  'depilação Palmas TO',
]

// Hashtags Instagram — AgendaPRO
export const HASHTAGS_INSTAGRAM_AGENDAPRO = [
  'barbeariapalmas',
  'salaodebelezapalmas',
  'nailpalmas',
  'esteticapalmas',
  'tatuagempalmas',
  'psicologopalmas',
  'personalpalmas',
  'fisiopalmas',
  'massagempalmas',
  'depilacaopalmas',
]
