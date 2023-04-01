import { LambdaHandler } from 'ask-sdk';
import IChatbotProvider from '../../Chatbot/models/IChatbotProvider';

interface IVirtualAssistantProvider {
  getSkill(): LambdaHandler;
  configureVirtualAssistant(chatbot: IChatbotProvider): void;
}

export default IVirtualAssistantProvider;
