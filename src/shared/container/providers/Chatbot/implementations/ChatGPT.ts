import axios, { AxiosInstance } from 'axios';
import IChatbotProvider from '../models/IChatbotProvider';
import config from '../config';
import IChatGptResponse from '../types/IChatGPTResponse';

class ChatGPT implements IChatbotProvider {
  chatGPTAPI: AxiosInstance;

  constructor() {
    this.chatGPTAPI = axios.create({
      baseURL: config.url,
      headers: {
        Authorization: config.token,
      },
    });
  }

  async prompt(query: string): Promise<string> {
    const response = await this.chatGPTAPI.post<IChatGptResponse>(
      '/completions',
      {
        prompt: query,
        max_tokens: config.maxTokens,
        temperature: config.modelTemperature,
        frequency_penalty: config.frequencyPenalty,
      },
      {
        timeout: 8000,
      },
    );

    return response.data.choices[0].text;
  }
}

export default ChatGPT;
