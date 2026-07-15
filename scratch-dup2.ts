import {config} from 'dotenv'; config({path:'.env.local'})
import {getClient} from './lib/db'
async function main(){
  const db=getClient()
  // Toledo duplicado
  const t=await db.execute(`SELECT id,nome,telefone,num_avaliacoes,disparado_em FROM leads
    WHERE status!='arquivado' AND nome LIKE '%Toledo%'`)
  console.log('LEADS "Toledo":')
  for(const x of t.rows as any[]) console.log(`  [${x.id}] ${x.nome} · tel ${x.telefone} · ${x.num_avaliacoes}aval`)

  // quantos "já usa sistema" no total, e quantos frescos?
  const s=await db.execute(`SELECT
    SUM(CASE WHEN sistema_detectado IS NOT NULL THEN 1 ELSE 0 END) usa,
    SUM(CASE WHEN sistema_detectado IS NULL THEN 1 ELSE 0 END) fresco
    FROM leads WHERE status!='arquivado' AND tipo='agendapro' AND telefone IS NOT NULL AND disparado_em IS NULL`)
  const r=s.rows[0] as any
  console.log(`\nfila: ${r.usa} já usam sistema · ${r.fresco} frescos`)

  // leads com muitas avaliações marcados como solo (erro provável)
  const bad=await db.execute(`SELECT nome,num_avaliacoes,script_json FROM leads
    WHERE status!='arquivado' AND tipo='agendapro' AND num_avaliacoes>=150
      AND script_json LIKE '%"porte":"solo"%' ORDER BY num_avaliacoes DESC LIMIT 12`)
  console.log(`\nMUITA AVALIAÇÃO mas marcado SOLO (provável erro):`)
  for(const x of bad.rows as any[]) console.log(`  ${x.num_avaliacoes}★ ${x.nome}`)
}
main()
