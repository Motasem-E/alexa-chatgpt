import { env } from '@config/env';

export default {
  url: 'https://api.openai.com/v1/',
  model: env.CHATGPT_MODEL,
  maxTokens: 100,
  modelTemperature: 0.7,
  frequencyPenalty: 0.5,
  token: env.CHATGPT_TOKEN,
  choices: 1,
};
