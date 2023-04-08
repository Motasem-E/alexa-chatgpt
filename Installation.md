## Installation

1- Create a New Custom Skill: https://developer.amazon.com/alexa/console/ask

Skill name:

- English: chat
- Português: amigo

2- Build -> Intents -> JSON EDITOR -> Add

- en-US.json
- pt-BR.json

3- Project -> console -> yarn build

4- Add ./dist/lambda.zip to skill:

- Skill console -> code tab -> import code

5- Deploy

## Testing

- Skill console -> Test tab -> open chat (or abrir amigo)

## Debugging

After testing, if any error occurred, check CouldWatch Logs

- Skill console -> code tab -> CloudWatch Logs
