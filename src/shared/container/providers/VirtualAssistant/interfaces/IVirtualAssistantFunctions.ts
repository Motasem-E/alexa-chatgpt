import { HandlerInput } from 'ask-sdk';
import SpeakerEnum from '../types/SpeakerEnum';

export interface IAddConversationToHistoryParams {
  role: SpeakerEnum;
  content: string;
  handlerInput: HandlerInput;
}

export interface IGetTextToSpeakParams {
  handlerInput: HandlerInput;
  en: string;
  pt: string;
  isSystemText: boolean;
}

interface IVirtualAssistantFunctions {
  persistHistory(handlerInput: HandlerInput): Promise<void>;
  restoreHistory(handlerInput: HandlerInput): Promise<void>;
  addConversationToHistory(params: IAddConversationToHistoryParams): void;
  getTextToSpeak(params: IGetTextToSpeakParams): string;
  getSpokenText(handlerInput: HandlerInput): string;
  askChatbot(handlerInput: HandlerInput, query: string): Promise<string>;
}

export default IVirtualAssistantFunctions;
