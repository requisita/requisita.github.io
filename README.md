# Requisita.ai

Levantamento de requisitos em cards para o sistema **Eco-Maida**, no estilo do Jira.

- **BI:** história, filtros em tela, parâmetros exibidos com tipo de gráfico e comparativos.
- **Relatório:** história, filtros e colunas.
- Critérios de aceite, links do Cervello e do Jira, backlog com busca e filtro por tipo.
- Copia o card pronto para colar no Jira (Markdown) ou como texto simples.

## Acesso

- GitHub Pages: https://requisita.github.io/
- Login com Google ou e-mail e senha. Todo cadastro novo fica **aguardando aprovação** do master (cicero.silva@maida.health), que aprova ou bloqueia pelo botão **Usuários**.
- Os cards ficam no Firebase (Firestore), iguais para todo o time aprovado.

## Escrever com IA (Gemini)

1. Crie uma chave em https://aistudio.google.com (Get API key).
2. No app, clique em **Configurar Gemini**, cole a chave e clique em **Conectar**.
3. Descreva o pedido do cliente e use **Preencher card** ou **Revisar texto do card**.

A chave fica salva só no navegador de quem usa. **Nunca coloque a chave neste repositório.** Para mais segurança, no Google Cloud restrinja a chave ao site `requisita.github.io`.

## Tecnologia

Uma única página HTML, CSS e JavaScript, sem dependências.

## Configurar o Firebase (uma vez)

1. Em https://console.firebase.google.com crie um projeto (ex.: `requisita-ai`).
2. **Authentication > Método de login**: ative **Google** e **E-mail/senha**.
3. **Authentication > Configurações > Domínios autorizados**: adicione `requisita.github.io`.
4. **Firestore Database**: crie o banco (modo produção). Em **Regras**, cole o conteúdo de `firestore.rules` e publique.
5. **Configurações do projeto > Seus apps > Web (</>)**: registre um app e copie o `firebaseConfig`.
6. No `index.html`, cole esses valores em `FIREBASE_CONFIG` (perto de "Firebase (versão do GitHub)") e suba o arquivo.

O `firebaseConfig` não é senha e pode ficar no repositório público: quem protege os dados são as regras do Firestore.

## Primeiro acesso do master

Entre com **Entrar com Google** usando cicero.silva@maida.health. Se preferir e-mail e senha, use **Criar conta**, confirme o e-mail pelo link recebido e depois entre. A conta do master é aprovada automaticamente.
