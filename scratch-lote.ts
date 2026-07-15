import {config} from 'dotenv'; config({path:'.env.local'})
import {getClient} from './lib/db'
import {detectarNicho} from './lib/nichos'
async function main(){
  const db=getClient()

  // 4 já-usa (corrigidos): Toledo(311), Souto, Barbaterapia, RM
  const jaUsa=await db.execute(`SELECT id,nome FROM leads WHERE status!='arquivado' AND tipo='agendapro'
    AND sistema_detectado IS NOT NULL AND telefone IS NOT NULL AND disparado_em IS NULL
    AND (id=311 OR nome LIKE 'Souto%' OR nome LIKE 'Barbaterapia%' OR nome LIKE 'barbearia RM%') LIMIT 4`)
  const ids:number[]=[]
  for(const x of jaUsa.rows as any[]) ids.push(x.id)

  // 6 frescos com avaliação coletada, 1-2 por nicho, os maiores
  const fresco=await db.execute(`SELECT id,nome,categoria,num_avaliacoes FROM leads
    WHERE status!='arquivado' AND tipo='agendapro' AND sistema_detectado IS NULL
      AND telefone IS NOT NULL AND disparado_em IS NULL AND reviews_texto IS NOT NULL
    ORDER BY num_avaliacoes DESC`)
  const porNicho=new Map<string,number>()
  for(const x of fresco.rows as any[]){
    const n=detectarNicho(x.categoria??'',x.nome??'')??'outro'
    const usados=porNicho.get(n)??0
    if(usados>=2) continue
    if(ids.length>=10) break
    // limita a 2 barbearia, 2 salão, resto 1
    const cap=(n==='barbearia'||n==='salao')?2:1
    if(usados>=cap) continue
    ids.push(x.id); porNicho.set(n,usados+1)
  }

  // marca selecionado
  await db.execute(`UPDATE leads SET selecionado=0 WHERE selecionado=1`)
  for(const id of ids) await db.execute({sql:`UPDATE leads SET selecionado=1 WHERE id=?`,args:[id]})

  console.log(`LOTE DIA 1 (${ids.length} leads):`)
  const r=await db.execute(`SELECT nome,categoria,sistema_detectado,script_json FROM leads WHERE selecionado=1`)
  for(const x of r.rows as any[]){
    const p=JSON.parse(x.script_json)
    const n=detectarNicho(x.categoria??'',x.nome??'')??'?'
    console.log(`  ${x.sistema_detectado?'🔥':'  '} ${n.padEnd(11)} ${String(x.nome).slice(0,34).padEnd(35)} [${p.porte}]`)
  }
}
main()
