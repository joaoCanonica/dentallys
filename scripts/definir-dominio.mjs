#!/usr/bin/env node
// Troca a origem do site em canonical, og:*, JSON-LD, sitemap e robots.
// Uso: node scripts/definir-dominio.mjs https://dentallys.com.br
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const novo = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+$/i.test(novo)) { console.error('Informe a origem: node scripts/definir-dominio.mjs https://dominio'); process.exit(1); }
const atual = readFileSync(join(ROOT, 'robots.txt'), 'utf8').match(/Sitemap:\s*(https?:\/\/[^/\s]+)/)[1];
if (atual === novo) { console.log('Origem já é ' + novo); process.exit(0); }
const arquivos = [...readdirSync(ROOT).filter((f) => f.endsWith('.html')), 'sitemap.xml', 'robots.txt'];
for (const f of arquivos) {
  const s = readFileSync(join(ROOT, f), 'utf8');
  const t = s.split(atual).join(novo);
  if (t !== s) { writeFileSync(join(ROOT, f), t); console.log('alterado: ' + f); }
}
