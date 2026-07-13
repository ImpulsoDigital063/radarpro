/**
 * Prova de fogo da trava de disparo (lib/disparo-guard).
 * Roda contra o Turso REAL. Não envia nada — só testa as regras.
 *   npx tsx scripts/testar-guard.ts
 */
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import {
  podeDisparar, jaAbordado, enviadasHoje, registrarDisparo,
  intervaloAleatorioMs, limiteDoDia, normalizarTelefone, GUARD_PADRAO,
} from '../lib/disparo-guard'
import { getClient } from '../lib/db'

const TEL_FAKE = '63999990000'

async function main() {
  console.log('=== TRAVA DE DISPARO — prova contra o Turso real ===\n')

  console.log('Config:', JSON.stringify(GUARD_PADRAO))
  console.log('Rampa de aquecimento — dia 1:', limiteDoDia(1), '| dia 3:', limiteDoDia(3), '| dia 7+:', limiteDoDia(7))
  console.log('')

  const hoje = await enviadasHoje()
  console.log(`1. Mensagens enviadas hoje: ${hoje} / ${GUARD_PADRAO.limiteDiario}`)

  console.log('\n2. Telefone inválido:')
  console.log('  ', JSON.stringify(await podeDisparar('123')))

  console.log('\n3. Telefone válido, nunca abordado:')
  const v1 = await podeDisparar(TEL_FAKE)
  console.log('  ', JSON.stringify(v1))
  const hora = new Date().getHours()
  if (!v1.pode && v1.codigo === 'fora_de_horario') {
    console.log(`   (são ${hora}h — a janela é ${GUARD_PADRAO.horaInicio}h-${GUARD_PADRAO.horaFim}h. A trava está funcionando.)`)
  }

  console.log('\n4. ANTI-DUPLICADO — registrando um disparo fake e testando de novo:')
  console.log('   antes  → jaAbordado:', await jaAbordado(TEL_FAKE))
  await registrarDisparo(TEL_FAKE)
  console.log('   depois → jaAbordado:', await jaAbordado(TEL_FAKE))
  const v2 = await podeDisparar(TEL_FAKE)
  console.log('   podeDisparar:', JSON.stringify(v2))

  console.log('\n5. Intervalo aleatório entre envios (5 amostras, em segundos):')
  console.log('  ', Array.from({ length: 5 }, () => (intervaloAleatorioMs() / 1000).toFixed(1)).join('s · ') + 's')

  console.log('\n6. Normalização de telefone:')
  for (const t of ['63999990000', '(63) 99999-0000', '5563999990000']) {
    console.log(`   ${t.padEnd(20)} → ${normalizarTelefone(t)}`)
  }

  // limpeza do registro fake
  const db = getClient()
  await db.execute({ sql: `DELETE FROM disparos_log WHERE telefone = ?`, args: [normalizarTelefone(TEL_FAKE)] })
  console.log('\n7. Limpeza: registro de teste removido.')
  console.log('   jaAbordado após limpar:', await jaAbordado(TEL_FAKE))

  console.log('\n=== FIM ===')
}

main().catch((e) => { console.error('ERRO:', e.message); process.exit(1) })
