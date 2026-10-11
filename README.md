# Dentallys

Site estático da Dentallys, clínica odontológica e de harmonização facial no Centro de Lages (SC). HTML, CSS e JS puros, sem build. Vercel, preset "Other".

## Estrutura

| Arquivo | URL |
|---|---|
| `index.html` | `/` |
| `odontologia.html` | `/odontologia` |
| `harmonizacao-facial.html` | `/harmonizacao-facial` (marcado com `data-area="harmonizacao"`) |
| `equipe.html` | `/equipe` |
| `a-clinica.html` | `/a-clinica` |
| `privacidade.html` | `/privacidade` |
| `404.html` | página de erro |

`css/site.css` (único, cores só em tokens), `js/site.js` (abertura da home, menu, aberto agora, mapa sob clique, reveal, vídeo opcional da hero), `assets/fonts` (Fraunces e DM Sans, locais), `assets/img` (WebP otimizadas), `assets/og-dentallys.jpg` (1200×630).

Header e rodapé são idênticos em todas as páginas: ao editar um, copie o mesmo bloco nas outras.

## Comandos

- `node scripts/check-site.mjs`: verifica SEO, JSON-LD, FAQ, links, imagens, NAP, header/rodapé, termos proibidos (CFO) e contraste. Rode antes de publicar.
- `node scripts/definir-dominio.mjs https://novo-dominio`: troca a origem `https://dentallys.vercel.app` em todo o site.
- Desligar a harmonização facial: `docs/DESATIVAR-HARMONIZACAO.md`.

## Conformidade

A revisão segue o Código de Ética Odontológica (arts. 43 e 44) e a Res. CFO 196/2019, mas não substitui a validação da responsável técnica junto ao CRO-SC. Não usar no site: “especialista” sem registro, antes e depois, preços, formas de pagamento, depoimentos, promessas de resultado.

## Pendências do cliente

Ver `docs/PENDENCIAS.md`. Comentários `PENDENTE` não ficam no HTML publicado (o `check-site.mjs` reprova).

## Verificação visual

Capturas em 1440, 1024, 768 e 390 px em `docs/qa/`.
