import {config} from 'dotenv'; config({path:'.env.local'})
import {getClient} from './lib/db'
import {existsSync,readdirSync} from 'fs'
async function main(){
  const db=getClient()

  // 1. disparos_log vazio? (garante que amanhã é DIA 1 = teto 10)
  let logN=0
  try{ const r=await db.execute(`SELECT count(*) n FROM disparos_log`); logN=(r.rows[0] as any).n }catch{}

  // 2. sessão do WhatsApp persistida? (pra não precisar reler QR amanhã)
  const waDir='.wa-session'
  const temSessao=existsSync(waDir) && readdirSync(waDir).some(f=>f.includes('creds'))

  console.log('═'.repeat(60))
  console.log('PREPARO PRA AMANHÃ')
  console.log('═'.repeat(60))
  console.log(`disparos já registrados : ${logN}  ${logN===0?'→ amanhã é DIA 1, teto 10 ✅':'⚠️ já tem disparo hoje'}`)
  console.log(`sessão WhatsApp salva    : ${temSessao?'SIM ✅ (não precisa reler QR)':'NÃO ⚠️'}`)

  // 3. as 10 primeiras da fila — MESMA ordem do /api/fila
  const r=await db.execute(`
    SELECT nome,categoria,telefone,sistema_detectado,mensagem,script_json
      FROM leads
     WHERE status!='arquivado' AND telefone IS NOT NULL AND disparado_em IS NULL AND tipo='agendapro'
     ORDER BY CASE WHEN script_json LIKE '%manual:estudado%' THEN 0 ELSE 1 END,
              CASE WHEN sistema_detectado IS NOT NULL THEN 0 ELSE 1 END,
              COALESCE(num_avaliacoes,0) DESC
     LIMIT 10`)
  console.log(`\nAS 10 QUE SAEM AMANHÃ (na ordem):\n`)
  let i=1
  for(const x of r.rows as any[]){
    const p=JSON.parse(x.script_json)
    console.log('─'.repeat(60))
    console.log(`${i++}. ${x.nome}  ${x.sistema_detectado?'🔥 usa '+x.sistema_detectado:''}  [porte: ${p.porte}]`)
    console.log('─'.repeat(60))
    console.log(x.mensagem)
    console.log('')
  }
}
main()
