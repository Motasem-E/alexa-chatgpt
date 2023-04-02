import axios, { AxiosInstance } from 'axios';
import { env } from '@config/env';
import IChatbotProvider from '../models/IChatbotProvider';
import config from '../config';
import IChatGptResponse from '../types/IChatGPTResponse';
import IMessage from '../../VirtualAssistant/types/IMessage';
import SpeakerEnum from '../../VirtualAssistant/types/SpeakerEnum';

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

  async setupChatbot(history: IMessage[]) {
    const initialPrompts: IMessage[] = [
      { role: SpeakerEnum.SYSTEM, content: 'You are my best friend' },
      { role: SpeakerEnum.SYSTEM, content: 'You are very supportive and optimistic person' },
      { role: SpeakerEnum.SYSTEM, content: 'Your name is alex' },
    ];

    await this.chatGPTAPI.post<IChatGptResponse>(
      'https://api.openai.com/v1/chat/completions',
      {
        model: env.CHATGPT_MODEL,
        messages: initialPrompts,
        temperature: config.modelTemperature,
        frequency_penalty: config.frequencyPenalty,
        max_tokens: config.maxTokens,
        n: config.choices,
      },
      {
        timeout: 8000,
        baseURL: '',
      },
    );
  }

  async prompt(query: string): Promise<string> {
    const response = await this.chatGPTAPI.post<IChatGptResponse>(
      'https://api.openai.com/v1/chat/completions',
      {
        model: env.CHATGPT_MODEL,
        messages: { role: SpeakerEnum.User, content: query },
        temperature: config.modelTemperature,
        frequency_penalty: config.frequencyPenalty,
        n: config.choices,
        max_tokens: config.maxTokens,
      },
      {
        timeout: 8000,
        baseURL: '',
      },
    );

    // console.log('Query @@@@@@@: ', query);
    // console.log('Response @@@@@@@: ', response.data.choices[0].text);

    return response.data.choices[0].message.content;
  }
}

export default ChatGPT;
