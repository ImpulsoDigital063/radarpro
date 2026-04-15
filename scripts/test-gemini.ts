import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { GoogleGenerativeAI } from '@google/generative-ai'

const MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.5-flash',
]

async function main() {
  const key = process.env.GEMINI_API_KEY
  if (!key) { console.error('sem GEMINI_API_KEY'); process.exit(1) }
  const genAI = new GoogleGenerativeAI(key)

  for (const m of MODELS) {
    process.stdout.write(`${m.padEnd(30)} ... `)
    try {
      const model = genAI.getGenerativeModel({ model: m })
      const r = await model.generateContent('Say OK in 1 word.')
      const text = r.response.text().trim().slice(0, 30)
      console.log(`✅ "${text}"`)
    } catch (e: any) {
      const msg = String(e?.message ?? e).replace(/\s+/g, ' ').slice(0, 160)
      console.log(`❌ ${msg}`)
    }
  }
}

main().catch(console.error)
