# Alexa Conversational skill with ChatGPT integration

### 1- For installation, please follow [Installation.md](./Installation.md) instructions

### 2- Features & Configurations:

- Feature: Chat Languages in English and Portuguese

- Feature: Continue last conversation. When asked to continue several consecutive times, the conversation history will be concatenated for CHATGPT to continue.
- Feature: Persist chat history in S3 bucket or DynamoDB

- Configuration: Speaker selection in code

- Configuration: limit chat history persistence

### 3- CHATGPT Billing:

- num_tokens(prompt) + max_tokens \* max(n, best_of)
