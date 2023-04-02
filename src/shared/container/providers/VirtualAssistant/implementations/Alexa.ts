import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import {
  DefaultApiClient,
  ErrorHandler,
  HandlerInput,
  RequestHandler,
  SkillBuilders,
  getIntentName,
  getRequestType,
  LambdaHandler,
} from 'ask-sdk';
import IChatbotProvider from '../../Chatbot/models/IChatbotProvider';
import ProvidersEnum from '../../ProvidersEnum';
import config from '../config';
import IVirtualAssistantProvider from '../models/IVirtualAssistantProvider';
import SpeakerEnum from '../types/SpeakerEnum';
import IMessage from '../types/IMessage';
import IStorageProvider from '../../StorageProvider/models/IStorageProvider';

@injectable()
class Alexa implements IVirtualAssistantProvider {
  skill: LambdaHandler;

  public constructor(
    @inject(ProvidersEnum.CHATBOT)
    private chatbot: IChatbotProvider,

    @inject(ProvidersEnum.STORAGE)
    private storage: IStorageProvider,
  ) {
    this.configureVirtualAssistant();
  }

  getSkill(): LambdaHandler {
    return this.skill;
  }

  // Ao fechar a aplicação e terminar a sessão, salvar historico das conversas
  persistHistory = async (handlerInput: HandlerInput) => {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let history = (attributes.history || []) as IMessage[];

    if (history.length > config.persistHistory) {
      history = history.slice(history.length - config.persistHistory, history.length);
    }

    handlerInput.attributesManager.setPersistentAttributes({ history: JSON.stringify(history) });
    await handlerInput.attributesManager.savePersistentAttributes();
  };

  // Ao abrir a aplicação e iniciar uma sessão, restaurar todo histórico de conversas
  // E aplicar no Chatbot
  restoreHistory = async (handlerInput: HandlerInput) => {
    const persistentData = await handlerInput.attributesManager.getPersistentAttributes();
    const language = handlerInput.requestEnvelope.request.locale || 'en-US';
    let history: IMessage[] = [];

    if (persistentData.history !== undefined) {
      history = JSON.parse(persistentData.history);
    }

    handlerInput.attributesManager.setSessionAttributes({
      ...handlerInput.attributesManager.getSessionAttributes(),
      history,
    });

    this.chatbot.setupChatbot(history, language === 'pt-BR' ? 'pt' : 'en');
  };

  addConversationToHistory = ({ role, content, handlerInput }: { role: SpeakerEnum; content: string; handlerInput: HandlerInput }) => {
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
  getTextToSpeak = ({
    handlerInput,
    en,
    pt,
    isSystemText,
  }: {
    handlerInput: HandlerInput;
    en: string;
    pt: string;
    isSystemText: boolean;
  }): string => {
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

    if (request.intent.name === 'UtteranceIntent') {
      spokenText = request.intent.slots.text.value;
    } else {
      spokenText = request.locale === 'en-US' ? 'Continue the following: ' : 'Continue o seguinte: ';
      // Variavel usada para armazenar o historico das conversas para pedir para continuar a historia
      spokenText += attributes.completion || (request.locale === 'en-US' ? 'Hi there' : 'Olá');
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

    if (request.intent.name === 'UtteranceIntent') {
      // Variavel usada para armazenar a última conversa para poder pedir para continuar a historia
      attributes.completion = result;
    } else {
      // Variavel usada para armazenar o historico das conversas para pedir para continuar a historia
      // Aqui é feita concatenação do result atual com os results anteriores caso ele mandar continuar várias vezes consecutivas
      attributes.completion += result;
    }

    return result;
  };

  configureVirtualAssistant = (): void => {
    const cardTitle = 'Chatbot!';

    // Skill principal de contar historia (manter o skill aberto)
    const utteranceIntentHandler = {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'UtteranceIntent';
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        try {
          // Capturar o que foi falado
          const query = this.getSpokenText(handlerInput);

          const result = await this.askChatbot(handlerInput, query);

          const speechText = this.getTextToSpeak({ handlerInput, en: result, pt: result, isSystemText: false });

          return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
        } catch (error) {
          const speechText = this.getTextToSpeak({
            handlerInput,
            en: 'Error while processing response, please try again later.',
            pt: 'Erro durante processamento da resposta, por favor tente mais tarde.',
            isSystemText: true,
          });
          console.log('utteranceIntentHandler Error: ', error);
          return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
        }
      },
    };

    // Continuar a historia (enquanto falar para continuar, ele vai concatenando o que já falou e irá complementar)
    const ContinueIntentHandler = {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'ContinueIntent';
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        try {
          const query = this.getSpokenText(handlerInput);

          const result = await this.askChatbot(handlerInput, query);

          const speechText = this.getTextToSpeak({ handlerInput, en: result, pt: result, isSystemText: false });

          return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
        } catch (error) {
          const speechText = this.getTextToSpeak({
            handlerInput,
            en: 'Error while processing response, please try again later.',
            pt: 'Erro durante processamento da resposta, por favor tente mais tarde.',
            isSystemText: true,
          });
          console.log('ContinueIntentHandler Error: ', error);
          return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
        }
      },
    };

    /*
      Skill is Launched
      Restaurar histórico de conversa
    */
    const LaunchRequestHandler = {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        await this.restoreHistory(handlerInput);

        const speechText = this.getTextToSpeak({
          handlerInput,
          en: 'Hi there!',
          pt: 'Fala aí!',
          isSystemText: true,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
      },
    };

    /*
      Handler when session is ended (cleanup)
      Salvar todo histórico de conversa
    */
    const SessionEndedRequestHandler: RequestHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        await this.persistHistory(handlerInput);
        return handlerInput.responseBuilder.getResponse();
      },
    };

    // User ask help
    const HelpIntentHandler: RequestHandler = {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
      },
      handle: (handlerInput: HandlerInput): Response => {
        const speechText = this.getTextToSpeak({
          handlerInput,
          en: `I'm ChatGPT bot, you can ask me anything.`,
          pt: 'Eu sou ChatGPT, você pode me perguntar qualquer coisa',
          isSystemText: true,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
      },
    };

    // User ask to stop
    const CancelAndStopIntentHandler: RequestHandler = {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;
        return (
          request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent')
        );
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        const speechText = this.getTextToSpeak({
          handlerInput,
          en: 'Goodbye!',
          pt: 'Até Mais!',
          isSystemText: true,
        });

        await this.persistHistory(handlerInput);

        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard(cardTitle, speechText)
          .withShouldEndSession(true)
          .getResponse();
      },
    };

    // Error Handler
    const ErrorHandler: ErrorHandler = {
      canHandle: (_handlerInput: HandlerInput, _error: Error): boolean => true,
      handle: async (handlerInput: HandlerInput, _error: Error): Promise<Response> => {
        console.log(`Error handled: ${_error.message}`);

        const speechText = this.getTextToSpeak({
          handlerInput,
          en: `Sorry, I don't understand your command. Please say it again.`,
          pt: 'Desulpe, eu não entendi, por favor fale novamente',
          isSystemText: true,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
      },
    };

    // The intent reflector is used for interaction model testing and debugging.
    // It will simply repeat the intent the user said. You can create custom handlers
    const IntentReflectorHandler = {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest';
      },
      handle: (handlerInput: HandlerInput): Response => {
        const intentName = getIntentName(handlerInput.requestEnvelope);

        const speechText = this.getTextToSpeak({
          handlerInput,
          en: `You just triggered ${intentName}`,
          pt: `Você disparou ${intentName}`,
          isSystemText: true,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
      },
    };

    // No other Intent is suported
    const FallbackIntentHandler = {
      canHandle: (handlerInput: HandlerInput): boolean =>
        getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
        getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent',
      handle: (handlerInput: HandlerInput): Response => {
        const speechText = this.getTextToSpeak({
          handlerInput,
          en: `Sorry, I have no knowledge about that. FallbackIntent`,
          pt: `Foi mal, não tenho o conhecimento sobre isso. fallbackIntent`,
          isSystemText: true,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
      },
    };

    this.skill = SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        utteranceIntentHandler,
        ContinueIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        FallbackIntentHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
      )
      .addErrorHandlers(ErrorHandler)
      // Obter o timezone, device_id
      .withApiClient(new DefaultApiClient())
      .withPersistenceAdapter(this.storage.getPersistenceAdapter())
      .lambda();
  };
}

export default Alexa;
