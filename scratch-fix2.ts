import {config} from 'dotenv'; config({path:'.env.local'})
import {getClient} from './lib/db'
import {gerarPlaybookLocal} from './lib/playbook-local'
async function main(){
  const db=getClient()
  // 1. arquiva as linhas fantasma da Toledo (sem telefone)
  await db.execute(`UPDATE leads SET status='arquivado', notas=COALESCE(notas,'')||' [dup sem telefone]'
    WHERE nome LIKE '%Toledo%' AND telefone IS NULL AND status!='arquivado'`)
  console.log('✅ linhas fantasma da Toledo arquivadas')

  // 2. barbearia/salão com 150+ aval e SEM review coletado → força equipe.
  //    (nail/lash/sobrancelha ficam solo — profissional individual pode ter muita aval sozinha)
  const alvos=await db.execute(`SELECT id,nome,categoria,sistema_detectado,nivel_consciencia,reviews_texto,num_avaliacoes
    FROM leads WHERE status!='arquivado' AND tipo='agendapro' AND num_avaliacoes>=150
      AND reviews_texto IS NULL
      AND (categoria LIKE '%arbearia%' OR categoria LIKE '%al%o%' OR nome LIKE '%arbearia%' OR nome LIKE '%Barber%')
      AND script_json LIKE '%"porte":"solo"%'`)
  let n=0
  for(const l of alvos.rows as any[]){
    // gera com um review fake que prova equipe, pra reusar a mesma lógica
    const pb=gerarPlaybookLocal({...l, reviews_texto: JSON.stringify([{nota:5,texto:'atendido pela recepção, equipe excelente, os barbeiros são ótimos'}])})
    await db.execute({sql:`UPDATE leads SET script_json=?, mensagem=? WHERE id=?`,
      args:[JSON.stringify(pb), pb.msg1, l.id]})
    console.log(`  👥 ${l.num_avaliacoes}★ ${String(l.nome).slice(0,36)} → equipe`)
    n++
  }
  console.log(`\n✅ ${n} barbearias/salões grandes corrigidos pra equipe`)
}
main()
