/**
 * MAPA DE NICHO — a dor de CADA tipo de negócio e a função exata que resolve.
 *
 * É isto que permite falar com cada cliente como se fosse único: uma lash designer
 * não tem a mesma dor de um barbeiro, e um salão com equipe não tem a mesma dor de
 * uma manicure que trabalha sozinha.
 *
 * Sem este mapa, a IA fala "sistema de gestão pra beleza" — que é o mesmo que dizer
 * nada. Com ele, fala "a marca e o lote da cola ficam registrados na ficha".
 *
 * Cravado 14/07/2026, com base nas 7 frentes de pesquisa.
 */

export type PerfilNicho = {
  /** como ELA chama o negócio dela (studio? salão? barbearia?) */
  comoSeChama: string
  /** as dores REAIS, na ordem em que doem */
  dores: string[]
  /** as funções do AgendaPRO que resolvem — específicas, não genéricas */
  armas: string[]
  /** o que NÃO adianta oferecer pra esse nicho */
  naoServe: string[]
  /** a pergunta de abertura mais forte pra esse nicho */
  perguntaChave: string
}

export const NICHOS: Record<string, PerfilNicho> = {
  /* ─────────────────────────────────────────────────────────── */
  barbearia: {
    comoSeChama: 'barbearia',
    dores: [
      'comissão do barbeiro calculada na mão no fim do mês — e dá briga',
      'paga comissão sobre o valor de tabela, mas o cupom e a taxa do cartão saem do bolso DELE',
      'vende pomada, óleo e shampoo no balcão e não tem controle nenhum',
      'barbeiro sai e leva a clientela',
      'não sabe quanto sobrou no fim do mês',
    ],
    armas: [
      'COMISSÃO SOBRE O LÍQUIDO: calcula sobre o que entrou de verdade, já descontando o cupom e a taxa da maquininha. E só depois que o cliente pagou.',
      'Num cliente real o sistema DESCOBRIU que ele pagava comissão a mais há meses — sobre o bruto, em comanda com cupom.',
      'Cada barbeiro vê a comissão dele em tempo real no celular e para de perguntar.',
      'Venda de pomada/óleo entra na MESMA comanda do corte. Estoque baixa sozinho.',
      'Caixa e PDV: atende quem entrou sem marcar.',
      'Fidelidade com pontos e cupom de retorno pra quem sumiu há 40 dias.',
    ],
    naoServe: ['ficha de anamnese (barbearia não usa)'],
    perguntaChave: 'A comissão do seu barbeiro sai em cima da tabela do corte, ou em cima do que entrou de verdade na maquininha?',
  },

  /* ─────────────────────────────────────────────────────────── */
  lash: {
    comoSeChama: 'studio (NUNCA "salão" — lash designer não chama de salão)',
    dores: [
      'a ficha de anamnese vive numa PASTA DE PAPEL — molha, some, não acha',
      'se a cliente tiver reação alérgica, ela precisa provar qual cola usou e qual lote',
      'existe condenação judicial real: salão indenizando cliente por alergia (TJDFT)',
      'agenda pela DM do Instagram o dia inteiro',
      'não tem termo de consentimento assinado guardado',
    ],
    armas: [
      'FICHA DE ANAMNESE DIGITAL DE CÍLIOS — nenhum concorrente de R$67 tem isso.',
      'As 20 perguntas de saúde que importam: alergia a cola, lente de contato, glaucoma, gestante, se já teve reação, se dorme de lado.',
      'MAPPING DESENHADO COM O DEDO: dois olhos na tela, ela risca o mapeamento igual faz no caderno.',
      'Efeito (volume russo, brasileiro, híbrido), curvatura (B a M) e espessura (0.03 a 0.20) ficam salvos.',
      'MARCA, LOTE E VALIDADE DA COLA — a rastreabilidade que salva o pescoço dela se der reação.',
      'TERMO DE RESPONSABILIDADE + assinatura da cliente na tela, com o dedo.',
      'Vira PDF e vai pro WhatsApp da cliente num toque.',
      'Foto de antes e depois na galeria da cliente.',
    ],
    naoServe: ['controle de estoque pesado (ela vende pouco produto)', 'comissão (geralmente trabalha sozinha)'],
    perguntaChave: 'Se uma cliente tiver reação na cola daqui a 3 meses, você acha o termo que ela assinou em quanto tempo — e o lote da cola que usou?',
  },

  /* ─────────────────────────────────────────────────────────── */
  estetica: {
    comoSeChama: 'clínica / studio de estética',
    dores: [
      'ficha de anamnese e termo de consentimento no papel',
      'precisa registrar ácidos, gestação, histórico de câncer de pele — e não tem onde',
      'vende pacote de 10 sessões e controla quantas já foram num caderno',
      'não lembra o que usou na cliente da última vez',
      'indica dermocosmético e a cliente compra na farmácia',
    ],
    armas: [
      'FICHA DE ANAMNESE FACIAL: uso de ácido/peeling, gestante, câncer de pele (pessoal e familiar), alergia a medicamento, filtro solar.',
      'ANÁLISE DE PELE registrada: biotipo, hidratação, grau de acne (I a III), textura, escala Glogau, rugas.',
      'HISTÓRICO POR CLIENTE — abre e vê o que foi feito da última vez, sem depender da memória.',
      'PACOTES com saldo de sessões: quantas comprou, quantas usou, quantas faltam, e quando vence.',
      'A sessão baixa sozinha no atendimento — sem risco de dar uma de graça.',
      'Vende dermocosmético na mesma comanda do procedimento. Estoque baixa junto.',
      'Foto de antes e depois com data.',
    ],
    naoServe: [],
    perguntaChave: 'Ficha da cliente e termo de consentimento: você guarda impresso ou digital? Se for papel, acha a de uma cliente de dois anos atrás em quanto tempo?',
  },

  /* ─────────────────────────────────────────────────────────── */
  salao: {
    comoSeChama: 'salão',
    dores: [
      'comissão de cada profissional calculada na mão no fim do mês',
      '"50% de comissão? Isso não é colaborador, é sócio!" — a briga do setor',
      'a recepcionista mexe no sistema e VÊ O FATURAMENTO do dono',
      'vende finalizador, máscara, coloração — e o produto some da prateleira',
      'agenda de 5 pessoas num caderno só',
      'não sabe quanto sobrou (só 45% dos donos sabem o lucro do mês)',
    ],
    armas: [
      'COMISSÃO SOBRE O LÍQUIDO — desconta cupom e taxa da maquininha, e só conta depois que a cliente pagou.',
      'Cada profissional vê a comissão dela em tempo real e PARA DE PERGUNTAR.',
      'RECEPÇÃO OPERA SEM VER O SEU FINANCEIRO: ela marca, atende, fecha comanda e vende produto. Seu faturamento e a comissão dos outros ficam fora do alcance dela.',
      'ESTOQUE E VENDA DE PRODUTO na mesma comanda do serviço. (A Izanara, do Studio MOOD, tem 164 produtos cadastrados e paga o plano Equipe por causa disso.)',
      'Agenda por profissional, com trava anti-overbooking no banco.',
      'Financeiro com LUCRO REAL — despesa categorizada, não só faturamento.',
      'FICHA CAPILAR (se faz química/tranças): química anterior, reação alérgica, couro cabeludo, termo assinado.',
    ],
    naoServe: [],
    perguntaChave: 'A comissão da sua equipe sai em cima da tabela, ou em cima do que entrou de verdade depois do desconto e da maquininha?',
  },

  /* ─────────────────────────────────────────────────────────── */
  nail: {
    comoSeChama: 'studio de unhas / nail designer (NÃO chama de salão)',
    dores: [
      'agenda pela DM do Instagram',
      'sessão longa (fibra leva 2-3h) — furo custa caro',
      'revende esmalte, óleo de cutícula, kit — sem controle',
      'não sabe quanto sobrou no mês',
    ],
    armas: [
      'Agenda com link: a cliente marca sozinha, sem passar pela DM.',
      'Cada serviço com a DURAÇÃO certa (esmaltação 45min, gel 1h30, fibra 2h) — o sistema bloqueia o tempo certo.',
      'Venda de esmalte/óleo/kit na mesma comanda. VARIANTES: cada cor e tamanho com preço e estoque próprios.',
      'Financeiro com lucro real.',
      'Fidelidade com pontos e cupom pra cliente sumida.',
    ],
    naoServe: ['ficha de anamnese (nail raramente usa)'],
    perguntaChave: 'Sua agenda tá na DM do Instagram hoje?',
  },

  /* ─────────────────────────────────────────────────────────── */
  sobrancelha: {
    comoSeChama: 'studio de sobrancelhas / designer',
    dores: [
      'micropigmentação exige ficha e termo assinado — está no papel',
      'agenda pela DM',
      'precisa registrar o pigmento usado (marca e lote)',
    ],
    armas: [
      'FICHA DE ANAMNESE com termo de responsabilidade e assinatura da cliente na tela.',
      'Registro do pigmento: marca, lote e validade — rastreabilidade se der reação.',
      'Foto de antes e depois com data.',
      'Agenda com link, sem DM.',
    ],
    naoServe: [],
    perguntaChave: 'A ficha e o termo das clientes de micropigmentação: papel ou digital?',
  },

  /* ─────────────────────────────────────────────────────────── */
  trancas: {
    comoSeChama: 'studio de tranças / cacheados',
    dores: [
      'química e tranças exigem ficha de anamnese (reação alérgica é real)',
      'termo de uso: tranças têm tempo recomendado (até 6 semanas) — sem termo, a cliente usa demais e culpa o salão',
      'vende produto (finalizador, creme) e não controla',
    ],
    armas: [
      'FICHA CAPILAR: química no cabelo, reação alérgica anterior, couro cabeludo, queda, se já usou tranças ou mega hair antes.',
      'TERMO DE TRANÇAS assinado: tempo de uso recomendado, importância da manutenção, isenção do salão se ela usar além do prazo.',
      'Essa ficha nasceu da ficha REAL da Izanara (Studio MOOD) — que paga R$97/mês.',
      'Estoque e venda de produto na comanda.',
    ],
    naoServe: [],
    perguntaChave: 'A cliente assina algum termo sobre o tempo de uso das tranças, ou é tudo no combinado?',
  },
}

/**
 * ARMA UNIVERSAL — vale pra TODO nicho, inclusive os que não identificamos.
 * O WhatsApp semi-automático é a função mais pedida do mercado e a que eu mais
 * estava vendendo mal (dizendo "não temos"). Temos. Só não dispara sozinho.
 */
export const ARMA_WHATSAPP = [
  'WHATSAPP SEMI-AUTOMÁTICO (vale pra todo nicho):',
  '  · O sistema MONTA a mensagem pronta — com o nome, o horário e o serviço da cliente.',
  '    Ela envia com 1 TOQUE. Não precisa digitar nada.',
  '  · Funciona pra: confirmação de horário · lembrete · aniversariante · cliente que',
  '    cancelou · CUPOM DE RETORNO pra quem sumiu · ficha de anamnese em PDF · comanda.',
  '  · Os textos são editáveis — ela escreve do jeito dela.',
  '  · A VANTAGEM (use como argumento): disparo automático em massa é o que faz o',
  '    WhatsApp BANIR número. Aqui a mensagem sai do número DELA, no toque DELA.',
  '    A cliente responde pra ela, não pra um robô.',
  '  · O que NÃO existe: envio sozinho, sem clique. NUNCA prometa isso.',
].join('\n')

/**
 * ARMA UNIVERSAL 2 — CADA UM COM SEU LOGIN.
 * Vale pra todo negócio que tem mais de uma pessoa. Resolve duas dores de uma vez:
 * o dono não quer a recepção vendo o faturamento dele, e o profissional não quer
 * depender do dono pra saber quanto ganhou.
 */
export const ARMA_LOGINS = [
  'CADA UM COM SEU LOGIN (pra quem tem equipe):',
  '  · A RECEPÇÃO tem o login dela: marca, atende, fecha comanda e vende produto —',
  '    SEM ver o seu faturamento nem a comissão dos outros.',
  '  · CADA PROFISSIONAL tem o login dele: abre no celular e vê a AGENDA DELE e',
  '    QUANTO JÁ GANHOU DE COMISSÃO, em tempo real. Para de perguntar pra você.',
  '  · Você vê tudo. Eles veem só o que é deles.',
  '  · Isso mata a briga do fim do mês: a conta não aparece do nada, ele acompanhou',
  '    o mês inteiro.',
].join('\n')

/**
 * ARMA UNIVERSAL 3 — O MOTOR DE CRESCIMENTO.
 * A arma mais forte e a que a gente MENOS estava usando. Não é retenção: é o
 * sistema TRAZENDO cliente novo.
 *
 * ⚠️ HONESTIDADE (λ.não-inventar): a mecânica existe, está construída e roda —
 * mas a base ainda é pequena e ninguém tirou proveito dela até agora. Então
 * vende-se O QUE O SISTEMA FAZ. NUNCA diga "meus clientes usam e trouxe X
 * clientes novos" — isso seria mentira e a gente não faz isso.
 */
export const ARMA_CRESCIMENTO = [
  'O MOTOR DE CRESCIMENTO (o sistema TRAZ cliente novo — não só organiza):',
  '  · AVALIAÇÃO NO GOOGLE: o cliente avalia o negócio no Google e GANHA PONTOS por',
  '    isso. Ele informa o nome que usou na avaliação, você aprova, e os pontos caem.',
  '    Mais estrela no Google = mais gente achando o negócio. O sistema paga o cliente',
  '    pra te avaliar.',
  '  · LINK DE INDICAÇÃO: cada cliente tem o código dele. O link sai pronto na tela',
  '    depois que ele agenda. Quem chega pelo link fica marcado como indicado.',
  '    Cliente traz cliente.',
  '  · PONTOS E RESGATE: ele junta ponto atendimento a atendimento e troca por',
  '    desconto. Motivo pra voltar.',
  '  · CUPOM DE RETORNO: o sistema acha quem sumiu e monta a mensagem pra você enviar.',
  '',
  '  ⚠️ COMO FALAR DISSO SEM MENTIR: fale do que o SISTEMA FAZ ("ele pede a avaliação",',
  '  "ele gera o link de indicação"). NUNCA invente resultado de cliente, número de',
  '  avaliações conquistadas ou "fulano cresceu X%". Não temos esse número ainda.',
].join('\n')

/**
 * ARMA UNIVERSAL 4 — A AGENDA QUE SE DEFENDE SOZINHA.
 */
export const ARMA_AGENDA = [
  'A AGENDA QUE NÃO DEIXA BURACO:',
  '  · LISTA DE ESPERA: quando um horário cai (cancelamento), o sistema AVISA A FILA',
  '    na hora. O buraco na agenda se preenche sozinho — isso é dinheiro que hoje',
  '    evapora todo dia.',
  '  · Link de agendamento pra colocar na bio: a cliente marca sozinha, sem DM.',
  '  · Duração certa por serviço: não deixa marcar procedimento de 2h num buraco de 45min.',
  '  · Trava anti-overbooking no banco: não marca dois no mesmo horário.',
  '  · O atendimento passado fecha SOZINHO — ela não precisa dar baixa em nada.',
].join('\n')

/**
 * ARMA UNIVERSAL 5 — MATA A OBJEÇÃO MAIS CARA QUE EXISTE.
 * "Vou ter que digitar meus 400 clientes de novo?" — NÃO.
 */
export const ARMA_MIGRACAO = [
  'A MIGRAÇÃO (mata a objeção mais cara: "vou ter que digitar tudo de novo?"):',
  '  · IMPORTA A BASE DE CLIENTES de planilha (CSV/XLSX), com uma tela de CONFERÊNCIA',
  '    antes de gravar — ela vê o que vai entrar e só então confirma.',
  '  · Importa clientes E agendamentos de sistema concorrente (o importador do Salão365',
  '    já está pronto). Quem quer SAIR de um sistema tem a ponte.',
  '  · E o Eduardo monta o resto: serviços, preços, equipe. Ela recebe o login pronto.',
  '  · Ou seja: ela não digita nada. O trabalho é nosso.',
].join('\n')

/**
 * ARMA UNIVERSAL 7 — O FURO. Quem tem sessão longa (nail, lash, estética) perde
 * 2-3 horas do dia quando a cliente não aparece. Isso é a dor nº1 delas.
 */
export const ARMA_NOSHOW = [
  'O FURO (use MUITO com nail, lash e estética — sessão longa, furo dói fundo):',
  '  · Quem FURA sem avisar PERDE PONTOS, automaticamente. E o dono pode relevar num',
  '    toque se a cliente tiver um motivo de verdade.',
  '  · Quem chega NO HORÁRIO ganha PONTO EXTRA (bônus de pontualidade).',
  '  · Ou seja: a cliente tem dinheiro em jogo pra aparecer e pra chegar na hora.',
  '  · Mais a lista de espera: se ela cancelar, o horário não vira buraco.',
  '  · Mais a confirmação e o lembrete prontos pra você enviar num toque.',
].join('\n')

/**
 * ARMA UNIVERSAL 6 — LGPD.
 * Vale MUITO pra quem guarda ficha (lash, estética, sobrancelha, tranças): elas
 * coletam DADO DE SAÚDE (alergia, gestação, câncer de pele) numa pasta de papel.
 */
export const ARMA_LGPD = [
  'LGPD (use com quem guarda ficha — lash, estética, sobrancelha, tranças):',
  '  · A ficha dela coleta DADO DE SAÚDE: alergia, gestação, histórico de câncer de',
  '    pele, uso de medicamento. Isso é dado sensível pela Lei 13.709.',
  '  · Numa pasta de papel, em cima do balcão, qualquer um abre. Não tem controle de',
  '    acesso, não tem registro de quem viu, e se pegar fogo ou molhar, acabou.',
  '  · No sistema: acesso controlado por login, e o cliente pode pedir a exclusão dos',
  '    dados dele (o sistema tem a rota pra isso).',
  '  · NÃO faça terrorismo jurídico e NÃO cite multa nem valor. Só mostre o risco real.',
].join('\n')

/** Descobre o nicho pela categoria e pelo nome do negócio. */
export function detectarNicho(categoria: string, nome: string): keyof typeof NICHOS | null {
  const t = `${categoria} ${nome}`.toLowerCase()

  if (/lash|cílios|cilios|extensão de c|extensao de c/.test(t)) return 'lash'
  if (/sobrancelha|micropigment|brow|design de sobr/.test(t)) return 'sobrancelha'
  if (/trança|tranca|braids|cachead|crespo/.test(t)) return 'trancas'
  if (/nail|unha|manicure|pedicure|esmalteria/.test(t)) return 'nail'
  if (/barbearia|barbeiro|barber/.test(t)) return 'barbearia'
  if (/estética|estetica|esteticista|clínica|clinica|peeling|depila/.test(t)) return 'estetica'
  if (/salão|salao|cabeleireiro|beleza|hair|beauty/.test(t)) return 'salao'

  return null
}

/** Monta o bloco de contexto do nicho pro prompt. */
export function contextoDoNicho(categoria: string, nome: string): string {
  const chave = detectarNicho(categoria, nome)
  if (!chave) {
    return [
      'NICHO: não identificado com precisão. Use a pergunta de diagnóstico e NÃO chute a dor dela.',
      '',
      ARMA_WHATSAPP,
      '',
      ARMA_LOGINS,
      '',
      ARMA_CRESCIMENTO,
      '',
      ARMA_AGENDA,
      '',
      ARMA_MIGRACAO,
    ].join('\n')
  }

  const n = NICHOS[chave]
  return [
    `NICHO: ${chave.toUpperCase()}`,
    `Ela chama o negócio dela de: ${n.comoSeChama}`,
    '',
    'AS DORES REAIS DELA (em ordem de dor):',
    ...n.dores.map((d, i) => `  ${i + 1}. ${d}`),
    '',
    'AS ARMAS DO AGENDAPRO PRA ESSE NICHO (fale destas, não de "gestão"):',
    ...n.armas.map((a) => `  · ${a}`),
    '',
    ARMA_WHATSAPP,
    '',
    ARMA_LOGINS,
    '',
    ARMA_CRESCIMENTO,
    '',
    ARMA_AGENDA,
    '',
    ARMA_MIGRACAO,
    // o furo dói fundo em quem tem sessão longa
    ...(['nail', 'lash', 'estetica', 'sobrancelha', 'trancas'].includes(chave)
      ? ['', ARMA_NOSHOW]
      : []),
    // LGPD só pra quem guarda dado de saúde na ficha
    ...(['lash', 'estetica', 'sobrancelha', 'trancas'].includes(chave) ? ['', ARMA_LGPD] : []),
    ...(n.naoServe.length
      ? ['', 'NÃO OFEREÇA (não serve pra esse nicho):', ...n.naoServe.map((x) => `  ✗ ${x}`)]
      : []),
    '',
    `PERGUNTA MAIS FORTE PRA ESSE NICHO:`,
    `  "${n.perguntaChave}"`,
  ].join('\n')
}
