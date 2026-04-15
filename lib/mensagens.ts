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
  abertura:            string  // msg 1 — dispara primeiro (já é o gerarMensagem*)
  diagnostico:         string  // msg 2 — depois que ele responder "pode/claro"
  pitch_se_so_ig:      string  // msg 3A — se disser "só Instagram/indicação"
  pitch_se_tem_site:   string  // msg 3B — se disser "tenho site/página"
  fechamento:          string  // msg 4 — 3 opções concretas, nunca "quando puder"
}

export function scriptAbordagemLP(nome: string, especialidade: string): ScriptAbordagem {
  const primeiroNome = nome.split(' ')[0]
  return {
    abertura: gerarMensagemLP(nome, especialidade),
    diagnostico: `Quando um cliente novo te encontra online, como ele chega até você?\n\nTem página profissional ou vem tudo pelo Instagram e indicação mesmo?`,
    pitch_se_so_ig: `Entendi. Isso é exatamente o que eu resolvo.\n\nA gente cria uma LP profissional pra você aparecer quando alguém pesquisa "${especialidade} em Palmas" no Google.\n\nE dentro da página já tem um sistema de agendamento — o cliente escolhe o dia e o horário sozinho, recebe confirmação por email, e você não precisa responder WhatsApp pra marcar horário.\n\nChega de "tem horário amanhã?" às 23h.`,
    pitch_se_tem_site: `Que legal! Qual é o link? Quero dar uma olhada.`,
    fechamento: `Posso te mostrar como fica na prática em 20 minutos.\n\nQual é melhor pra você:\n- Quinta (15h)?\n- Sexta (14h)?\n- Segunda (10h)?`,
  }
}

export function scriptAbordagemShopify(nome: string, categoria: string): ScriptAbordagem {
  return {
    abertura: gerarMensagemShopify(nome, categoria),
    diagnostico: `Hoje, quando alguém quer comprar de você, como funciona? É tudo por Instagram/WhatsApp ou você já tem loja online?`,
    pitch_se_so_ig: `Entendi. Isso é exatamente o que eu resolvo.\n\nMonto uma loja Shopify profissional com checkout em 12x, PIX, boleto — tudo pronto. Cliente compra sozinho, sem você precisar negociar frete nem mandar pix pelo WhatsApp a cada pedido.\n\nE pra entrega local, coloco o selo "entrega hoje via motoboy" — dispara compra por impulso. Pra fora de Palmas, frete via Melhor Envio até 80% mais barato que correios.\n\nOs primeiros 3 meses no Shopify saem a $1/mês. Cliente testa quase de graça.`,
    pitch_se_tem_site: `Que legal! Qual é o link? Quero dar uma olhada.`,
    fechamento: scriptAbordagemLP(nome, categoria).fechamento,
  }
}

export function scriptAbordagemAgendaPRO(nome: string, categoria: string): ScriptAbordagem {
  return {
    abertura: gerarMensagemAgendaPRO(nome, categoria),
    diagnostico: `Como funciona a agenda aí hoje? Cliente marca pelo WhatsApp ou você já tem algum sistema de agendamento?`,
    pitch_se_so_ig: `Entendi. Isso é exatamente o que eu resolvo.\n\nTenho um sistema de agendamento online — AgendaPRO — com tela prontinha pra ${categoria.toLowerCase()}. Cliente agenda sozinho pelo link, sem baixar app, sem você responder WhatsApp de madrugada.\n\nLembrete automático D-1 e 1 hora antes (reduz no-show), lista de espera automática (se alguém cancela o próximo da fila pega a vaga), badge do Google Reviews na página e programa de fidelidade com link de indicação — cliente indica cliente e ganha pontos.\n\n14 dias de teste grátis, R$67/mês depois.`,
    pitch_se_tem_site: `Você já tem sistema de agendamento ou o cliente ainda marca no WhatsApp?`,
    fechamento: scriptAbordagemLP(nome, categoria).fechamento,
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
