// Sistema de score automático — 0 a 10
// Quanto maior o score, mais quente o lead

export type LeadData = {
  telefone?: string | null
  instagram?: string | null
  instagram_seguidores?: string | null
  site?: string | null
  tem_site?: boolean | number
  tem_ecommerce?: boolean | number
  tem_agendamento?: boolean | number
  nota?: number | null
  num_avaliacoes?: number | null
  tipo: 'lp' | 'shopify' | 'agendapro'
}

export function calcularScore(lead: LeadData): number {
  let score = 0

  // Tem telefone — contato direto possível (+2)
  if (lead.telefone) score += 2

  // Tem Instagram ativo — já usa digital (+2)
  if (lead.instagram) score += 2

  // Nota Google alta — negócio sólido (+1)
  if (lead.nota && lead.nota >= 4.0) score += 1

  // Muitas avaliações — movimento real (+1)
  if (lead.num_avaliacoes && lead.num_avaliacoes >= 20) score += 1

  // Score específico por tipo
  if (lead.tipo === 'lp') {
    // Não tem site = dor clara = lead quente (+3)
    if (!lead.tem_site) score += 3
    // Tem site mas fraco = oportunidade de refazer (+1)
    else score += 1
  }

  if (lead.tipo === 'shopify') {
    // Não tem e-commerce = dor clara (+3)
    if (!lead.tem_ecommerce) score += 3
    else score += 1
  }

  if (lead.tipo === 'agendapro') {
    // Não tem sistema de agendamento (+3)
    if (!lead.tem_agendamento) score += 3
    else score += 1
  }

  return Math.min(score, 10)
}

export function labelScore(score: number): { label: string; cor: string; emoji: string } {
  if (score >= 8) return { label: 'Quente',  cor: '#EF4444', emoji: '🔥' }
  if (score >= 6) return { label: 'Morno',   cor: '#F59E0B', emoji: '⚡' }
  if (score >= 4) return { label: 'Frio',    cor: '#3B82F6', emoji: '❄️' }
  return           { label: 'Gelado', cor: '#6B7280', emoji: '💤' }
}
