/**
 * PORTE DO NEGÓCIO — sozinha ou com equipe?
 *
 * POR QUE ISSO EXISTE (Eduardo, 14/07/2026):
 * Eu estava mandando "a recepção marca sem ver o seu faturamento" pra TODO mundo.
 * Uma lash designer que trabalha sozinha lê isso e conclui: "esse sistema é pra
 * salão grande, não é pra mim." Ela se desqualifica sozinha, na terceira linha,
 * antes de chegar no que interessava a ela (a ficha, o lote da cola).
 *
 * O ERRO É ASSIMÉTRICO — e é isso que define a regra:
 *   · salão grande recebendo mensagem de solo  → responde e diz "tenho equipe também"
 *   · manicure sozinha recebendo msg de equipe → SOME
 * Errar pra baixo é recuperável. Pra cima, não.
 *
 * Então: o padrão é SOLO. Só vira EQUIPE com PROVA — evidência escrita nas
 * avaliações do próprio negócio. Nunca por chute, nunca por nº de avaliações.
 */

export type Porte = 'solo' | 'equipe'

export type EvidenciaPorte = {
  porte: Porte
  /** por que decidimos assim — uso interno, nunca vai pra mensagem */
  motivo: string
  /** trecho da avaliação que provou (quando houver) */
  prova: string | null
}

/** Palavras que só aparecem quando existe RECEPÇÃO de verdade. */
const RECEPCAO = /\b(recep[çc][ãa]o|recepcionista|atendente|secret[áa]ria|menina da frente)\b/i

/**
 * Palavras que indicam EQUIPE (mais de uma pessoa atendendo).
 * "as meninas" é o marcador mais forte em salão — cliente não diz isso de quem
 * trabalha sozinha.
 */
const EQUIPE = /\b(as meninas|os meninos|a equipe|toda a equipe|todos os profissionais|os barbeiros|as profissionais|os profissionais|equipe de|funcion[áa]ri[oa]s?|colaborador)\b/i

/**
 * "o barbeiro X", "com a Fulana", "atendida pela Beltrana" — quando a MESMA
 * avaliação cita profissional por nome E o negócio não leva o nome dele, é sinal
 * de que tem gente contratada. Sozinho, é sinal fraco: exigimos 2+ nomes distintos.
 */
const CITA_PROFISSIONAL =
  /\b(?:com o|com a|pelo|pela|atendid[oa] (?:pel[oa]|por)|meu barbeiro|minha (?:cabeleireira|manicure|designer))\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,})/g

export type ReviewLite = { nota?: number | null; texto: string }

export function detectarPorte(params: {
  nome: string
  categoria: string
  reviews?: ReviewLite[] | null
}): EvidenciaPorte {
  const reviews = params.reviews ?? []
  const corpo = reviews.map((r) => r.texto ?? '').join('\n')

  // ── PROVA 1: alguém citou a RECEPÇÃO. É o sinal mais forte que existe.
  const mRec = corpo.match(RECEPCAO)
  if (mRec) {
    return {
      porte: 'equipe',
      motivo: `avaliação cita recepção/atendente ("${mRec[0]}")`,
      prova: trecho(corpo, mRec.index ?? 0),
    }
  }

  // ── PROVA 2: alguém falou da EQUIPE no plural.
  const mEq = corpo.match(EQUIPE)
  if (mEq) {
    return {
      porte: 'equipe',
      motivo: `avaliação fala da equipe no plural ("${mEq[0]}")`,
      prova: trecho(corpo, mEq.index ?? 0),
    }
  }

  // ── PROVA 3: clientes diferentes citam profissionais DIFERENTES pelo nome.
  //    Um nome só pode ser o próprio dono. Dois ou mais = tem gente trabalhando.
  const nomes = new Set<string>()
  const nomeDoNegocio = (params.nome ?? '').toLowerCase()
  let m: RegExpExecArray | null
  const re = new RegExp(CITA_PROFISSIONAL.source, 'g')
  while ((m = re.exec(corpo)) !== null) {
    const n = m[1]
    // se o nome do profissional está no nome do negócio, é o dono — não conta
    if (nomeDoNegocio.includes(n.toLowerCase())) continue
    nomes.add(n.toLowerCase())
  }
  if (nomes.size >= 2) {
    return {
      porte: 'equipe',
      motivo: `clientes citam ${nomes.size} profissionais diferentes: ${[...nomes].slice(0, 4).join(', ')}`,
      prova: null,
    }
  }

  // ── SEM PROVA → SOLO. É o padrão seguro.
  return {
    porte: 'solo',
    motivo: reviews.length
      ? 'nenhuma avaliação menciona recepção, equipe ou 2+ profissionais'
      : 'sem avaliações lidas — assume solo (o erro pra baixo é recuperável)',
    prova: null,
  }
}

function trecho(corpo: string, i: number): string {
  const ini = Math.max(0, i - 60)
  return corpo.slice(ini, i + 80).replace(/\s+/g, ' ').trim()
}
