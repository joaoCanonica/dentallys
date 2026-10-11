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

`css/site.css` (único, cores só em tokens), `js/site.js` (menu, mapa sob clique, reveal), `assets/fonts` (fontes locais), `assets/img` (WebP otimizadas), `assets/og-dentallys.jpg` (1200×630).

Header e rodapé são idênticos em todas as páginas: ao editar um, copie o mesmo bloco nas outras.

## Comandos

- `node scripts/check-site.mjs`: verifica SEO, JSON-LD, FAQ, links, imagens, NAP, header/rodapé, termos proibidos (CFO) e contraste. Rode antes de publicar.
- `node scripts/definir-dominio.mjs https://novo-dominio`: troca a origem `https://dentallys.vercel.app` em todo o site.
- Desligar a harmonização facial: `docs/DESATIVAR-HARMONIZACAO.md`.

## Conformidade

A revisão segue o Código de Ética Odontológica (arts. 43 e 44) e a Res. CFO 196/2019, mas não substitui a validação da responsável técnica junto ao CRO-SC. Não usar no site: “especialista” sem registro, antes e depois, preços, formas de pagamento, depoimentos, promessas de resultado.

## Pendências do cliente

1. Registro da especialidade da Dra. Fernanda no CRO-SC (nº) e confirmação da responsável técnica (considerando a decisão do TRF1 de 19/08/2026 sobre a Res. CFO 198/2019, em recurso). Sem isso, o site não usa “especialista”.
2. Quem realiza ortodontia e clareamento, com CRO e especialidade registrada (art. 43, §1º).
3. Se jato de plasma e Hidra Gloss Lips estão no escopo da profissional; manter ou retirar.
4. Se a Dra. Barbara atende na Dentallys, em quais horários, e se “Otacílio Costa” fica no site.
5. “Há mais de 20 anos”: confirmar o ano de fundação (permite `foundingDate`).
6. Acessibilidade (banheiro para cadeirante): confirmar.
7. Logo em vetor (SVG/PDF) e fotos originais em alta. Recomendado: ensaio fotográfico.
8. Convênios, se houver.
9. Imagens de casos: só com TCLE arquivado, nome e CRO na imagem, sem texto promocional.
10. Domínio próprio; depois, rodar `definir-dominio.mjs` e adicionar na Vercel.
11. Perfil da Empresa no Google com os mesmos dados e Google Search Console (enviar `sitemap.xml`).
12. Harmonização facial: seguir `docs/DESATIVAR-HARMONIZACAO.md` ou ampliar a área quando houver definição.
