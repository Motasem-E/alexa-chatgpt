import { inject, injectable } from 'tsyringe';
import { HandlerInput } from 'ask-sdk';
import IChatbotProvider from '../../Chatbot/interfaces/IChatbotProvider';
import ProvidersEnum from '../../../../types/ProvidersEnum';
import config from '../config';
import IChatbotsFunctions, { IAddConversationToHistoryParams, IGetTextToSpeakParams } from '../interfaces/IVirtualAssistantFunctions';
import SpeakerEnum from '../types/SpeakerEnum';
import IMessage from '../interfaces/IMessage';

@injectable()
class AlexaFunctions implements IChatbotsFunctions {
  public constructor(
    @inject(ProvidersEnum.CHATBOT)
    private chatbot: IChatbotProvider,
  ) {}

  // Ao fechar a aplicação e terminar a sessão, salvar historico das conversas
  persistHistory = async (handlerInput: HandlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let history = (attributes.history || []) as IMessage[];
    const lastSentence = attributes.lastSentence || (request.locale === 'en-US' ? 'Hi there' : 'Olá');

    if (history.length > config.persistHistory) {
      history = history.slice(history.length - config.persistHistory, history.length);
    }

    handlerInput.attributesManager.setPersistentAttributes({ history, lastSentence });
    await handlerInput.attributesManager.savePersistentAttributes();
  };

  // Ao abrir a aplicação e iniciar uma sessão, restaurar todo histórico de conversas
  // E aplicar no Chatbot
  restoreHistory = async (handlerInput: HandlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    const persistentData = await handlerInput.attributesManager.getPersistentAttributes();
    const language = handlerInput.requestEnvelope.request.locale || 'en-US';
    const history: IMessage[] = persistentData.history || [];

    handlerInput.attributesManager.setSessionAttributes({
      ...handlerInput.attributesManager.getSessionAttributes(),
      history,
      lastSentence: persistentData.lastSentence || (request.locale === 'en-US' ? 'Hi there' : 'Olá'),
    });

    this.chatbot.setupChatbot(history, language === 'pt-BR' ? 'pt' : 'en');
  };

  addConversationToHistory = ({ role, content, handlerInput }: IAddConversationToHistoryParams) => {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    if (!attributes.history) {
      attributes.history = [];
    }

    const message: IMessage = {
      role,
      content,
    };

    attributes.history.push(message);
  };

  // Obter o texto a ser falado
  getTextToSpeak = ({ handlerInput, en, pt, isSystemText }: IGetTextToSpeakParams): string => {
    let speechText = '';
    if (handlerInput.requestEnvelope.request.locale === 'en-US') {
      speechText = en;
    } else {
      speechText = pt;
    }
    if (!isSystemText) {
      this.addConversationToHistory({
        role: SpeakerEnum.ASSISTANT,
        content: speechText,
        handlerInput,
      });
    }

    speechText = `<voice name="${config.speaker(handlerInput.requestEnvelope.request.locale || 'en-US')}">${speechText}</voice>`;
    return speechText;
  };

  // Capturar o que foi falado
  getSpokenText = (handlerInput: HandlerInput): string => {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let spokenText = '';

    // Nova topico da conversa
    if (request.intent.name === 'UtteranceIntent') {
      spokenText = request.intent.slots.text.value;
    }
    // Solicitação de continuar a conversa
    else {
      spokenText = request.locale === 'en-US' ? 'Continue the following: ' : 'Continue o seguinte: ';
      spokenText += attributes.lastSentence || (request.locale === 'en-US' ? 'Hi there' : 'Olá');
    }

    this.addConversationToHistory({
      role: SpeakerEnum.User,
      content: spokenText,
      handlerInput,
    });

    return spokenText;
  };

  askChatbot = async (handlerInput: HandlerInput, query: string): Promise<string> => {
    const request = handlerInput.requestEnvelope.request;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const result = await this.chatbot.prompt(query);

    // Nova topico da conversa
    if (request.intent.name === 'UtteranceIntent') {
      // Variavel usada para armazenar a última conversa para poder pedir para continuar a historia
      attributes.lastSentence = result;
    }
    // Solicitação de continuar a conversa
    else {
      // Variavel usada para armazenar o historico das conversas para pedir para continuar a historia
      // Aqui é feita concatenação do result atual com os results anteriores caso ele mandar continuar várias vezes consecutivas
      attributes.lastSentence += result;
    }

    return result;
  };
}

export default AlexaFunctions;
