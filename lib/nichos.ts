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
    return 'NICHO: não identificado com precisão. Use a pergunta de diagnóstico e NÃO chute a dor dela.'
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
    ...(n.naoServe.length
      ? ['', 'NÃO OFEREÇA (não serve pra esse nicho):', ...n.naoServe.map((x) => `  ✗ ${x}`)]
      : []),
    '',
    `PERGUNTA MAIS FORTE PRA ESSE NICHO:`,
    `  "${n.perguntaChave}"`,
  ].join('\n')
}
