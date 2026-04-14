import { NextRequest, NextResponse } from 'next/server'
import { analisarLink } from '@/lib/analyzer'
import { inserirLead } from '@/lib/db'
import { calcularScore } from '@/lib/score'

export async function POST(req: NextRequest) {
  const { url, salvar, tipo } = await req.json()

  if (!url) return NextResponse.json({ error: 'URL obrigatória' }, { status: 400 })

  try {
    const analise = await analisarLink(url)

    // Se pediu pra salvar, insere no banco
    if (salvar && analise.nome) {
      const tipoFinal = tipo || analise.tipo_detectado
      const score = calcularScore({ ...analise, tipo: tipoFinal })
      const mensagem = tipoFinal === 'lp' ? analise.mensagem_lp
        : tipoFinal === 'shopify' ? analise.mensagem_shopify
        : analise.mensagem_agendapro

      inserirLead({
        nome:                 analise.nome,
        categoria:            analise.categoria,
        tipo:                 tipoFinal,
        telefone:             analise.telefone ?? undefined,
        instagram:            analise.instagram ?? undefined,
        instagram_url:        analise.instagram_url ?? undefined,
        instagram_bio:        analise.instagram_bio ?? undefined,
        instagram_seguidores: analise.instagram_seguidores ?? undefined,
        site:                 analise.site ?? undefined,
        endereco:             analise.endereco ?? undefined,
        nota:                 analise.nota ?? undefined,
        num_avaliacoes:       analise.num_avaliacoes ?? undefined,
        tem_site:             analise.tem_site,
        tem_ecommerce:        analise.tem_ecommerce,
        tem_agendamento:      analise.tem_agendamento,
        fonte:                analise.fonte,
        mensagem,
        score,
      })
    }

    return NextResponse.json(analise)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
