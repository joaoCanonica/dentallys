# DENTALLYS — Odontologia e Harmonização Facial

Landing page estática com HTML, CSS e JavaScript em `index.html`, imagens reais otimizadas em `assets`. Não depende de instalação ou build.

## Abrir

Extraia este ZIP e abra `index.html`. Mantenha a pasta `assets` ao lado do HTML. Para servir localmente, execute `python -m http.server 8080` dentro desta pasta e acesse `http://localhost:8080`.

## Publicar na Vercel

Os arquivos deste projeto ficam na raiz do repositório. Na Vercel, importe o repositório, selecione **Other**, mantenha Build Command vazio e use a raiz como diretório de saída. A publicação não exige etapa de build.

Depois de definir o domínio final, adicione `canonical`, `og:url` e `sitemap.xml` com o endereço real. Os metadados textuais de compartilhamento e o favicon estão presentes. Não foi inventado um domínio.

## Experiência

- Abertura com equipe real e as duas áreas de atuação claramente identificadas.
- Alternância acessível entre odontologia e harmonização; teclas esquerda/direita, Home e End nos tabs.
- Detalhes expansíveis e WhatsApp com contexto de cada atendimento.
- Apresentação da Dra. Fernanda Batalha e Dra. Barbara Medinger, sem atribuir identidades aos rostos sem confirmação.
- Frase fornecida da Dra. Fernanda, com link ao perfil pessoal.
- Fachada, endereço, horários, pagamento, informação específica de banheiro acessível e rota.
- Instagram da clínica e da profissional extraídos dos prints enviados.
- Mapa carregado após interação; FAQ; privacidade em diálogo; contato fixo no celular.
- Movimento breve, redução de movimento, conteúdo visível sem depender de animação.
- Com JavaScript desligado, ambas as áreas, links de contato, navegação e detalhes permanecem acessíveis. O mapa externo tem link de rota disponível.

## Validação e limites

Foram verificados arquivos locais, links e âncoras internas, IDs, referências ARIA, H1, atributos de imagens, JSON-LD e os números/mensagens de WhatsApp. O JavaScript passou pela análise sintática do Node. Relatório detalhado em `VALIDACAO.json`.

**Não foi possível executar o site em um navegador nesta sessão.** O recurso de browser QA não estava disponível. Layout responsivo, teclado, tabs, diálogo, mapa, overflow, contraste medido, zoom 200%, console e desempenho precisam de validação real em 390, 768, 1280 e 1920 px, além de aparelhos físicos. Esta é uma versão implementada para revisão, não uma certificação de funcionamento em todos os dispositivos.

## Confirmações antes da publicação

1. Responsável técnica: os textos atuais do cliente indicam **Dra. Fernanda F. Batalha, CRO-SC 9854 / EPAO 743**. Artes antigas citam **Dra. Eduarda F. Batalha, CRO-SC 13288**. O rodapé usa o dado textual solicitado; confirmar com a clínica.
2. Confirmar horários, pagamentos e banheiro acessível: vieram de um resumo de busca fornecido pelo cliente; não houve verificação independente da operação atual.
3. Confirmar disponibilidade atual dos procedimentos e títulos profissionais. Não foram inventados cursos, especialidades ou equipamentos.
4. A foto coletiva tem quatro pessoas; só há apresentação nominal suficiente de Fernanda e Barbara. Não foi inferida a identidade de cada pessoa pela aparência. Nomes, retratos individuais e registros dos demais podem ampliar a seção.
5. Logo original tem 150×150 px e foto coletiva é uma captura de 904×781 px. Arquivos originais de maior resolução melhorarão a nitidez.
6. Revisar política de privacidade conforme a hospedagem escolhida. O site não adiciona analytics ou cookies próprios. Google Fonts e links externos dependem dos respectivos serviços.

## Conteúdo clínico

Não foram reproduzidas promessas de ausência de dor, ausência de sensibilidade, resultados garantidos ou idade universal para iniciar tratamento. As descrições convidam à avaliação, com informação individualizada. Os screenshots de antes e depois não foram publicados; serviram para identificar procedimentos, preservando a apresentação institucional e evitando tratar imagens não verificadas como comprovação de resultado.

## Manutenção

Todo o código está em `index.html`. O objeto `CLINIC` centraliza o destino de WhatsApp e os dados utilizados nas interações; os links HTML incluem fallback funcional sem JavaScript. Ao mudar dados, atualize também textos e metadados estáticos correspondentes. `data-wa` define a mensagem de cada botão. As imagens são locais e não dependem de hotlink externo.

## Revisão 2 — identidade e sequência visual

- Logo original visível no cabeçalho, destaque da harmonização e rodapé; cabeçalho e links ampliados.
- Branco predominante e turquesa inspirado nas artes enviadas; removidos os títulos em itálico e a predominância de verde acinzentado.
- Abertura identifica diretamente odontologia e harmonização facial, com fotografia real e convite explícito para continuar.
- Sinal de rolagem e indicador contextual de posição no desktop.
- Publicações originais sobre jato de plasma e Hidra Gloss Lips, apresentadas como conteúdo da profissional, com ampliação em diálogo.
- Não foram inventados depoimentos, pacientes ou resultados. A origem das imagens é explicitada. O print de preenchimento com rótulo “Conteúdo de IA” não foi usado como prova clínica.
- A reprodução de publicações não equivale a verificação independente dos casos. Confirmar autorização de uso dos registros e revisar as alegações das artes originais antes da publicação definitiva.
- Mesma limitação de validação: verificações estáticas aprovadas, navegador indisponível nesta sessão.
