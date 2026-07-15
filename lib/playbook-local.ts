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
import { detectarPorte, type Porte, type ReviewLite } from './porte'

export type SituacaoLead =
  | 'USA_SISTEMA'
  | 'MOVIMENTO_ALTO_MANUAL'
  | 'AGENDA_PELA_DM'
  | 'TEM_SITE_PROPRIO'
  | 'FRIO'
  | 'DESCONHECIDO'

export type PlaybookLocal = {
  msg1: string
  /** solo ou equipe — decide QUAIS armas entram na msg 1 */
  porte: Porte
  /** por que decidimos esse porte (uso interno, nunca vai pra mensagem) */
  porte_motivo: string
  se_responder_curioso: string
  se_disser_ja_tenho_sistema: string
  se_disser_nao_tenho_tempo: string
  se_disser_ta_caro: string
  se_perguntar_whatsapp_automatico: string
  se_perguntar_nota_fiscal: string
  /** "vou ter que digitar meus 400 clientes de novo?" — a objeção mais cara que existe */
  se_disser_vou_ter_que_digitar_tudo: string
  /** o motor de crescimento: o sistema TRAZ cliente novo. É o argumento mais forte. */
  o_motor_de_crescimento: string
  se_sumir_d3: string
  se_sumir_d7: string
  como_fechar: string
  modelo: string
  custoUSD: number
}

/* ═══════════════════════════════════════════════════════════════════════
   COMO CHAMAR O NEGÓCIO NA SAUDAÇÃO
   ═══════════════════════════════════════════════════════════════════════

   O nome que vem do Google Maps é um cartaz de SEO, não um nome:
     "Makedamaay | Salão de Beleza"
     "Iara Leite - Especialista em Depilação a Laser em Palmas"
     "Barbearia Toledo - Palmas Brasil Sul"
     "Espaço Bella - Beleza & Bem-Estar ✅ em Palmas."

   Jogar isso cru na saudação ("Boa tarde, Makedamaay | Salão de Beleza.")
   é a coisa mais robô que existe — e sai logo na PRIMEIRA LINHA, que é onde
   a pessoa decide se lê ou bloqueia. 179 dos 695 leads têm nome assim.

   Regra: limpa o nome. Se sobrar coisa boa, usa. Se ficar duvidoso, NÃO USA
   NOME NENHUM — "Boa tarde, tudo bem?" nunca soa errado; nome mutilado sempre.
*/

/** Palavras que denunciam cartaz de SEO no fim do nome. */
const LIXO_NO_NOME =
  /\b(em\s+palmas|palmas\s*[-–]?\s*to\b|palmas\s+brasil.*|palmas|brasil|tocantins|\bto\b)\b/gi

export function nomeDeTratamento(bruto: string): string | null {
  let n = (bruto ?? '').trim()
  if (!n) return null

  // 1. fora emoji, selo e afins
  n = n.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2705}]/gu, ' ')

  // 2. o que vem depois da barra é sempre categoria/SEO
  n = n.split('|')[0]

  // 3. o que vem depois do travessão idem ("Taylor e Thedy - Salão e Barbearia")
  n = n.split(/\s[-–—]\s/)[0]

  // 4. fora parênteses
  n = n.replace(/\([^)]*\)/g, ' ')

  // 5. fora a lista de serviços que alguns colam no nome (vírgula em série)
  if ((n.match(/,/g) ?? []).length >= 2) n = n.split(',')[0]

  // 6. fora cidade/estado
  n = n.replace(LIXO_NO_NOME, ' ')

  // 7. arruma espaço e pontuação solta
  n = n.replace(/\s+/g, ' ').replace(/[\s.,;:&\-–—]+$/g, '').trim()

  if (n.length < 3) return null

  const palavras = n.split(' ').filter(Boolean)

  // 8. sobrou um cartaz genérico ("Salão De Beleza", "Salã De Beleza")? não usa
  //    nome. Se o nome é SÓ categoria, chamar por ele soa como mala direta.
  //    (o \w* no fim tolera o nome digitado errado — "Salã", "Saloes")
  const soCategoria =
    /^(sal[ãaáo]\w*|barbearia|studio|est[úu]dio|cl[íi]nica|espa[çc]o|centro|instituto)\s+(de\s+)?(beleza|est[ée]tica|cabelos?|cabeleireiros?)$/i
  if (soCategoria.test(n)) return null

  /**
   * 9. Comprido demais vira parágrafo na saudação. Corta — mas PARE ANTES da
   *    palavra de categoria, senão sai "Studio Melissa Salão", que é pior que
   *    "Studio Melissa".
   */
  if (palavras.length > 3) {
    const corte: string[] = []
    for (const p of palavras.slice(0, 3)) {
      if (corte.length >= 2 && CATEGORIA_NO_NOME.test(p)) break
      corte.push(p)
    }
    // não deixe conjunção/preposição pendurada no fim ("Dion Estética e.")
    while (corte.length > 1 && /^(e|&|de|da|do|dos|das|com|em|-)$/i.test(corte[corte.length - 1])) {
      corte.pop()
    }
    return corte.join(' ')
  }

  return n
}

/** Palavras que são categoria, não nome próprio. */
const CATEGORIA_NO_NOME =
  /^(sal[ãa]o|barbearia|est[ée]tica|beleza|cabeleireiros?|esmalteria|clinica|cl[íi]nica|spa|nails?|hair)$/i

/**
 * É nome de PESSOA (e não de negócio)? Então chama pelo primeiro nome —
 * "Oi Amanda" em vez de "Oi Amanda Bronze".
 */
const PALAVRA_DE_NEGOCIO =
  /barbearia|barber|sal[ãa]o|studio|est[úu]dio|est[ée]tica|espa[çc]o|cl[íi]nica|centro|beauty|beleza|hair|nails?|lash|spa|instituto|casa|atelier|boutique|esmalteria|c[íi]lios|sobrancelhas?|depila/i

export function comoChamar(bruto: string): string | null {
  const n = nomeDeTratamento(bruto)
  if (!n) return null

  // negócio → chama pelo nome do negócio, inteiro
  if (PALAVRA_DE_NEGOCIO.test(n)) return n

  // "Taylor e Thedy", "Ana & Bia" — são dois sócios, é o nome DA CASA.
  // Cortar no primeiro ("Boa tarde, Taylor") apaga o sócio e soa errado.
  if (/\s(e|&)\s/i.test(n)) return n

  // pessoa → primeiro nome ("Amanda Bronze" → "Amanda")
  const p = n.split(' ')
  return p.length >= 2 ? p[0] : n
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
  'Entendo — e por isso o começo é rápido. Quem monta o negócio no sistema é você, mas leva ' +
  'minutos: cadastra os serviços e os preços direto do celular. É seu de verdade, ninguém mexe na ' +
  'sua casa. E o que travar, me chama que eu te ajudo na hora — não te largo perdida.'

const MIGRACAO =
  'Vou ser reto contigo: importação de lista em massa ainda não tem. Mas você não precisa parar ' +
  'pra digitar 400 clientes de uma vez — cada cliente entra na hora do atendimento, então a sua ' +
  'base vai se formando sozinha conforme você usa. Serviço e preço quem cadastra é você, e leva ' +
  'minutos. O que travar, me chama que eu te ajudo.'

// ⚠️ λ.não-inventar: a mecânica existe e roda. O RESULTADO em cliente ainda não —
// a base é nova e ninguém tirou proveito dela até hoje. Então falamos do que o
// SISTEMA FAZ. Nunca "fulano ganhou 50 avaliações".
const CRESCIMENTO =
  'Tem uma parte que quase ninguém repara e é a que mais importa: o sistema não só organiza, ' +
  'ele TRAZ cliente novo. Duas coisas. Primeira: o cliente avalia você no Google e GANHA PONTOS ' +
  'por isso — ele diz o nome que usou na avaliação, você aprova, e o ponto cai na conta dele. ' +
  'Ou seja, o sistema paga o seu cliente pra te avaliar no Google, e mais estrela no Google é ' +
  'mais gente te achando. Segunda: cada cliente tem um link de indicação próprio, que aparece ' +
  'pronto pra ele depois que agenda. Quem chega por aquele link fica marcado. Cliente trazendo ' +
  'cliente, sem você gastar um real em anúncio.'

const LOGINS =
  'Cada um tem o login dele. A recepção marca, atende, fecha comanda e vende produto — sem ver ' +
  'o seu faturamento nem a comissão dos outros. E cada profissional abre no celular e vê a agenda ' +
  'dele e quanto já ganhou de comissão, em tempo real — para de te perguntar. Você vê tudo, eles ' +
  'veem só o que é deles.'

/* ═══════════════════════════════════════════════════════════════════════
   MSG 1 — O OPENER (reescrito 15/07/2026, decisão do Eduardo)
   ═══════════════════════════════════════════════════════════════════════

   O QUE MUDOU: sai o pitch de comissão/ficha e a MENTIRA "eu monto tudo pra
   você". Entra o eixo CRESCIMENTO (o sistema TRAZ cliente) + o dia a dia
   organizado. É self-service, multi-tenant — o cliente monta o negócio dele.
   Nada de "eu monto", nada de import (não existe ainda), nada de "7 dias
   grátis" no opener (a oferta vem só quando ela perguntar).

   λ.não-inventar: fala do que o SISTEMA FAZ (pede avaliação, gera link de
   indicação, acha quem sumiu). NUNCA resultado de cliente — a base é nova. */
const CRESCIMENTO_MSG1 =
  'Ele não é só agenda: tem as ferramentas pra trazer cliente de volta e atrair cliente novo. ' +
  'O cliente te avalia no Google e ganha pontos por isso — e mais estrela no Google é mais gente ' +
  'te achando. Cada cliente tem um link de indicação próprio, então é cliente trazendo cliente. ' +
  'E o sistema ainda acha quem sumiu e deixa a mensagem pronta pra você chamar de volta com um toque.'

/** A linha do "dia a dia no lugar", por nicho — o gancho de gestão SEM a palavra "gestão". */
const GESTAO_MSG1: Record<string, string> = {
  barbearia:
    'Por baixo disso, o dia a dia no lugar: agenda com link pro cliente marcar sozinho, comanda que ' +
    'junta o corte e a venda de pomada, a comissão dos barbeiros certa, e o financeiro te mostrando ' +
    'o que sobrou no fim do mês — não só o que entrou.',
  salao:
    'Por baixo disso, o dia a dia no lugar: agenda com link, comanda com a venda de produto junto, ' +
    'a comissão da equipe certa, e o financeiro te mostrando o que sobrou no fim do mês — não só o ' +
    'que entrou.',
  nail:
    'Por baixo disso, a agenda no lugar: link pra cliente marcar sozinha, com a duração certa de ' +
    'cada serviço travada, e o financeiro te mostrando o lucro real do mês.',
  lash:
    'Por baixo disso, a agenda com link pra cliente marcar sem passar pela sua DM — e a ficha de ' +
    'anamnese fora do papel: a cliente assina o termo na tela e o lote da cola fica registrado.',
  estetica:
    'Por baixo disso, o dia a dia no lugar: agenda com link, a ficha e o termo fora do papel, e os ' +
    'pacotes com saldo de sessões que baixa sozinho no atendimento.',
  sobrancelha:
    'Por baixo disso, a agenda com link pra cliente marcar sem passar pela sua DM — e a ficha com o ' +
    'termo fora do papel: a cliente assina na tela e o pigmento (marca e lote) fica registrado.',
  trancas:
    'Por baixo disso, a agenda com link — e a ficha capilar fora do papel, com o termo de tranças ' +
    'que a cliente assina na tela (tempo de uso e manutenção).',
  OUTRO:
    'Por baixo disso, o dia a dia no lugar: agenda com link, comanda, e o financeiro te mostrando o ' +
    'que sobrou de verdade no fim do mês — não só o que entrou.',
}

/* ═══════════════════════════════════════════════════════════════════════
   O QUE MUDA POR NICHO
   ═══════════════════════════════════════════════════════════════════════ */

type PerfilCopy = {
  /** como ELA chama o negócio (usar na fala) */
  trato: string
  /**
   * O PITCH DA MSG 1 (reescrito 15/07/2026 — bronca do Eduardo).
   *
   * REGRA DE OURO: a msg 1 VENDE O AGENDAPRO. Ela NÃO faz afirmação sobre o
   * negócio do cliente. Nada de "sei que você usa sistema", "vi que você tem
   * site", "sua cliente reclamou de X". Eu não fui lá, não vi, não agendei —
   * então não finjo que sei. Chute sobre a vida do cliente = robô exposto na
   * primeira linha.
   *
   * Este campo descreve o que O PRODUTO FAZ, relevante pro nicho, verdadeiro
   * pra qualquer tamanho de negócio. Curto. Uma força principal, não catálogo.
   */
  pitch: string
  /**
   * AS ARMAS DA MSG 1, POR PORTE. (Eduardo, 14/07/2026)
   *
   * Antes eu mandava "a recepção marca sem ver o seu faturamento" pra todo mundo.
   * Uma lash designer que trabalha SOZINHA lê isso e conclui: "não é pra mim" —
   * e some, antes de chegar na ficha, que é o que ia fechar a venda dela.
   *
   * solo   → agenda, ficha, furo, financeiro. ZERO menção a recepção ou equipe.
   * equipe → comissão, recepção com login próprio, agenda por profissional.
   *
   * O padrão é SOLO. Só vira equipe com PROVA nas avaliações (lib/porte.ts).
   */
  armasSolo: string
  armasEquipe: string
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
    pitch:
      'Ele calcula a comissão do barbeiro certinha: sobre o que o cliente pagou de verdade, já com o desconto abatido e só depois que ele paga. Acaba planilha e discussão no fim do mês. Fora agenda com link pro cliente marcar sozinho, comanda e controle de produto.',
    armasSolo:
      'A agenda tem link: o cliente marca sozinho, sem te mandar mensagem. O corte e a pomada que ele levar entram na mesma comanda, e o estoque baixa sozinho. E o financeiro te mostra o que SOBROU no fim do mês — já fora a taxa do cartão —, não só o que entrou.',
    armasEquipe:
      'A comissão calcula sobre o que o cliente pagou DE VERDADE: se você deu desconto, ela acompanha o desconto, não sai da tabela. E só conta depois que ele pagou. Cada barbeiro vê a dele no celular e para de te perguntar. A recepção marca e fecha comanda sem enxergar o seu faturamento. E a venda de pomada entra na mesma comanda do corte, com o estoque baixando junto.',
    pergunta:
      'quando você dá um desconto no corte, a comissão do barbeiro sai em cima da tabela ou em ' +
      'cima do que o cliente pagou de verdade?',
    arma:
      // ⚠️ CUPOM sim, taxa de maquininha NÃO. Conferido no código (14/07/2026).
      'A comissão calcula sobre o que o cliente pagou DE VERDADE: se você deu desconto, ela sai ' +
      'sobre o valor com desconto, não sobre a tabela. E só conta depois que ele pagou. Num ' +
      'cliente meu o sistema mostrou que ele vinha pagando comissão a mais havia meses, porque ' +
      'calculava em cima do valor cheio.',
    caro:
      'Entendo. Mas olha o outro lado da conta: se a comissão está saindo sobre a tabela e não ' +
      'sobre o líquido, você está pagando a mais TODO MÊS sem ver. O sistema não é despesa, é o ' +
      'que para o vazamento. E não tem fidelidade — se em um mês não fizer sentido, você cancela.',
    d3:
      'Passando de novo, sem pressão. Tem uma parte do sistema que quase ninguém repara: o cliente ' +
      'avalia a barbearia no Google e GANHA PONTOS por isso — ele diz o nome que usou na avaliação, ' +
      'você aprova, e o ponto cai. Mais estrela no Google é mais gente te achando. O sistema paga o ' +
      'cliente pra te avaliar. E cada um ainda tem um link de indicação próprio. Quer ver em 10 minutos?',
    d7:
      'Vou parar de te escrever pra não encher. Se um dia quiser conferir se a comissão está saindo ' +
      'certa, ou botar ordem na venda de pomada e óleo, é só me chamar aqui. Sucesso com a barbearia.',
    fechar:
      'Faz o seguinte: são 7 dias de teste, sem taxa de setup e sem cartão. Você cria a sua barbearia ' +
      'dentro — serviços, preços e os barbeiros — em poucos minutos, e eu fico do seu lado pra qualquer ' +
      'dúvida. Você usa uma semana. Se não fizer sentido, some e não me deve nada. Bora montar a sua agora?',
    jaTem:
      'Boa. Então deixa eu te perguntar uma coisa: ele calcula a comissão em cima do que entrou de ' +
      'verdade, ou em cima da tabela? E ele desloga no meio do expediente, com cliente na cadeira? ' +
      'São as duas reclamações que eu mais escuto de quem já usa sistema.',
    curioso:
      'Show. Em resumo: agenda por barbeiro, comanda que junta corte + pomada, comissão calculada ' +
      'sobre o líquido e cada barbeiro vendo a dele no celular. São 7 dias de teste, sem cartão — você ' +
      'monta em minutos e eu te ajudo no que travar. Me manda a lista de serviços com preço que a gente já começa.',
  },

  /* ─────────────────────────────────────────────── LASH */
  lash: {
    trato: 'studio',
    pitch:
      'Ele tira a ficha de anamnese do papel: as perguntas de saúde, o mapping que você desenha na tela, e a marca, o lote e a validade da cola registrados. A cliente assina o termo ali mesmo e vira PDF. Fora a agenda com link, pra cliente marcar sozinha sem passar pela sua DM.',
    armasSolo:
      'A ficha de anamnese fica digital: as perguntas de saúde, o mapping que você desenha com o dedo na tela, e a MARCA, O LOTE E A VALIDADE DA COLA. A cliente assina o termo ali mesmo, com o dedo, e vira PDF que vai pro WhatsApp dela. A agenda tem link, então ela marca sozinha sem passar pela sua DM. E quem fura o horário perde ponto — você releva se quiser.',
    armasEquipe:
      'A ficha de anamnese fica digital: perguntas de saúde, o mapping desenhado com o dedo, e a marca, o lote e a validade da cola. A cliente assina o termo na tela e vira PDF. Cada profissional tem o login dela, vê a agenda dela e a comissão dela no celular — que calcula sobre o que a cliente pagou de verdade, já com o desconto que você deu. E a recepção marca e fecha comanda sem ver o seu faturamento.',
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
      'Voltando, sem pressão. Uma coisa que costuma pegar no seu caso: quem FURA o horário sem avisar ' +
      'PERDE pontos automaticamente, e quem chega na hora ganha ponto extra. Numa aplicação de 2 horas, ' +
      'um furo custa o seu dia — aqui a cliente tem dinheiro em jogo pra aparecer. E se ela cancelar, o ' +
      'sistema avisa a fila de espera na hora. Quer ver funcionando em 10 minutos?',
    d7:
      'Vou parar por aqui pra não ficar insistindo. Se um dia você quiser tirar as fichas da pasta de ' +
      'papel e ter o termo assinado guardado, me chama. Sucesso com o studio.',
    fechar:
      'São 7 dias de teste, sem setup e sem cartão. Você cria seu studio dentro — seus serviços e ' +
      'preços — em minutos, e a ficha de cílios já vem pronta no sistema. Você atende uma cliente com ela ' +
      'essa semana e vê se muda alguma coisa. Qualquer dúvida eu te ajudo. Me manda a lista dos seus serviços com preço?',
    jaTem:
      'Boa. Ele tem ficha de anamnese de cílios com mapping desenhado, registro do lote da cola e termo ' +
      'assinado pela cliente? Pergunto porque a maioria dos sistemas de agenda não tem — eles marcam ' +
      'horário e param aí. É aí que você fica descoberta se der reação.',
    curioso:
      'Show. O centro é a ficha: perguntas de saúde, mapping desenhado com o dedo, curvatura, espessura, ' +
      'lote da cola e o termo assinado na tela — vira PDF e vai pro WhatsApp da cliente. Mais a agenda ' +
      'com link, pra você sair da DM. 7 dias de teste, sem cartão — você monta em minutos e eu te ajudo no que travar. Me manda seus serviços com preço?',
  },

  /* ─────────────────────────────────────────────── ESTÉTICA */
  estetica: {
    trato: 'clínica',
    pitch:
      'Ele tira a ficha e o termo do papel, e controla os pacotes: quantas sessões a cliente comprou, usou e faltam — a sessão baixa sozinha no atendimento, sem risco de dar uma de graça. Fora a agenda com link e o financeiro que te mostra o lucro real.',
    armasSolo:
      'A ficha de anamnese fica digital — ácido, gestante, histórico de pele — com o termo assinado pela cliente na tela, e vira PDF. Os PACOTES têm saldo: quantas sessões ela comprou, quantas usou, quantas faltam — e a sessão baixa sozinha no atendimento, sem risco de você dar uma de graça. A agenda tem link, e o financeiro mostra o que sobrou de verdade.',
    armasEquipe:
      'A ficha de anamnese fica digital, com o termo assinado na tela, e os PACOTES têm saldo de sessões que baixa sozinho no atendimento. A comissão calcula sobre o que a cliente pagou de verdade — se você deu desconto, ela acompanha. Cada profissional vê a dela no celular. E a recepção marca e fecha comanda sem enxergar o seu faturamento.',
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
      'Voltando, sem pressão. Duas coisas que costumam pegar. O pacote de sessões baixa SOZINHO no ' +
      'atendimento — some o risco de dar uma sessão de graça sem perceber. E quem fura sem avisar perde ' +
      'pontos, com você podendo relevar num toque se a cliente tiver motivo. Numa sessão longa, furo é ' +
      'prejuízo direto. Quer que eu te mostre rodando em 10 minutos?',
    d7:
      'Vou parar de te escrever pra não encher. Se um dia quiser tirar as fichas e os termos do papel, ou ' +
      'botar controle no saldo dos pacotes, me chama aqui. Sucesso com a clínica.',
    fechar:
      'São 7 dias de teste, sem setup, sem cartão. Você cria sua clínica dentro — procedimentos, preços, ' +
      'pacotes — em poucos minutos, e eu fico do seu lado pra qualquer dúvida. Você usa uma semana de ' +
      'verdade. Me manda a lista de procedimentos com preço que a gente começa?',
    jaTem:
      'Boa. Ele tem ficha de anamnese facial de verdade — ácido, gestante, histórico de câncer de pele — ' +
      'com termo assinado pela cliente? E controla saldo de pacote de sessões? A maioria dos sistemas de ' +
      'agenda só marca horário e para aí.',
    curioso:
      'Show. O centro é a ficha de anamnese com termo assinado e o pacote com saldo de sessões, que baixa ' +
      'sozinho no atendimento. Mais agenda, comanda e o financeiro mostrando o que sobrou de verdade. ' +
      '7 dias de teste, sem cartão — você monta em minutos e eu te ajudo no que travar. Me passa seus procedimentos com preço?',
  },

  /* ─────────────────────────────────────────────── SALÃO */
  salao: {
    trato: 'salão',
    pitch:
      'Ele organiza a agenda (com link pra cliente marcar sozinha), a comanda que já registra a venda de produto, e o financeiro que te mostra o que sobrou de verdade no fim do mês — não só o que entrou. E calcula a comissão da equipe sobre o que a cliente pagou, já com o desconto abatido.',
    armasSolo:
      'A agenda tem link: a cliente marca sozinha, sem passar pela sua DM, e cada serviço já entra com a duração certa. A venda de produto entra na mesma comanda do serviço e o estoque baixa sozinho. E o financeiro te mostra o que SOBROU no fim do mês — já fora a taxa do cartão —, não só o faturamento.',
    armasEquipe:
      'A comissão calcula sobre o que a cliente pagou DE VERDADE: se você deu desconto, ela acompanha o desconto, não sai da tabela. E só conta depois que ela pagou. Cada profissional vê a dela no celular e para de te perguntar. A recepção marca e fecha comanda sem enxergar o seu faturamento. E a venda de produto entra na mesma comanda, com o estoque baixando junto.',
    pergunta:
      'quando você dá um desconto pra cliente, a comissão da profissional sai em cima da tabela ou ' +
      'em cima do que a cliente pagou de verdade?',
    arma:
      // ⚠️ CUPOM sim, taxa de maquininha NÃO.
      'A comissão sai sobre o que a cliente pagou DE VERDADE: deu desconto, a comissão acompanha o ' +
      'desconto — não sai da tabela. E só conta depois que ela pagou. Cada profissional vê a dela em ' +
      'tempo real no celular e para de te perguntar. E a recepção opera sem enxergar o seu faturamento.',
    caro:
      'Se a comissão está saindo sobre a tabela e não sobre o que a cliente pagou, cada desconto que ' +
      'você dá sai do SEU bolso — a profissional recebe sobre um valor que não entrou. O sistema não ' +
      'é gasto, é o que fecha esse buraco. E sem fidelidade: se em um mês não servir, você cancela.',
    d3:
      'Passando de novo, sem pressão. Duas coisas. A tinta que você usa numa coloração DEBITA DO ESTOQUE ' +
      'sozinha, junto com o serviço — você não lança nada. E a cliente avalia o salão no Google e ganha ' +
      'pontos por isso, o que te traz gente nova sem gastar um real em anúncio. Quer ver em 10 minutos?',
    d7:
      'Vou parar por aqui pra não insistir. Se um dia quiser conferir se a comissão está saindo certa, ou ' +
      'parar de ver produto sumindo da prateleira, me chama. Sucesso com o salão.',
    fechar:
      'São 7 dias de teste, sem taxa de setup e sem cartão. Você cria o salão dentro — serviços, preços, ' +
      'sua equipe — em poucos minutos, e eu fico do seu lado pra qualquer dúvida. Você roda uma semana de ' +
      'verdade. Me manda a lista de serviços com preço e quem trabalha com você que a gente começa?',
    jaTem:
      'Boa. Duas perguntas então: quando você dá desconto, ele recalcula a comissão em cima do valor ' +
      'que a cliente pagou, ou continua na tabela? E a sua recepcionista consegue ver o seu faturamento ' +
      'quando entra? São os dois pontos onde eu mais vejo dono incomodado com o sistema que já tem.',
    curioso:
      'Show. Resumo: agenda por profissional, comanda que junta serviço + produto, comissão sobre o ' +
      'líquido com cada uma vendo a dela no celular, e a recepção operando sem ver seu financeiro. ' +
      '7 dias de teste, sem cartão — você monta em minutos e eu te ajudo no que travar. Me manda os serviços com preço e a equipe?',
  },

  /* ─────────────────────────────────────────────── NAIL */
  nail: {
    trato: 'studio',
    pitch:
      'Ele te dá agenda com link pra cliente marcar sozinha, com a duração certa de cada serviço travada — nada de encaixe furando o seu dia. E quem desmarca em cima da hora não deixa buraco: o sistema chama a próxima da fila de espera na hora.',
    armasSolo:
      'A agenda tem link: a cliente marca sozinha, sem passar pela sua DM, e cada serviço entra com a duração certa — ela não consegue marcar uma fibra num buraco de 45 minutos. Quem fura o horário perde ponto, e você releva se ela tiver motivo. Se cancelar, o sistema avisa a fila de espera e o horário não vira buraco.',
    armasEquipe:
      'A agenda tem link e cada serviço entra com a duração certa, por profissional. Quem fura perde ponto. A comissão calcula sobre o que a cliente pagou de verdade — se você deu desconto, ela acompanha — e cada uma vê a dela no celular. E a recepção marca e fecha comanda sem ver o seu faturamento.',
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
      'Voltando rapidinho. Isso aqui é pro seu caso: quem FURA sem avisar PERDE pontos, automático — e ' +
      'você pode relevar num toque se a cliente tiver motivo de verdade. Quem chega no horário ganha ' +
      'ponto extra. Numa fibra de 2 horas, um furo é o seu dia inteiro. E se ela cancelar, o sistema ' +
      'avisa a fila de espera na hora e o buraco se preenche sozinho. Quer ver em 10 minutos?',
    d7:
      'Vou parar de escrever pra não encher. Se um dia quiser sair da DM e ter a agenda funcionando ' +
      'sozinha, me chama aqui. Sucesso com o studio.',
    fechar:
      'São 7 dias de teste, sem setup e sem cartão. Você cria seu studio dentro — seus serviços com a ' +
      'duração e o preço de cada um — em minutos, e já sai com o link da sua agenda pronto pra colocar na ' +
      'bio. Qualquer dúvida eu te ajudo. Me manda a lista de serviços com preço e quanto tempo leva cada um?',
    jaTem:
      'Boa. Ele tem link de agendamento pra você botar na bio do Instagram, e trava a duração certa de ' +
      'cada serviço? Pergunto porque a maioria deixa a cliente marcar fibra num buraco de 45 minutos, e ' +
      'aí encavala o seu dia.',
    curioso:
      'Show. O centro é o link da agenda na bio: a cliente marca sozinha, com a duração certa de cada ' +
      'serviço travada. Mais a venda de esmalte e óleo entrando na comanda, e o financeiro com o lucro ' +
      'real. 7 dias de teste, sem cartão — você monta em minutos e eu te ajudo no que travar. Me manda seus serviços com preço e duração?',
  },

  /* ─────────────────────────────────────────────── SOBRANCELHA */
  sobrancelha: {
    trato: 'studio',
    pitch:
      'Ele tira a ficha e o termo do papel — a cliente assina na tela e vira PDF — e registra o pigmento usado: marca, lote e validade, a sua garantia se der reação. Fora a agenda com link, pra cliente marcar sozinha sem passar pela sua DM.',
    armasSolo:
      'A ficha de anamnese fica digital, com o TERMO assinado pela cliente na tela, com o dedo — e vira PDF que vai pro WhatsApp dela. O pigmento fica registrado: marca, lote e validade. A agenda tem link, então ela marca sozinha sem passar pela sua DM. E a foto de antes e depois fica salva com data.',
    armasEquipe:
      'A ficha fica digital, com o termo assinado na tela e o registro do pigmento (marca, lote e validade). A agenda tem link, por profissional. A comissão calcula sobre o que a cliente pagou de verdade, e cada uma vê a dela no celular. E a recepção marca e fecha comanda sem ver o seu faturamento.',
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
      'Voltando, sem pressão. Duas coisas: a cliente assina o termo NA TELA, com o dedo, e vira PDF que ' +
      'vai pro WhatsApp dela num toque — não some, não molha, não precisa de pasta. E o sistema ainda ' +
      'pede pra ela te avaliar no Google em troca de pontos, o que traz cliente novo. Quer ver em 10 minutos?',
    d7:
      'Vou parar por aqui pra não insistir. Se um dia quiser tirar a ficha e o termo do papel, me chama. ' +
      'Sucesso com o studio.',
    fechar:
      'São 7 dias de teste, sem setup e sem cartão. Você cria seu studio — serviços e preços — em minutos, ' +
      'e a ficha com o termo já vem pronta no sistema. Você atende uma cliente com ela essa semana. ' +
      'Qualquer dúvida eu te ajudo. Me manda a lista de serviços com preço?',
    jaTem:
      'Boa. Ele tem ficha de anamnese com termo assinado pela cliente e registro do lote do pigmento? ' +
      'A maioria dos sistemas de agenda só marca horário — a parte que te protege legalmente eles não têm.',
    curioso:
      'Show. O centro é a ficha com o termo assinado na tela e o registro do pigmento (marca e lote). ' +
      'Mais a agenda com link, pra você sair da DM, e a foto de antes e depois com data. 7 dias de teste, ' +
      'sem cartão — você monta em minutos e eu te ajudo no que travar. Me manda seus serviços com preço?',
  },

  /* ─────────────────────────────────────────────── TRANÇAS */
  trancas: {
    trato: 'studio',
    pitch:
      'Ele tira a ficha capilar do papel e registra o termo de tranças que a cliente assina — tempo de uso e manutenção, a sua garantia se ela passar do prazo e der problema. Fora a agenda com link e o controle da venda de produto.',
    armasSolo:
      'A ficha capilar fica digital — química anterior, reação alérgica, couro cabeludo — e a cliente assina o TERMO DE TRANÇAS na tela: tempo de uso recomendado e manutenção. Se ela passar do prazo e der problema, você tem a prova. Vira PDF e vai pro WhatsApp dela. A agenda tem link, e a venda de produto entra na comanda.',
    armasEquipe:
      'A ficha capilar fica digital e a cliente assina o termo de tranças na tela — tempo de uso e manutenção, com a sua isenção se ela passar do prazo. A comissão calcula sobre o que a cliente pagou de verdade, e cada profissional vê a dela no celular. E a recepção marca e fecha comanda sem ver o seu faturamento.',
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
      'Voltando rapidinho. O termo de tranças deixa por escrito o tempo de uso e a manutenção, assinado ' +
      'pela cliente na tela — se ela passar do prazo e der problema, você tem a prova. E o sistema ainda ' +
      'pede pra ela te avaliar no Google em troca de pontos, o que traz cliente novo. Quer ver em 10 minutos?',
    d7:
      'Vou parar de escrever pra não encher. Se um dia quiser ter a ficha capilar e o termo assinado ' +
      'guardados de verdade, me chama. Sucesso com o studio.',
    fechar:
      'São 7 dias de teste, sem setup e sem cartão. Você cria seu studio em minutos, e a ficha capilar e o ' +
      'termo de tranças já vêm prontos no sistema. Você atende uma cliente com eles essa semana. ' +
      'Qualquer dúvida eu te ajudo. Me manda seus serviços com preço?',
    jaTem:
      'Boa. Ele tem ficha capilar (química anterior, reação alérgica, couro cabeludo) e termo de tranças ' +
      'assinado pela cliente? Sistema de agenda comum não tem — eles marcam horário e param aí.',
    curioso:
      'Show. O centro é a ficha capilar e o termo de tranças assinado na tela — vira PDF e vai pro ' +
      'WhatsApp da cliente. Mais a agenda com link e a venda de produto entrando na comanda. 7 dias de ' +
      'teste, sem cartão — você monta em minutos e eu te ajudo no que travar. Me manda seus serviços com preço?',
  },

  /* ─────────────────────────────────────────────── OUTRO (nicho não identificado) */
  OUTRO: {
    trato: 'seu negócio',
    pitch:
      'Ele organiza a agenda (com link pro cliente marcar sozinho), a comanda e o financeiro que te mostra o que sobrou de verdade no fim do mês, não só o que entrou. E ainda ajuda a trazer cliente novo: quem te avalia no Google ganha ponto, e cada cliente tem um link de indicação.',
    armasSolo:
      'A agenda tem link: o cliente marca sozinho, sem te mandar mensagem, e cada serviço já entra com a duração certa. A comanda fecha o atendimento e a venda no mesmo lugar. E o financeiro te mostra o que SOBROU no fim do mês — já fora a taxa do cartão —, não só o que entrou.',
    armasEquipe:
      'A agenda tem link, por profissional. A comissão calcula sobre o que o cliente pagou DE VERDADE: se você deu desconto, ela acompanha, e só conta depois que ele pagou — cada um vê a dele no celular. E a recepção marca e fecha comanda sem enxergar o seu faturamento.',
    pergunta: 'hoje você controla os horários no caderno, no WhatsApp, ou já usa algum sistema?',
    arma:
      'Agenda com link (a cliente marca sozinha), comanda, controle do que entrou e do que saiu, e o ' +
      'financeiro mostrando o que SOBROU de verdade — não só o faturamento.',
    caro:
      'Sem fidelidade e sem taxa de setup: se em um mês não fizer sentido pra você, cancela e pronto. O que ' +
      'eu peço é uma semana de teste antes de você decidir.',
    d3:
      'Passando de novo, sem pressão. Uma coisa que quase ninguém repara: o sistema não só organiza, ele ' +
      'TRAZ cliente novo — o cliente avalia você no Google e ganha pontos por isso, e cada um tem um link ' +
      'de indicação próprio. Se fizer sentido, te mostro rodando em 10 minutos, com o seu negócio dentro. Quer?',
    d7:
      'Vou parar de te escrever pra não encher. Se um dia quiser botar a agenda e o financeiro em ordem, ' +
      'é só me chamar aqui. Sucesso.',
    fechar:
      'São 7 dias de teste, sem taxa de setup e sem cartão. Você cria o seu negócio dentro em poucos ' +
      'minutos, e eu fico do seu lado pra qualquer dúvida. Me manda a lista de serviços com preço que a gente começa?',
    jaTem:
      'Boa. Deixa eu te perguntar: ele desloga no meio do atendimento, com cliente esperando? E te mostra ' +
      'quanto SOBROU no fim do mês, ou só quanto entrou? São as duas reclamações que eu mais escuto.',
    curioso:
      'Show. Agenda com link pra cliente marcar sozinha, comanda, e o financeiro mostrando o lucro real. ' +
      '7 dias de teste, sem setup — você monta em minutos e eu te ajudo no que travar. Me manda seus serviços com preço?',
  },
}

/* ═══════════════════════════════════════════════════════════════════════
   O QUE MUDA POR SITUAÇÃO — só a abertura (msg1)
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * A MSG 1 (reescrita 14/07/2026, decisão do Eduardo).
 *
 * O QUE MUDOU E POR QUÊ:
 *
 * 1. CAIU o "já aviso que é mensagem de vendedor". Eu tinha essa regra no arsenal
 *    ("robô nunca se entrega") — e TRÊS LINHAS ABAIXO a regra oposta, da Gong:
 *    "abrir se desculpando derruba a conversão em 40%; no começo vira pedido de
 *    desculpa por existir". As duas se contradiziam e eu não confrontei. Pior: a
 *    frase que existia pra não parecer robô virou A ASSINATURA do robô, idêntica
 *    em 695 mensagens.
 *
 * 2. ENTROU a apresentação real: nome, empresa, cidade e — o que mais importa —
 *    "criei o AgendaPRO". Não é revendedor mandando mensagem: é o cara que fez o
 *    sistema. Trinks e Booksy têm 40 mil clientes e suporte robô; NENHUM deles
 *    pode dizer isso, nem "eu passo aí amanhã".
 *
 * 3. A msg 1 agora APRESENTA O PRODUTO e o que ele resolve. A versão anterior era
 *    só uma pergunta de diagnóstico — e um estranho fazendo pergunta não ganha
 *    resposta. Ela precisa ver, na primeira mensagem, que existe solução.
 *
 * 4. ⚠️ NÃO FAZ AFIRMAÇÃO SOBRE O NEGÓCIO DO CLIENTE (bronca do Eduardo, 15/07).
 *    Fora "sei que você usa sistema", "vi que você tem site", situação e porte na
 *    abertura. Eu não fui lá, não vi, não agendei — não finjo que sei. A msg 1
 *    VENDE O AGENDAPRO: o que o produto faz, verdadeiro pra qualquer tamanho.
 *
 * 5. O FECHAMENTO OFERECE A VISITA. As duas saídas são "sim" — ele escolhe entre
 *    WhatsApp e visita, não entre responder e ignorar.
 */
function abertura(c: PerfilCopy, nomeBruto: string, nicho: string): string {
  const nome = comoChamar(nomeBruto)
  const oi = nome ? `Olá, ${nome}!` : 'Olá, tudo bem?'

  const euSou =
    `Sou o Eduardo, da Impulso Digital, aqui de Palmas. Desenvolvi o AgendaPRO, um sistema pra ${c.trato}.`

  const gestao = GESTAO_MSG1[nicho] ?? GESTAO_MSG1.OUTRO

  const convite = `Te mostro rodando em 10 minutos por aqui, ou prefere que eu passe aí?`

  return [`${oi} ${euSou}`, CRESCIMENTO_MSG1, gestao, convite].join('\n\n')
}

/* ═══════════════════════════════════════════════════════════════════════
   DEMO POR NICHO — a PROVA que entra na copy quando a lead engaja
   ═══════════════════════════════════════════════════════════════════════

   Negócios demo montados no AgendaPRO (1 por nicho, fictícios). O link entra
   SÓ no curioso e no d3 — NUNCA na msg 1 (link em mensagem fria = flag de spam).

   λ.não-inventar: os demos têm agenda e avaliações FABRICADAS. Então a copy diz
   "montei um exemplo pra você ver como fica" — NUNCA "um cliente meu". */
const DEMOS: Record<string, { url: string; oque: string }> = {
  barbearia:   { url: 'agendapro.net.br/imperio-barbershop', oque: 'de barbearia' },
  lash:        { url: 'agendapro.net.br/demo-lash',          oque: 'de studio de cílios' },
  sobrancelha: { url: 'agendapro.net.br/demo-lash',          oque: 'de studio' },
  salao:       { url: 'agendapro.net.br/studio-marcela',     oque: 'de salão' },
  trancas:     { url: 'agendapro.net.br/studio-marcela',     oque: 'de salão' },
  nail:        { url: 'agendapro.net.br/studio-larissa',     oque: 'de studio de unhas' },
  // estetica e OUTRO: sem demo que case — não injeta link (mismatch é pior que nada)
}

function demoCurioso(nicho: string): string {
  const d = DEMOS[nicho]
  if (!d) return ''
  return `\n\nQuer ver como fica antes de decidir? Montei um exemplo ${d.oque} no sistema — repara na agenda, no programa de pontos e nas avaliações do Google rodando: ${d.url}`
}

function demoD3(nicho: string): string {
  const d = DEMOS[nicho]
  if (!d) return ''
  return ` Aliás, montei um exemplo ${d.oque} pra você ver funcionando agora: ${d.url}`
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
  /** JSON das avaliações do Google — é o que prova se ela tem equipe */
  reviews_texto?: string | null
}): PlaybookLocal {
  const nicho = detectarNicho(lead.categoria ?? '', lead.nome ?? '') ?? 'OUTRO'
  const c = COPY[nicho] ?? COPY.OUTRO
  const sit = situacaoDoLead(lead)

  // PORTE: padrão é SOLO. Só vira equipe com PROVA nas avaliações. Ver lib/porte.ts.
  let reviews: ReviewLite[] = []
  try { reviews = JSON.parse(String(lead.reviews_texto ?? '[]')) } catch { reviews = [] }
  const ev = detectarPorte({ nome: lead.nome, categoria: lead.categoria ?? '', reviews })
  const porte = ev.porte

  // quem já usa sistema tem uma resposta de objeção diferente: a dor é o sistema dela
  const jaTem =
    sit === 'USA_SISTEMA'
      ? `${c.jaTem} E olha: o meu não desloga no meio do atendimento, e não tem fidelidade — você cancela quando quiser.`
      : c.jaTem

  return {
    msg1: abertura(c, lead.nome, nicho),
    porte,
    porte_motivo: ev.motivo,
    se_responder_curioso: c.curioso + demoCurioso(nicho),
    se_disser_ja_tenho_sistema: jaTem,
    se_disser_nao_tenho_tempo: NAO_TENHO_TEMPO,
    se_disser_ta_caro: c.caro,
    se_perguntar_whatsapp_automatico: WHATSAPP,
    se_perguntar_nota_fiscal: NOTA_FISCAL,
    se_disser_vou_ter_que_digitar_tudo: MIGRACAO,
    o_motor_de_crescimento: CRESCIMENTO,
    se_sumir_d3: c.d3 + demoD3(nicho),
    se_sumir_d7: c.d7,
    como_fechar: c.fechar,
    modelo: `local:${nicho}/${sit}/${porte}`,
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
