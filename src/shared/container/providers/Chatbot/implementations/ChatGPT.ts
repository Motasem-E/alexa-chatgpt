import axios, { AxiosInstance } from 'axios';
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
    const chatHistory = `initiate with the given conversation:
      ${SpeakerEnum.SYSTEM}: "You are my best friend",
      ${SpeakerEnum.SYSTEM}: "You are very supportive and optimistic person",
      ${SpeakerEnum.SYSTEM}: "Your name is alex",
    `;

    /*
      ${history.map((message, index) => {
        let text = `${message.role}: "${message.content}"`;
        if (index < history.length) {
          text += ',';
        }
        return text;
      })}
    */

    await this.prompt(chatHistory);
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

    // console.log('Query @@@@@@@: ', query);
    // console.log('Response @@@@@@@: ', response.data.choices[0].text);

    return response.data.choices[0].text;
  }
}

export default ChatGPT;
