import axios, { AxiosInstance } from 'axios';
import IChatbotProvider from '../interfaces/IChatbotProvider';
import config from '../configs';
import IChatGptResponse from '../interfaces/IChatGPTResponse';
import IMessage from '../../VirtualAssistant/interfaces/IMessage';
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

  /**
   * Yet history conext is not insered due to CHATGPT limitations.
   * @param history
   * @param lanugage
   */
  async setupChatbot(_history: IMessage[], lanugage: 'en' | 'pt') {
    let chatHistory = ``;
    if (lanugage === 'en') {
      chatHistory += `Initiate with the given conversation:
        ${SpeakerEnum.SYSTEM}: "Your are human and your name is Sam",
        ${SpeakerEnum.SYSTEM}: "You are my best friend",
        ${SpeakerEnum.SYSTEM}: "You are very supportive and optimistic friend"
      `;
    } else {
      chatHistory += `Inicie com a seguinte conversa:
        ${SpeakerEnum.SYSTEM}: "Você é humano e seu nome é Sam",
        ${SpeakerEnum.SYSTEM}: "Você é o meu melhor amigo",
        ${SpeakerEnum.SYSTEM}: "Você é muito otimista e solidário"
      `;
    }

    /*
        ${_history.map((message, index) => {
          let text = `${message.role}: "${message.content}"`;
          if (index < _history.length) {
            text += ',';
          }
          return text;
        })}
      */

    await this.prompt(chatHistory);
  }

  /**
   * Remover os simbolos do inicio da frase (chat completion)
   * @param response
   * @returns
   */
  filterResponse(response: string): string {
    const symbolsToFilter = ['!', '?', ',', '.'];
    let filteredResponse = response;
    if (symbolsToFilter.indexOf(response[0]) > -1) {
      filteredResponse = response.substring(1, response.length);
    }
    return filteredResponse;
  }

  async prompt(query: string): Promise<string> {
    const response = await this.chatGPTAPI.post<IChatGptResponse>(
      '/completions',
      {
        model: config.model,
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

    return this.filterResponse(response.data.choices[0].text);
  }
}

export default ChatGPT;
