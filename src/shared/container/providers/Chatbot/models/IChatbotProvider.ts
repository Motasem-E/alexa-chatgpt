import IMessage from '../../VirtualAssistant/types/IMessage';

interface IChatbotProvider {
  setupChatbot(history: IMessage[], lanugage: 'en' | 'pt'): void;
  prompt(query: string): Promise<string>;
  filterResponse(response: string): string;
}

export default IChatbotProvider;
