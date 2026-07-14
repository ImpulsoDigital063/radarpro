/**
 * PLAYBOOK LOCAL — sem API, custo ZERO.
 *
 * Por que existe: gerar playbook com Claude custava ~R$0,70 por lead. Com 567 leads
 * isso é ~R$400 por varredura, e a conversa NÃO muda de lead pra lead — muda de
 * NICHO pra NICHO e de SITUAÇÃO pra SITUAÇÃO. Duas barbearias que já usam Trinks
 * recebem a mesma abertura; o que muda é o nome na saudação.
 *
 * Então o playbook é escrito à mão aqui (8 nichos × 6 situações) e o banco guarda
 * o resultado pronto em script_json. A API só entra se alguém pedir "regerar".
 *
 * REGRAS QUE VALEM AQUI (as mesmas do arsenal):
 *  · nunca cita nota/avaliações do Google
 *  · nunca cita endereço/quadra
 *  · nunca cita o concorrente pelo nome
 *  · nunca promete nota fiscal nem disparo automático SEM clique
 *  · WhatsApp é SEMI-automático: o sistema monta, ela toca 1x
 */

import { detectarNicho } from './nichos'

export type SituacaoLead =
  | 'USA_SISTEMA'
  | 'MOVIMENTO_ALTO_MANUAL'
  | 'AGENDA_PELA_DM'
  | 'TEM_SITE_PROPRIO'
  | 'FRIO'
  | 'DESCONHECIDO'

export type PlaybookLocal = {
  msg1: string
  se_responder_curioso: string
  se_disser_ja_tenho_sistema: string
  se_disser_nao_tenho_tempo: string
  se_disser_ta_caro: string
  se_perguntar_whatsapp_automatico: string
  se_perguntar_nota_fiscal: string
  se_sumir_d3: string
  se_sumir_d7: string
  como_fechar: string
  modelo: string
  custoUSD: number
}

/* ═══════════════════════════════════════════════════════════════════════
   RESPOSTAS UNIVERSAIS — iguais pra todo nicho
   ═══════════════════════════════════════════════════════════════════════ */

const WHATSAPP =
  'Manda no WhatsApp, mas você aperta o botão. O sistema já escreve a mensagem pronta ' +
  'com o nome, o horário e o serviço da cliente — você só toca uma vez pra enviar, não ' +
  'digita nada. Não dispara sozinho de propósito: disparo automático em massa é o que faz ' +
  'o WhatsApp banir número. Aqui sai do SEU número, no seu toque, e ela responde pra você, ' +
  'não pra um robô. Serve pra confirmação, lembrete, aniversário e pra chamar de volta quem sumiu.'

const NOTA_FISCAL =
  'Nota fiscal não emite, não. Vou ser direto: se emitir nota é obrigatório pra você hoje, ' +
  'meu sistema não resolve isso e eu prefiro te falar agora do que te vender e você descobrir ' +
  'na semana que vem. O que ele faz é a agenda, a comanda, a comissão e o financeiro.'

const NAO_TENHO_TEMPO =
  'É justamente por isso que eu não te entrego um sistema vazio pra você configurar. Você me ' +
  'manda a lista de serviços com preço e quem trabalha com você — EU deixo tudo montado e te ' +
  'mando o login já funcionando. Você abre e usa. O trabalho de montar é meu.'

const LOGINS =
  'Cada um tem o login dele. A recepção marca, atende, fecha comanda e vende produto — sem ver ' +
  'o seu faturamento nem a comissão dos outros. E cada profissional abre no celular e vê a agenda ' +
  'dele e quanto já ganhou de comissão, em tempo real — para de te perguntar. Você vê tudo, eles ' +
  'veem só o que é deles.'

/* ═══════════════════════════════════════════════════════════════════════
   O QUE MUDA POR NICHO
   ═══════════════════════════════════════════════════════════════════════ */

type PerfilCopy = {
  /** como ELA chama o negócio (usar na fala) */
  trato: string
  /** a pergunta de abertura — é o que faz ela responder */
  pergunta: string
  /** a arma principal, em 1 frase de venda */
  arma: string
  /** resposta ao "tá caro" — muda o quadro, nunca baixa o preço */
  caro: string
  /** follow-up do dia 3 — reabre com valor, não com "e aí?" */
  d3: string
  /** breakup do dia 7 — devolve o controle */
  d7: string
  /** o pedido da venda */
  fechar: string
  /** o que responder quando diz que já tem sistema */
  jaTem: string
  /** o que mandar quando ela responde com interesse */
  curioso: string
}

const COPY: Record<string, PerfilCopy> = {
  /* ─────────────────────────────────────────────── BARBEARIA */
  barbearia: {
    trato: 'barbearia',
    pergunta:
      'a comissão do seu barbeiro sai em cima da tabela do corte, ou em cima do que entrou de ' +
      'verdade na maquininha, já descontando cupom e taxa?',
    arma:
      'O sistema calcula a comissão sobre o LÍQUIDO — o que entrou de verdade, já fora o cupom e ' +
      'a taxa do cartão, e só depois que o cliente pagou. Num cliente meu ele descobriu que vinha ' +
      'pagando comissão a mais havia meses, porque calculava em cima do bruto.',
    caro:
      'Entendo. Mas olha o outro lado da conta: se a comissão está saindo sobre a tabela e não ' +
      'sobre o líquido, você está pagando a mais TODO MÊS sem ver. O sistema não é despesa, é o ' +
      'que para o vazamento. E não tem fidelidade — se em um mês não fizer sentido, você cancela.',
    d3:
      'Passando aqui de novo, sem pressão. Uma coisa que eu esqueci de te falar: a venda de pomada ' +
      'e óleo entra na MESMA comanda do corte, e o estoque baixa sozinho. Se você vende no balcão e ' +
      'não controla, é aí que some dinheiro. Quer que eu te mostre em 10 minutos?',
    d7:
      'Vou parar de te escrever pra não encher. Se um dia quiser conferir se a comissão está saindo ' +
      'certa, ou botar ordem na venda de pomada e óleo, é só me chamar aqui. Sucesso com a barbearia.',
    fechar:
      'Faz o seguinte: são 7 dias de teste, sem taxa de setup e sem cartão. Eu monto a sua barbearia ' +
      'dentro — serviços, preços e os barbeiros — e te mando o login pronto. Você usa uma semana. Se ' +
      'não fizer sentido, some e não me deve nada. Me manda a lista dos serviços com preço?',
    jaTem:
      'Boa. Então deixa eu te perguntar uma coisa: ele calcula a comissão em cima do que entrou de ' +
      'verdade, ou em cima da tabela? E ele desloga no meio do expediente, com cliente na cadeira? ' +
      'São as duas reclamações que eu mais escuto de quem já usa sistema.',
    curioso:
      'Show. Em resumo: agenda por barbeiro, comanda que junta corte + pomada, comissão calculada ' +
      'sobre o líquido e cada barbeiro vendo a dele no celular. São 7 dias de teste e eu monto tudo ' +
      'pra você. Me manda a lista de serviços com preço que eu deixo pronto hoje.',
  },

  /* ─────────────────────────────────────────────── LASH */
  lash: {
    trato: 'studio',
    pergunta:
      'se uma cliente tiver reação à cola daqui a 3 meses, em quanto tempo você acha o termo que ' +
      'ela assinou — e o lote da cola que você usou nela?',
    arma:
      'A ficha de anamnese de cílios é digital: as perguntas de saúde, o mapping que você desenha ' +
      'com o dedo na tela, o efeito, a curvatura, a espessura, e a MARCA, O LOTE E A VALIDADE DA COLA. ' +
      'Mais o termo de responsabilidade assinado pela cliente na tela. Vira PDF e vai pro WhatsApp dela.',
    caro:
      'Pensa assim: existe condenação judicial de salão indenizando cliente por reação alérgica. Sem ' +
      'ficha e sem termo assinado, quem paga é você. O sistema custa menos que um almoço por semana e ' +
      'é o que te dá a prova. E não tem fidelidade — cancela quando quiser.',
    d3:
      'Voltando aqui, sem pressão. Só pra te mostrar uma coisa: o mapping você desenha com o dedo na ' +
      'tela, igual você faz no caderno — dois olhos, você risca em cima. Fica salvo na ficha da cliente ' +
      'com a foto de antes e depois. Quer ver funcionando em 10 minutos?',
    d7:
      'Vou parar por aqui pra não ficar insistindo. Se um dia você quiser tirar as fichas da pasta de ' +
      'papel e ter o termo assinado guardado, me chama. Sucesso com o studio.',
    fechar:
      'São 7 dias de teste, sem setup e sem cartão. Eu monto seu studio dentro — seus serviços, seus ' +
      'preços — e já deixo a ficha de cílios pronta. Você atende uma cliente com ela essa semana e vê ' +
      'se muda alguma coisa. Me manda a lista dos seus serviços com preço?',
    jaTem:
      'Boa. Ele tem ficha de anamnese de cílios com mapping desenhado, registro do lote da cola e termo ' +
      'assinado pela cliente? Pergunto porque a maioria dos sistemas de agenda não tem — eles marcam ' +
      'horário e param aí. É aí que você fica descoberta se der reação.',
    curioso:
      'Show. O centro é a ficha: perguntas de saúde, mapping desenhado com o dedo, curvatura, espessura, ' +
      'lote da cola e o termo assinado na tela — vira PDF e vai pro WhatsApp da cliente. Mais a agenda ' +
      'com link, pra você sair da DM. 7 dias de teste e eu monto tudo. Me manda seus serviços com preço?',
  },

  /* ─────────────────────────────────────────────── ESTÉTICA */
  estetica: {
    trato: 'clínica',
    pergunta:
      'a ficha da cliente e o termo de consentimento você guarda impresso ou digital? Se for papel, ' +
      'você acha a ficha de uma cliente de dois anos atrás em quanto tempo?',
    arma:
      'Ficha de anamnese facial completa: uso de ácido, gestante, histórico de câncer de pele, alergia ' +
      'a medicamento. Mais a análise de pele registrada (biotipo, grau de acne, Glogau) e o histórico — ' +
      'você abre e vê o que fez na última sessão, sem depender da memória. E o PACOTE com saldo: quantas ' +
      'sessões comprou, quantas usou, quantas faltam.',
    caro:
      'Vou te dar uma conta: se você vende pacote de 10 sessões e controla no caderno, uma sessão dada ' +
      'a mais por engano já paga o mês do sistema. E o pacote aqui baixa sozinho no atendimento, não tem ' +
      'como errar. Sem fidelidade — cancela quando quiser.',
    d3:
      'Voltando, sem pressão. Uma coisa que costuma pegar: o pacote de sessões baixa SOZINHO quando você ' +
      'atende. Some o risco de dar uma sessão de graça sem perceber, e a cliente vê o saldo dela. Quer que ' +
      'eu te mostre rodando em 10 minutos?',
    d7:
      'Vou parar de te escrever pra não encher. Se um dia quiser tirar as fichas e os termos do papel, ou ' +
      'botar controle no saldo dos pacotes, me chama aqui. Sucesso com a clínica.',
    fechar:
      'São 7 dias de teste, sem setup, sem cartão. Eu monto sua clínica dentro — procedimentos, preços, ' +
      'pacotes — e te mando o login pronto. Você usa uma semana de verdade. Me manda a lista de ' +
      'procedimentos com preço que eu deixo montado?',
    jaTem:
      'Boa. Ele tem ficha de anamnese facial de verdade — ácido, gestante, histórico de câncer de pele — ' +
      'com termo assinado pela cliente? E controla saldo de pacote de sessões? A maioria dos sistemas de ' +
      'agenda só marca horário e para aí.',
    curioso:
      'Show. O centro é a ficha de anamnese com termo assinado e o pacote com saldo de sessões, que baixa ' +
      'sozinho no atendimento. Mais agenda, comanda e o financeiro mostrando o que sobrou de verdade. ' +
      '7 dias de teste e eu monto tudo. Me passa seus procedimentos com preço?',
  },

  /* ─────────────────────────────────────────────── SALÃO */
  salao: {
    trato: 'salão',
    pergunta:
      'a comissão da sua equipe sai em cima da tabela, ou em cima do que entrou de verdade depois do ' +
      'desconto e da taxa da maquininha?',
    arma:
      'Comissão sobre o LÍQUIDO — descontando cupom e taxa do cartão, e só depois que a cliente pagou. ' +
      'Cada profissional vê a dela em tempo real no celular e para de te perguntar. E a recepção opera ' +
      'sem enxergar o seu faturamento.',
    caro:
      'Se a comissão está saindo sobre a tabela e não sobre o líquido, o desconto e a taxa da maquininha ' +
      'estão saindo do SEU bolso, todo mês. O sistema não é gasto, é o que fecha esse buraco. E sem ' +
      'fidelidade: se em um mês não servir, você cancela.',
    d3:
      'Passando de novo, sem pressão. Uma coisa que talvez te interesse: venda de produto (finalizador, ' +
      'máscara, coloração) entra na mesma comanda do serviço e o estoque baixa junto. Uma cliente minha ' +
      'tem 164 produtos cadastrados e é por isso que ela fica. Quer ver em 10 minutos?',
    d7:
      'Vou parar por aqui pra não insistir. Se um dia quiser conferir se a comissão está saindo certa, ou ' +
      'parar de ver produto sumindo da prateleira, me chama. Sucesso com o salão.',
    fechar:
      'São 7 dias de teste, sem taxa de setup e sem cartão. Eu monto o salão dentro — serviços, preços, ' +
      'sua equipe — e te mando o login pronto. Você roda uma semana de verdade. Me manda a lista de ' +
      'serviços com preço e quem trabalha com você?',
    jaTem:
      'Boa. Duas perguntas então: ele calcula comissão sobre o líquido (já fora cupom e maquininha), e a ' +
      'sua recepcionista consegue ver o seu faturamento quando entra? São os dois pontos onde eu mais ' +
      'vejo dono incomodado com o sistema que já tem.',
    curioso:
      'Show. Resumo: agenda por profissional, comanda que junta serviço + produto, comissão sobre o ' +
      'líquido com cada uma vendo a dela no celular, e a recepção operando sem ver seu financeiro. ' +
      '7 dias de teste e eu monto tudo. Me manda os serviços com preço e a equipe?',
  },

  /* ─────────────────────────────────────────────── NAIL */
  nail: {
    trato: 'studio',
    pergunta: 'sua agenda hoje tá na DM do Instagram, ou você já usa alguma coisa pra marcar?',
    arma:
      'Agenda com link: a cliente marca sozinha, sem passar pela sua DM. E cada serviço com a duração ' +
      'certa — esmaltação 45min, gel 1h30, fibra 2h — então o sistema bloqueia o tempo certo e não ' +
      'encavala horário em cima de você.',
    caro:
      'Pensa no custo do furo: uma fibra é 2 ou 3 horas do seu dia. Uma cliente que some sem avisar já ' +
      'custa mais que o mês do sistema. Com a confirmação e o lembrete prontos pra você mandar, isso cai. ' +
      'E não tem fidelidade — cancela quando quiser.',
    d3:
      'Voltando aqui rapidinho. Uma coisa que ajuda muito no seu caso: cada serviço tem a duração certa ' +
      'cadastrada, então a cliente não consegue marcar uma fibra num buraco de 45 minutos. Acaba o ' +
      'encavalamento. Quer que eu te mostre em 10 minutos?',
    d7:
      'Vou parar de escrever pra não encher. Se um dia quiser sair da DM e ter a agenda funcionando ' +
      'sozinha, me chama aqui. Sucesso com o studio.',
    fechar:
      'São 7 dias de teste, sem setup e sem cartão. Eu monto seu studio dentro — seus serviços com a ' +
      'duração e o preço de cada um — e te mando o link da sua agenda pronto pra colocar na bio. Me ' +
      'manda a lista de serviços com preço e quanto tempo leva cada um?',
    jaTem:
      'Boa. Ele tem link de agendamento pra você botar na bio do Instagram, e trava a duração certa de ' +
      'cada serviço? Pergunto porque a maioria deixa a cliente marcar fibra num buraco de 45 minutos, e ' +
      'aí encavala o seu dia.',
    curioso:
      'Show. O centro é o link da agenda na bio: a cliente marca sozinha, com a duração certa de cada ' +
      'serviço travada. Mais a venda de esmalte e óleo entrando na comanda, e o financeiro com o lucro ' +
      'real. 7 dias de teste e eu monto tudo. Me manda seus serviços com preço e duração?',
  },

  /* ─────────────────────────────────────────────── SOBRANCELHA */
  sobrancelha: {
    trato: 'studio',
    pergunta:
      'a ficha e o termo das clientes de micropigmentação: você guarda no papel ou digital? E o pigmento ' +
      'que usou (marca e lote), fica registrado em algum lugar?',
    arma:
      'Ficha de anamnese com termo de responsabilidade assinado pela cliente na tela, com o dedo. E o ' +
      'registro do pigmento — marca, lote e validade. É a rastreabilidade que te protege se der reação. ' +
      'Mais a foto de antes e depois com data.',
    caro:
      'Micropigmentação é procedimento invasivo. Sem ficha e sem termo assinado, se a cliente reclamar de ' +
      'reação, quem prova o quê? O sistema custa menos que uma sessão sua e é o que te dá a prova. Sem ' +
      'fidelidade, cancela quando quiser.',
    d3:
      'Voltando, sem pressão. Uma coisa que costuma chamar atenção: a cliente assina o termo NA TELA, com ' +
      'o dedo, e vira PDF que vai pro WhatsApp dela num toque. Não some, não molha, não precisa de pasta. ' +
      'Quer ver em 10 minutos?',
    d7:
      'Vou parar por aqui pra não insistir. Se um dia quiser tirar a ficha e o termo do papel, me chama. ' +
      'Sucesso com o studio.',
    fechar:
      'São 7 dias de teste, sem setup e sem cartão. Eu monto seu studio — serviços e preços — e já deixo ' +
      'a ficha com o termo pronta. Você atende uma cliente com ela essa semana. Me manda a lista de ' +
      'serviços com preço?',
    jaTem:
      'Boa. Ele tem ficha de anamnese com termo assinado pela cliente e registro do lote do pigmento? ' +
      'A maioria dos sistemas de agenda só marca horário — a parte que te protege legalmente eles não têm.',
    curioso:
      'Show. O centro é a ficha com o termo assinado na tela e o registro do pigmento (marca e lote). ' +
      'Mais a agenda com link, pra você sair da DM, e a foto de antes e depois com data. 7 dias de teste ' +
      'e eu monto tudo. Me manda seus serviços com preço?',
  },

  /* ─────────────────────────────────────────────── TRANÇAS */
  trancas: {
    trato: 'studio',
    pergunta:
      'a cliente assina algum termo sobre o tempo de uso das tranças, ou fica tudo no combinado de boca?',
    arma:
      'Ficha capilar: química que ela já fez, reação alérgica anterior, couro cabeludo, queda. Mais o TERMO ' +
      'DE TRANÇAS assinado — tempo de uso recomendado, manutenção, e a isenção do studio se ela usar além ' +
      'do prazo. Essa ficha nasceu da ficha de papel de uma cliente minha de verdade.',
    caro:
      'A conta é essa: uma cliente que usou a trança tempo demais, teve problema no couro cabeludo e veio ' +
      'cobrar de você já custa mais que um ano de sistema. O termo assinado é o que te protege. E sem ' +
      'fidelidade — cancela quando quiser.',
    d3:
      'Voltando rapidinho. Uma coisa importante pro seu caso: o termo de tranças deixa por escrito o tempo ' +
      'de uso e a manutenção, assinado pela cliente na tela. Se ela passar do prazo e der problema, você ' +
      'tem a prova. Quer ver funcionando em 10 minutos?',
    d7:
      'Vou parar de escrever pra não encher. Se um dia quiser ter a ficha capilar e o termo assinado ' +
      'guardados de verdade, me chama. Sucesso com o studio.',
    fechar:
      'São 7 dias de teste, sem setup e sem cartão. Eu monto seu studio e já deixo a ficha capilar e o ' +
      'termo de tranças prontos. Você atende uma cliente com eles essa semana. Me manda seus serviços com ' +
      'preço?',
    jaTem:
      'Boa. Ele tem ficha capilar (química anterior, reação alérgica, couro cabeludo) e termo de tranças ' +
      'assinado pela cliente? Sistema de agenda comum não tem — eles marcam horário e param aí.',
    curioso:
      'Show. O centro é a ficha capilar e o termo de tranças assinado na tela — vira PDF e vai pro ' +
      'WhatsApp da cliente. Mais a agenda com link e a venda de produto entrando na comanda. 7 dias de ' +
      'teste e eu monto tudo. Me manda seus serviços com preço?',
  },

  /* ─────────────────────────────────────────────── OUTRO (nicho não identificado) */
  OUTRO: {
    trato: 'seu negócio',
    pergunta: 'hoje você controla os horários no caderno, no WhatsApp, ou já usa algum sistema?',
    arma:
      'Agenda com link (a cliente marca sozinha), comanda, controle do que entrou e do que saiu, e o ' +
      'financeiro mostrando o que SOBROU de verdade — não só o faturamento.',
    caro:
      'Sem fidelidade e sem taxa de setup: se em um mês não fizer sentido pra você, cancela e pronto. O que ' +
      'eu peço é uma semana de teste antes de você decidir.',
    d3:
      'Passando de novo, sem pressão. Se fizer sentido, eu te mostro rodando em 10 minutos — com o seu ' +
      'negócio dentro, não uma demonstração genérica. Quer?',
    d7:
      'Vou parar de te escrever pra não encher. Se um dia quiser botar a agenda e o financeiro em ordem, ' +
      'é só me chamar aqui. Sucesso.',
    fechar:
      'São 7 dias de teste, sem taxa de setup e sem cartão. Eu monto o seu negócio dentro e te mando o ' +
      'login pronto. Me manda a lista de serviços com preço que eu deixo montado hoje?',
    jaTem:
      'Boa. Deixa eu te perguntar: ele desloga no meio do atendimento, com cliente esperando? E te mostra ' +
      'quanto SOBROU no fim do mês, ou só quanto entrou? São as duas reclamações que eu mais escuto.',
    curioso:
      'Show. Agenda com link pra cliente marcar sozinha, comanda, e o financeiro mostrando o lucro real. ' +
      '7 dias de teste, sem setup, e eu monto tudo pra você. Me manda seus serviços com preço?',
  },
}

/* ═══════════════════════════════════════════════════════════════════════
   O QUE MUDA POR SITUAÇÃO — só a abertura (msg1)
   ═══════════════════════════════════════════════════════════════════════ */

function abertura(sit: SituacaoLead, c: PerfilCopy, nome: string, sistema?: string | null): string {
  const oi = `Boa tarde, ${nome}. Já aviso que é mensagem de vendedor, sou de Palmas mesmo.`

  switch (sit) {
    case 'USA_SISTEMA':
      // Ela JÁ resolveu o problema da agenda. A dor dela é o SISTEMA, não a agenda.
      // Não vender "agenda" pra quem já tem — vender o que o sistema dela não faz.
      return [
        oi,
        `Vi que vocês já usam sistema${sistema ? '' : ''}, então não vou te oferecer agenda — você já tem.`,
        `Minha pergunta é outra: ${c.pergunta}`,
        `É onde eu mais vejo dono já com sistema perdendo dinheiro sem perceber.`,
      ].join(' ')

    case 'MOVIMENTO_ALTO_MANUAL':
      return [
        oi,
        `Dá pra ver que o movimento aí é alto, e é justamente por isso que eu te escrevi.`,
        `Uma pergunta rápida: ${c.pergunta}`,
      ].join(' ')

    case 'AGENDA_PELA_DM':
      return [
        oi,
        `Reparei que o agendamento aí passa pela DM do Instagram.`,
        `Antes de te oferecer qualquer coisa: ${c.pergunta}`,
      ].join(' ')

    case 'TEM_SITE_PROPRIO':
      return [
        oi,
        `Vi que vocês já têm site — então já entenderam que organização importa, não vou te explicar o óbvio.`,
        `Só uma pergunta: ${c.pergunta}`,
      ].join(' ')

    default:
      return [oi, `Uma pergunta rápida, e se não fizer sentido eu não te incomodo mais: ${c.pergunta}`].join(' ')
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   MONTAGEM
   ═══════════════════════════════════════════════════════════════════════ */

export function situacaoDoLead(l: {
  sistema_detectado?: string | null
  nivel_consciencia?: string | null
}): SituacaoLead {
  if (l.sistema_detectado) return 'USA_SISTEMA'
  const n = (l.nivel_consciencia ?? '').toUpperCase()
  if (n === 'MOVIMENTO_ALTO_MANUAL') return 'MOVIMENTO_ALTO_MANUAL'
  if (n === 'AGENDA_PELA_DM') return 'AGENDA_PELA_DM'
  if (n === 'TEM_SITE_PROPRIO') return 'TEM_SITE_PROPRIO'
  if (n === 'FRIO') return 'FRIO'
  return 'DESCONHECIDO'
}

export function gerarPlaybookLocal(lead: {
  nome: string
  categoria?: string | null
  sistema_detectado?: string | null
  nivel_consciencia?: string | null
}): PlaybookLocal {
  const nicho = detectarNicho(lead.categoria ?? '', lead.nome ?? '') ?? 'OUTRO'
  const c = COPY[nicho] ?? COPY.OUTRO
  const sit = situacaoDoLead(lead)

  // quem já usa sistema tem uma resposta de objeção diferente: a dor é o sistema dela
  const jaTem =
    sit === 'USA_SISTEMA'
      ? `${c.jaTem} E olha: o meu não desloga no meio do atendimento, e não tem fidelidade — você cancela quando quiser.`
      : c.jaTem

  return {
    msg1: abertura(sit, c, lead.nome, lead.sistema_detectado),
    se_responder_curioso: c.curioso,
    se_disser_ja_tenho_sistema: jaTem,
    se_disser_nao_tenho_tempo: NAO_TENHO_TEMPO,
    se_disser_ta_caro: c.caro,
    se_perguntar_whatsapp_automatico: WHATSAPP,
    se_perguntar_nota_fiscal: NOTA_FISCAL,
    se_sumir_d3: c.d3,
    se_sumir_d7: c.d7,
    como_fechar: c.fechar,
    modelo: `local:${nicho}/${sit}`,
    custoUSD: 0,
  }
}

/** O diagnóstico também sai daqui — sem API. */
export function gerarDiagnosticoLocal(lead: {
  nome: string
  categoria?: string | null
  sistema_detectado?: string | null
  nivel_consciencia?: string | null
}) {
  const nicho = detectarNicho(lead.categoria ?? '', lead.nome ?? '') ?? 'OUTRO'
  const c = COPY[nicho] ?? COPY.OUTRO
  const sit = situacaoDoLead(lead)

  return {
    dor_central:
      sit === 'USA_SISTEMA'
        ? 'Já tem sistema — a dor dela NÃO é a agenda, é o sistema (trava, desloga, não calcula a comissão certa). Não venda agenda.'
        : sit === 'AGENDA_PELA_DM'
          ? 'Agenda o dia inteiro pela DM do Instagram — o tempo dela é consumido respondendo horário.'
          : sit === 'MOVIMENTO_ALTO_MANUAL'
            ? 'Movimento alto tocado na mão — o crescimento já passou do que o caderno aguenta.'
            : 'Não sabemos a dor ainda. A msg 1 é uma PERGUNTA, não um pitch — ela que vai dizer.',
    custo_da_dor: 'Não invente número. Deixe ela dizer quanto isso custa.',
    arma_certa: c.arma,
    o_que_nao_oferecer: [
      'disparo automático de WhatsApp SEM clique (não existe)',
      'nota fiscal (não existe)',
      ...(nicho === 'barbearia' || nicho === 'nail' ? ['ficha de anamnese (esse nicho não usa)'] : []),
      ...(sit === 'USA_SISTEMA' ? ['agenda (ela já tem — é insultar a inteligência dela)'] : []),
    ].join(' · '),
    mensagem_impacto: c.pergunta,
    modelo: `local:${nicho}/${sit}`,
    custoUSD: 0,
    logins: LOGINS,
  }
}
