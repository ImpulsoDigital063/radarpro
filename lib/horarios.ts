/**
 * Melhor horário pra mandar mensagem por tipo de negócio.
 * Heurística validada: salão não responde durante movimento, advogado só à tarde, etc.
 */

export type JanelaHorario = {
  janela:   string  // ex: "9h-11h"
  dias:     string  // ex: "seg-qua"
  motivo:   string  // ex: "antes do movimento do salão"
}

const MAPA: Array<{ match: RegExp; horario: JanelaHorario }> = [
  // Beleza com movimento contínuo — responder antes do expediente
  { match: /barbear|salão|salao|cabelelei|nail|manicure|pedicur|design.*sobranc|estet|depila|sobranc|maquiad/i,
    horario: { janela: '9h-11h', dias: 'seg-qua', motivo: 'antes do movimento começar no salão' } },

  // Saúde com consulta marcada — intervalo entre atendimentos
  { match: /nutric|psicol|fisio|fonoaudiol|terape|massoter|pilates|personal/i,
    horario: { janela: '11h-13h ou 17h-19h', dias: 'seg-qua', motivo: 'entre atendimentos ou no fim do expediente' } },

  // Odonto/estética médica — tarde livre
  { match: /dent|ortodon|médic|medic|clínic.*estét|clinic.*estet|harmoniza/i,
    horario: { janela: '14h-17h', dias: 'ter-qui', motivo: 'tarde calma de consultório' } },

  // Direito/contabilidade — expediente administrativo
  { match: /advoc|advog|jurídic|juridic|contab|contador|advogad/i,
    horario: { janela: '14h-17h', dias: 'ter-qui', motivo: 'horário de expediente administrativo' } },

  // Alimentação/confeitaria — manhã cedo antes da produção
  { match: /confeit|doceria|bolo|padaria|pizzar|restauran|food|lanche|bar|pub|açaí|acai/i,
    horario: { janela: '8h-10h', dias: 'seg-ter', motivo: 'antes da produção começar' } },

  // Comércio varejo — horário comercial clássico
  { match: /loja|boutique|modas|roupas|calçad|calcad|acessóri|acessori|joal|perfum|cosmét|cosmet|suplement|pet|papelari|flori|presenteria|artesan/i,
    horario: { janela: '10h-12h', dias: 'ter-qui', motivo: 'horário comercial, antes do almoço' } },

  // Serviços B2B/coach/consultoria
  { match: /coach|consult|mentor|arquitet|design de interior|engenh|marketing/i,
    horario: { janela: '14h-16h', dias: 'ter-qui', motivo: 'meio da tarde produtiva' } },

  // Fotografia/filmagem/criação
  { match: /fotógraf|fotograf|videógraf|videograf|filmmak|audiovisual|product|criador/i,
    horario: { janela: '15h-18h', dias: 'ter-qui', motivo: 'pós-edição, antes de ensaios' } },
]

const PADRAO: JanelaHorario = {
  janela: '10h-12h ou 14h-17h',
  dias:   'ter-qui',
  motivo: 'horário comercial padrão',
}

export function melhorHorarioPara(categoria: string, tipo?: string): JanelaHorario {
  const texto = `${categoria ?? ''} ${tipo ?? ''}`.toLowerCase()
  for (const { match, horario } of MAPA) {
    if (match.test(texto)) return horario
  }
  return PADRAO
}
