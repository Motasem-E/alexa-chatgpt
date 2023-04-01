import { env } from '@config/env';

export default {
  url: `https://api.openai.com/v1/engines/${env.CHATGPT_MODEL}`,
  maxTokens: 300,
  modelTemperature: 0.7,
  frequencyPenalty: 0.5,
  token: env.CHATGPT_TOKEN,
};
