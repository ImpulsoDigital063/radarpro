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
