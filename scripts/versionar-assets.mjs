#!/usr/bin/env node
// Põe ?v=<hash> nas URLs de css/site.css e js/site.js em todos os .html da raiz.
// Rode depois de editar o CSS ou o JS. Idempotente. Uso: node scripts/versionar-assets.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ASSETS = { css: 'css/site.css', js: 'js/site.js' };
export const hashOf = (f) => createHash('sha1').update(readFileSync(join(ROOT, f))).digest('hex').slice(0, 8);

if (import.meta.url === `file://${process.argv[1]}`) {
  const v = { css: hashOf(ASSETS.css), js: hashOf(ASSETS.js) };
  let changed = 0;
  for (const f of readdirSync(ROOT).filter((x) => x.endsWith('.html'))) {
    const s = readFileSync(join(ROOT, f), 'utf8');
    const t = s
      .replace(/href="\/css\/site\.css(?:\?v=[^"]*)?"/g, `href="/css/site.css?v=${v.css}"`)
      .replace(/src="\/js\/site\.js(?:\?v=[^"]*)?"/g, `src="/js/site.js?v=${v.js}"`);
    if (t !== s) { writeFileSync(join(ROOT, f), t); changed++; console.log(`alterado: ${f}`); }
  }
  console.log(changed ? `${changed} arquivo(s) atualizados (css ${v.css}, js ${v.js}).` : `Nada a mudar (css ${v.css}, js ${v.js}).`);
}
