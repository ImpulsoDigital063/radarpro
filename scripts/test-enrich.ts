import axios from 'axios'
import fs from 'fs'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function main() {
  const url = 'https://www.instagram.com/lud.moreira/'
  const { data: html } = await axios.get(url, {
    timeout: 15000,
    headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR,pt;q=0.9' },
  })

  // Procura por padrões usuais do IG
  console.log('--- Procurando meta tags e dados embutidos ---')

  const patterns = [
    { nome: 'og:description',   re: /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i },
    { nome: 'og:title',         re: /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i },
    { nome: 'meta description', re: /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i },
    { nome: 'edge_followed_by', re: /"edge_followed_by":\{"count":(\d+)\}/ },
    { nome: 'follower_count',   re: /"follower_count":(\d+)/ },
    { nome: 'biography',        re: /"biography":"([^"]{1,300})"/ },
    { nome: 'full_name',        re: /"full_name":"([^"]{1,100})"/ },
  ]

  for (const { nome, re } of patterns) {
    const m = html.match(re)
    console.log(`${nome}:`, m ? m[1].slice(0, 200) : 'NÃO ENCONTRADO')
  }

  // Salva amostra
  fs.writeFileSync('C:\\temp\\ig-sample.html', html.slice(0, 50000))
  console.log('\nAmostra salva em C:\\temp\\ig-sample.html')
}
main().catch((e) => console.log('ERRO:', e.message))
