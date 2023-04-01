import IMessage from '../../VirtualAssistant/types/IMessage';

interface IChatbotProvider {
  setupChatbot(history: IMessage[]): void;
  prompt(query: string): Promise<string>;
}

export default IChatbotProvider;
