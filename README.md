1- Create a New Custom Skill: https://developer.amazon.com/alexa/console/ask
Nome Skill:
English: chat
Português: amigo

2- Build -> Intents -> JSON EDITOR -> Adicionar
en-US.json
pt-BR.json

3- Projeto -> yarn build

4- copiar ./dist/lambda.zip para skill -> code -> import code

5- Deploy

## 6- Se der erro abrir CloudWatch Logs, para testar tem aba Test (open chat ou abrir amigo)

Recursos

- Chat em ingles e português
- É possível selecionar no código o nome do speaker
- Continuar última conversa
