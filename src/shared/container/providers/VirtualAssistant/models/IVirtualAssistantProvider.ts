import { LambdaHandler } from 'ask-sdk-core';
import IChatbotProvider from '../../Chatbot/models/IChatbotProvider';
import IGetSpeakText from '../types/IGetSpeakText';

interface IVirtualAssistantProvider {
  getSkill(): LambdaHandler;
  configureVirtualAssistant(chatbot: IChatbotProvider, getSpeakText: IGetSpeakText): void;
  getSpeakText: IGetSpeakText;
}

export default IVirtualAssistantProvider;
