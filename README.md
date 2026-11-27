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

`index.html` (página e estilos) e `app.js` (código), sem dependências. O código fica em arquivo separado porque a página tem uma política de segurança (CSP) que só aceita scripts deste site e do Firebase: qualquer script injetado é bloqueado pelo navegador.

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

## Segurança

As regras em `firestore.rules` bloqueiam tudo que não está liberado:

- Só entra quem tem e-mail confirmado e foi aprovado pelo master. Pendentes e bloqueados não leem nada.
- Cada escrita é conferida: campos permitidos, tipos e tamanhos máximos.
- Card: qualquer membro edita o conteúdo, mas autor, data de criação, código (ECO-n) e tipo ficam travados. Só o autor ou o master exclui.
- Comentários: cada um comenta só em seu próprio nome, ninguém edita comentário de outro, e só o autor ou o master apaga.
- Anexos: até ~1 MB, sem arquivos executáveis nem páginas web (.html, .svg, .exe, .js…).
- Notificações: só para membros aprovados, ligadas a um card que existe; o dono só pode marcar como lida.
- O master não pode mudar nem apagar o próprio cadastro, para não se trancar fora.

**Sempre que `firestore.rules` mudar, cole o conteúdo em Firebase > Firestore Database > Regras e clique em Publicar.** Mudar o arquivo no GitHub não altera o Firebase.

### Proteções extras no console (recomendado)

1. **App Check** (Firebase > App Check): registre o app web com reCAPTCHA Enterprise e ative a aplicação obrigatória no Firestore. Isso bloqueia scripts e robôs que usam a chave do app fora do site.
2. **Restringir a chave** (Google Cloud > APIs e serviços > Credenciais > Browser key): em "Restrições de aplicativo", escolha "Referenciadores HTTP" e coloque `https://requisita.github.io/*` e `https://requisita.firebaseapp.com/*`.
3. **Authentication > Configurações**: ative a "Proteção contra enumeração de e-mails" e deixe em "Domínios autorizados" só `requisita.github.io` e `requisita.firebaseapp.com` (remova `localhost` se não usar).
4. **Alerta de gastos** (Google Cloud > Faturamento > Orçamentos e alertas): crie um alerta baixo para saber na hora se alguém abusar do banco.
