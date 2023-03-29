export default {
  url: `https://api.openai.com/v1/engines/${process.env.CHATGPT_MODEL}`,
  maxTokens: 300,
  modelTemperature: 0.7,
  frequencyPenalty: 0.5,
  token: process.env.CHATGPT_TOKEN,
};
