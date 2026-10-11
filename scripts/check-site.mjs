#!/usr/bin/env node
// Verificação do site estático. Uso: node scripts/check-site.mjs
// Sai com código 1 se encontrar qualquer problema.
//
// PERMITIDOS: termos da lista PROIBIDOS liberados pelo responsável técnico.
// Ex.: se o CRO-SC confirmar o registro da especialidade, adicionar 'especialista'.
const PERMITIDOS = [];

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ASSETS, hashOf } from './versionar-assets.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = (readFileSync(join(ROOT, 'robots.txt'), 'utf8').match(/Sitemap:\s*(https?:\/\/[^/\s]+)/) || [])[1];
const WA_NUMBER = '5549999080777';
const PAGES = { 'index.html': '/', 'odontologia.html': '/odontologia', 'harmonizacao-facial.html': '/harmonizacao-facial',
  'equipe.html': '/equipe', 'a-clinica.html': '/a-clinica', 'privacidade.html': '/privacidade' };
const ALL = [...Object.keys(PAGES), '404.html'];
const NAP = ['Rua Simeão Moritz, 197', '88502-125', '(49) 99908-0777', 'tel:+5549999080777',
  '9h às 12h e 14h às 19h30', 'CRO-SC 9854', 'CRO-SC EPAO 743'];
const PROIBIDOS = ['especialista', 'melhor', 'referência', 'garantid', 'antes e depois', 'antes/depois', 'promoção',
  'desconto', 'parcel', 'cartão', 'cartões', 'pix', 'r$', 'depoimento', 'indolor', 'sem dor', 'definitivo', '—']
  .filter((t) => !PERMITIDOS.includes(t));
const LD_VETADOS = ['aggregateRating', 'review', 'priceRange', 'Offer', 'geo', 'medicalSpecialty'];

const errors = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const read = (f) => readFileSync(join(ROOT, f), 'utf8');
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
const strip = (s) => norm(decode(s.replace(/<[^>]+>/g, ' ')));
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const meta = (h, key) => { const t = h.match(new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]*>`)); return t && attr(t[0], 'content'); };
const visible = (h) => strip(h.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<head[\s\S]*?<\/head>/, ' '));
const fileFor = (path) => {
  const p = path.replace(/^\//, '');
  if (p === '') return 'index.html';
  if (existsSync(join(ROOT, p)) && !p.endsWith('/')) return p;
  return existsSync(join(ROOT, p + '.html')) ? p + '.html' : null;
};

const html = Object.fromEntries(ALL.map((f) => [f, read(f)]));
let refHeader, refFooter;

for (const f of ALL) {
  const h = html[f];
  const indexable = f in PAGES;
  if ((h.match(/<h1[\s>]/g) || []).length !== 1) err(f, 'precisa de exatamente 1 <h1>');
  const title = decode((h.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  if (title.length < 30 || title.length > 60) err(f, `title com ${title.length} caracteres (30-60)`);
  const desc = decode(meta(h, 'description') || '');
  if (desc.length < 70 || desc.length > 160) err(f, `description com ${desc.length} caracteres (70-160)`);
  if (!/<html lang="pt-BR"[ >]/.test(h)) err(f, 'lang pt-BR ausente');

  // Head SEO
  if (indexable) {
    const canon = attr((h.match(/<link rel="canonical"[^>]*>/) || [''])[0], 'href');
    if (canon !== ORIGIN + PAGES[f]) err(f, `canonical ${canon} difere de ${ORIGIN + PAGES[f]}`);
    for (const k of ['og:title', 'og:description', 'og:url', 'og:image']) if (!meta(h, k)) err(f, `${k} ausente`);
    if (meta(h, 'og:url') !== canon) err(f, 'og:url difere do canonical');
  }

  // JSON-LD
  const lds = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (indexable && !lds.length) err(f, 'JSON-LD ausente');
  let ldFaq = null;
  for (const raw of lds) {
    let data;
    try { data = JSON.parse(raw); } catch (e) { err(f, 'JSON-LD não parseia: ' + e.message); continue; }
    const walk = (n) => {
      if (Array.isArray(n)) return n.forEach(walk);
      if (n && typeof n === 'object') {
        for (const k of Object.keys(n)) if (LD_VETADOS.includes(k)) err(f, `JSON-LD contém ${k}`);
        if (LD_VETADOS.includes(n['@type'])) err(f, `JSON-LD contém tipo ${n['@type']}`);
        if (n['@type'] === 'FAQPage') ldFaq = n.mainEntity.map((q) => [norm(q.name), norm(q.acceptedAnswer.text)]);
        if (n['@type'] === 'Dentist') {
          if (n.telephone !== '+55-49-99908-0777') err(f, 'telefone divergente no JSON-LD');
          if (n.address?.streetAddress !== 'Rua Simeão Moritz, 197' || n.address?.postalCode !== '88502-125') err(f, 'endereço divergente no JSON-LD');
          if (!String(n.url).startsWith(ORIGIN)) err(f, 'url da clínica fora da origem');
        }
        Object.values(n).forEach(walk);
      }
    };
    walk(data);
  }
  const visFaq = [...h.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)].map((m) => [strip(m[1]), strip(m[2])]);
  if (ldFaq && !visFaq.length) err(f, 'FAQPage sem FAQ visível');
  if (visFaq.length && JSON.stringify(ldFaq) !== JSON.stringify(visFaq)) err(f, 'FAQ visível difere do FAQPage do JSON-LD');

  // Imagens
  for (const m of h.matchAll(/<img\b[^>]*>/g)) {
    const t = m[0];
    for (const a of ['alt', 'width', 'height']) if (attr(t, a) === undefined) err(f, `<img> sem ${a}: ${t.slice(0, 80)}`);
  }

  // Links e arquivos internos
  const refs = [...h.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const m of h.matchAll(/\ssrcset="([^"]+)"/g)) m[1].split(',').forEach((s) => refs.push(s.trim().split(/\s+/)[0]));
  for (const r of refs) {
    if (/^(https?:|tel:|mailto:)/.test(r)) continue;
    if (r.startsWith('#')) { if (r.length > 1 && !h.includes(`id="${r.slice(1)}"`)) err(f, `âncora inexistente ${r}`); continue; }
    if (/\.html(#|$)/.test(r)) err(f, `link sem URL limpa: ${r}`);
    const [pathQ, hash] = r.split('#'); const path = pathQ.split('?')[0];
    const target = fileFor(path);
    if (!target) { err(f, `referência quebrada: ${r}`); continue; }
    if (hash && !read(target).includes(`id="${hash}"`)) err(f, `âncora inexistente ${r}`);
  }
  for (const m of h.matchAll(/<a\b[^>]*href="(https:\/\/wa\.me\/[^"?]*)[^"]*"[^>]*>/g)) {
    if (m[1] !== 'https://wa.me/' + WA_NUMBER) err(f, `WhatsApp com número errado: ${m[1]}`);
  }
  for (const m of h.matchAll(/<a\b[^>]*href="https?:[^"]*"[^>]*>/g)) {
    if (!/target="_blank"/.test(m[0]) || !/rel="noopener noreferrer"/.test(m[0])) err(f, `link externo sem target/rel: ${m[0].slice(0, 90)}`);
  }

  // NAP
  for (const n of NAP) if (!h.includes(n)) err(f, `NAP ausente: ${n}`);

  // Header e rodapé idênticos
  const hd = (h.match(/<header class="site-header">[\s\S]*?<\/header>/) || [''])[0].replace(/ aria-current="page"/g, '');
  const ft = (h.match(/<footer[\s\S]*?<\/footer>\s*<div class="dock"[\s\S]*?<\/div>/) || [''])[0];
  if (!hd || !ft) err(f, 'header ou rodapé ausente');
  refHeader ??= hd; refFooter ??= ft;
  if (hd !== refHeader) err(f, 'header difere das outras páginas');
  if (ft !== refFooter) err(f, 'rodapé difere das outras páginas');
  const navItems = (hd.match(/<nav class="site-nav"[\s\S]*?<\/nav>/) || [''])[0].match(/<a /g) || [];
  if (navItems.length !== 8) err(f, `menu com ${navItems.length} links (esperado 5 páginas + telefone + rota + agendar)`);

  // CSS e JS sempre com ?v=<hash do conteúdo atual> (evita CSS/JS velhos no cache do visitante)
  for (const [k, re] of [['css', /href="\/css\/site\.css(\?v=([^"]*))?"/], ['js', /src="\/js\/site\.js(\?v=([^"]*))?"/]]) {
    const m = h.match(re);
    if (!m) err(f, `referência a ${ASSETS[k]} ausente`);
    else if (m[2] !== hashOf(ASSETS[k])) err(f, `${ASSETS[k]} sem ?v= ou com versão desatualizada: rode node scripts/versionar-assets.mjs`);
  }
  // Pendências ficam em docs/PENDENCIAS.md, nunca no HTML publicado
  if (/<!--\s*PENDENTE/i.test(h)) err(f, 'comentário PENDENTE no HTML (mover para docs/PENDENCIAS.md)');
  // Logo bitmap (150 px) nunca acima de 64 px no cabeçalho
  for (const m of hd.matchAll(/<img\b[^>]*>/g)) if (+attr(m[0], 'width') > 64 || +attr(m[0], 'height') > 64) err(f, 'imagem acima de 64 px no cabeçalho');

  // Termos proibidos no texto visível
  const vis = visible(h).toLowerCase();
  for (const t of PROIBIDOS) {
    const re = t === 'pix' ? /\bpix\b/ : null;
    if (re ? re.test(vis) : vis.includes(t)) err(f, `termo proibido no texto visível: "${t}"`);
  }
}

// Terceiros e Google Fonts em arquivos do site
const siteFiles = [...ALL, ...readdirSync(join(ROOT, 'css')).map((x) => 'css/' + x), ...readdirSync(join(ROOT, 'js')).map((x) => 'js/' + x)];
for (const f of siteFiles) {
  const s = read(f);
  if (/Google Fonts|fonts\.googleapis|gstatic/i.test(s)) err(f, 'referência a Google Fonts');
  if (/@import/.test(s)) err(f, '@import encontrado');
  if (/Newsreader/i.test(s)) err(f, 'fonte Newsreader ainda referenciada');
  for (const m of s.matchAll(/<(?:link|script|img|iframe)\b[^>]*(?:src|href)="https?:[^"]*"[^>]*>/g)) {
    if (!/rel="canonical"/.test(m[0])) err(f, `recurso externo carregado: ${m[0].slice(0, 90)}`);
  }
}
const css = read('css/site.css');
const rootBlock = (css.match(/:root\{[\s\S]*?\}/) || [''])[0];
const nonToken = css.replace(rootBlock, '').match(/#[0-9a-f]{3,8}\b(?![\w-])/gi);
if (nonToken) err('css/site.css', `cor hex fora dos tokens: ${nonToken.join(', ')}`);

// Contraste AA dos pares usados
const tok = Object.fromEntries([...rootBlock.matchAll(/--([\w-]+):(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(tok[a]), lum(tok[b])].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAIRS = [['ink', 'cream'], ['muted', 'cream'], ['forest', 'cream'], ['forest-2', 'cream'], ['ink', 'white'], ['muted', 'white'], ['forest', 'white'],
  ['ink', 'sage-soft'], ['muted', 'sage-soft'], ['forest', 'sage-soft'], ['forest-2', 'sage-soft'], ['ink', 'blush'], ['muted', 'blush'], ['forest', 'blush'], ['forest-2', 'blush'],
  ['white', 'forest'], ['white', 'forest-2'], ['on-dark-muted', 'forest'], ['on-dark-muted', 'forest-2'], ['sage-soft', 'forest'], ['forest', 'white'], ['ink', 'sage']];
for (const [a, b] of PAIRS) { const r = ratio(a, b); if (r < 4.5) err('css/site.css', `contraste ${a} sobre ${b} = ${r.toFixed(2)} (< 4,5)`); }

// Sitemap
const sm = read('sitemap.xml');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const l of locs) {
  if (!l.startsWith(ORIGIN)) err('sitemap.xml', `URL fora da origem: ${l}`);
  if (!Object.values(PAGES).includes(l.slice(ORIGIN.length))) err('sitemap.xml', `URL inexistente: ${l}`);
}
for (const p of Object.values(PAGES)) if (!locs.includes(ORIGIN + p)) err('sitemap.xml', `falta ${p}`);

if (errors.length) { console.error(errors.map((e) => '✗ ' + e).join('\n')); console.error(`\n${errors.length} problema(s).`); process.exit(1); }
console.log(`✓ ${ALL.length} páginas verificadas, ${PAIRS.length} pares de contraste AA, sitemap com ${locs.length} URLs. Sem problemas.`);
