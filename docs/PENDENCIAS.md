# Pendências do cliente

Itens que dependem da Dentallys. Nada aqui bloqueia a publicação; o site só usa o que está confirmado.

1. **Conferir o CRO do responsável técnico.** A placa da fachada parece mostrar "CRO-SC 748"; o site usa CRO-SC 9854 (Dra. Fernanda) e EPAO 743 (clínica). Materiais antigos citavam "Dra. Eduarda F. Batalha, CRO-SC 13288". Confirmar no CRO-SC o número correto de cada inscrição e se a placa precisa ser atualizada. A placa foi excluída do recorte da fachada usado no site.
2. **Especialidade e harmonização facial.** Registro da especialidade da Dra. Fernanda no CRO-SC (para usar o título) e orientação do responsável técnico sobre a divulgação de harmonização facial diante da decisão do TRF1 de 19/08/2026 sobre a Res. CFO 198/2019 (em recurso). Até lá o site não usa "especialista". Para retirar a área: `docs/DESATIVAR-HARMONIZACAO.md`.
3. **Ortodontia e clareamento:** nome, CRO e especialidade registrada de quem atende. Hoje: "Cirurgiãs-dentistas da equipe Dentallys" (art. 43, §1º).
4. **Jato de plasma e Hidra Gloss Lips:** confirmar se estão no escopo da profissional; manter ou retirar. Ficam sem destaque, na grade de `/harmonizacao-facial`.
5. **Dra. Barbara Medinger:** atende na Dentallys? Em quais horários? Manter "Atende em Lages e Otacílio Costa" (só na bio em `/equipe`)?
6. **Dados a confirmar:**
   - "Há mais de 20 anos": confirmar o ano de fundação. O texto saiu do site e volta quando confirmado (permite `foundingDate` no JSON-LD).
   - Acessibilidade: banheiro para cadeirante.
   - Descritor oficial: "Clínica Odontológica" × "Saúde e Estética" (o site usa "Odontologia e harmonização facial").
   - Caixa "Para a sua avaliação": o texto geral (levar exames e radiografias, informar medicamentos e alergias) pode ser ajustado pela clínica.
7. **Material para o salto de qualidade:**
   - Logotipo em vetor (SVG/PDF). Quando existir `assets/logo.svg`, trocar o selo do rodapé.
   - Ensaio fotográfico profissional: retratos individuais das duas profissionais, consultório, recepção e ambientes, sem pacientes identificáveis. Os retratos entram em `assets/img/equipe-fernanda.webp` e `assets/img/equipe-barbara.webp` (4:5) e o gerador troca o painel de iniciais pela foto.
   - Vídeo horizontal curto (8 a 12 s) do ambiente ou da equipe para a hero. A foto da equipe parece ser um quadro de vídeo: pedir o arquivo original. Para ativar, adicionar `data-video="/assets/video/hero.mp4"` na `<figure class="hero-photo">` (até 8 MB).
8. **Convênios** (podem ser divulgados): lista, se houver. **Imagens de casos:** só com TCLE arquivado, nome e CRO na imagem e sem texto promocional (Res. CFO 196/2019).
9. **Domínio:** `dentallys.com.br`, `dentallys.com`, `clinicadentallys.com.br`, `dentallyslages.com.br` e `clinicadentallys.com` aparecem livres. Depois de registrar: `node scripts/definir-dominio.mjs https://novo-dominio` e adicionar na Vercel. Perfil da Empresa no Google com os mesmos dados e Search Console com o `sitemap.xml`.
