# Como desativar a harmonização facial do site

Use se o CRO-SC ou a Justiça restringirem a atuação. Leva poucos minutos.

1. Liste o que está marcado: `grep -rln 'data-area="harmonizacao"' --include=*.html .`
2. Apague a página: `git rm harmonizacao-facial.html`.
3. Em todas as páginas, remova os elementos com `data-area="harmonizacao"`:
   - `<li data-area="harmonizacao">` do menu (o bloco do header é idêntico em todas as páginas);
   - na home: o card `area-card area-face`, a faixa da frase da Dra. Fernanda e a pergunta “A Dentallys atende odontologia e harmonização facial?”;
   - os `<span data-area="harmonizacao">harmonização facial, </span>` nos perfis da Dra. Fernanda (home e /equipe);
   - o link no `404.html`.
4. JSON-LD da home: no nó `FAQPage`, apague a `Question` “A Dentallys atende odontologia e harmonização facial?” (o FAQ visível e o JSON-LD precisam continuar idênticos).
   Em todas as páginas, ajuste o texto “odontologia e harmonização facial” em `description` do nó `Dentist` (`#clinica`), no title/description da home e na frase do rodapé.
5. `sitemap.xml`: apague a linha `<url>` de `/harmonizacao-facial` (marcada com o comentário `data-area="harmonizacao"`).
6. `vercel.json`: se quiser evitar 404, adicione `"redirects": [{ "source": "/harmonizacao-facial", "destination": "/", "permanent": false }]`.
7. `assets/og-dentallys.jpg` traz a frase “Odontologia e harmonização facial”: gere uma nova.
8. Rode `node scripts/check-site.mjs` (vai apontar o menu com 7 links: ajuste o número esperado no script) e confira em navegador.
