import { ErrorHandler, HandlerInput, RequestHandler, SkillBuilders, getIntentName, getRequestType, LambdaHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import IChatbotProvider from '../../Chatbot/models/IChatbotProvider';
import ProvidersEnum from '../../ProvidersEnum';
import config from '../config';
import IVirtualAssistantProvider from '../models/IVirtualAssistantProvider';
import IGetSpeakText from '../types/IGetSpeakText';

@injectable()
class Alexa implements IVirtualAssistantProvider {
  skill: LambdaHandler;

  constructor(
    @inject(ProvidersEnum.CHATBOT)
    chatbot: IChatbotProvider,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {
    this.configureVirtualAssistant(chatbot, this.getSpeakText);
  }

  getSkill(): LambdaHandler {
    return this.skill;
  }

  getSpeakText({ handlerInput, en, pt }: { handlerInput: HandlerInput; en: string; pt: string }): string {
    let speechText = `<voice name="${config.speaker(handlerInput.requestEnvelope.request.locale || 'en-US')}">`;
    if (handlerInput.requestEnvelope.request.locale === 'en-US') {
      speechText += en;
    } else {
      speechText += pt;
    }
    speechText += '</voice>';
    return speechText;
  }

  configureVirtualAssistant = (chatbot: IChatbotProvider, getSpeakText: IGetSpeakText): void => {
    const cardTitle = 'Chatbot!';

    // Skill principal de contar historia (manter o skill aberto)
    const utteranceIntentHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'UtteranceIntent';
      },
      async handle(handlerInput: HandlerInput): Promise<Response> {
        try {
          const request = handlerInput.requestEnvelope.request;
          const attributes = handlerInput.attributesManager.getSessionAttributes();

          // Capturar o que foi falado
          const query = request.intent.slots.text.value;

          const result = await chatbot.prompt(query);

          // Variavel usada para armazenar o historico das conversas para pedir para continuar a historia
          attributes.completion = result;

          const speechText = getSpeakText({ handlerInput, en: result, pt: result });

          return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
        } catch (error) {
          const speechText = getSpeakText({
            handlerInput,
            en: 'Error while processing response, please try again later.',
            pt: 'Erro durante processamento da resposta, por favor tente mais tarde.',
          });
          return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
        }
      },
    };

    // Continuar a historia
    const ContinueIntentHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'ContinueIntent';
      },
      async handle(handlerInput: HandlerInput): Promise<Response> {
        try {
          const request = handlerInput.requestEnvelope.request;
          const attributes = handlerInput.attributesManager.getSessionAttributes();
          // Variavel usada para armazenar o historico das conversas para pedir para continuar a historia
          let query = request.locale === 'en-US' ? 'Continue the following: ' : 'Continue o seguinte: ';
          query += attributes.completion || (request.locale === 'en-US' ? 'Hi there' : 'Olá');

          const result = await chatbot.prompt(query);

          const speechText = getSpeakText({ handlerInput, en: result, pt: result });

          return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
        } catch (error) {
          const speechText = getSpeakText({
            handlerInput,
            en: 'Error while processing response, please try again later.',
            pt: 'Erro durante processamento da resposta, por favor tente mais tarde.',
          });
          return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
        }
      },
    };

    // Skill is Launched
    const LaunchRequestHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
      },
      handle(handlerInput: HandlerInput): Response {
        const speechText = getSpeakText({
          handlerInput,
          en: 'Hi there!',
          pt: 'Fala aí!',
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
      },
    };

    // User ask help
    const HelpIntentHandler: RequestHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
      },
      handle(handlerInput: HandlerInput): Response {
        const speechText = getSpeakText({
          handlerInput,
          en: `I'm ChatGPT bot, you can ask me anything.`,
          pt: 'Eu sou ChatGPT, você pode me perguntar qualquer coisa',
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).withSimpleCard(cardTitle, speechText).getResponse();
      },
    };

    // User ask to stop
    const CancelAndStopIntentHandler: RequestHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return (
          request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent')
        );
      },
      handle(handlerInput: HandlerInput): Response {
        const speechText = getSpeakText({
          handlerInput,
          en: 'Goodbye!',
          pt: 'Até Mais!',
        });

        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard(cardTitle, speechText)
          .withShouldEndSession(true)
          .getResponse();
      },
    };

    // Handler when session is ended (cleanup)
    const SessionEndedRequestHandler: RequestHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
      },
      handle(handlerInput: HandlerInput): Response {
        // console.log(`Session ended with reason: ${(handlerInput.requestEnvelope.request as SessionEndedRequest).reason}`);
        return handlerInput.responseBuilder.getResponse();
      },
    };

    // Error Handler
    const ErrorHandler: ErrorHandler = {
      canHandle(_handlerInput: HandlerInput, _error: Error): boolean {
        return true;
      },
      handle(handlerInput: HandlerInput, error: Error): Response {
        console.log(`Error handled: ${error.message}`);

        const speechText = getSpeakText({
          handlerInput,
          en: `Sorry, I don't understand your command. Please say it again.`,
          pt: 'Desulpe, eu não entendi, por favor fale novamente',
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
      },
    };

    // The intent reflector is used for interaction model testing and debugging.
    // It will simply repeat the intent the user said. You can create custom handlers
    const IntentReflectorHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest';
      },
      handle(handlerInput: HandlerInput): Response {
        const intentName = getIntentName(handlerInput.requestEnvelope);

        const speechText = getSpeakText({
          handlerInput,
          en: `You just triggered ${intentName}`,
          pt: `Você disparou ${intentName}`,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
      },
    };

    // No other Intent is suported
    const FallbackIntentHandler = {
      canHandle(handlerInput: HandlerInput): boolean {
        return (
          getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
          getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent'
        );
      },
      handle(handlerInput: HandlerInput): Response {
        const speechText = getSpeakText({
          handlerInput,
          en: `Sorry, I have no knowledge about that. FallbackIntent`,
          pt: `Foi mal, não tenho o conhecimento sobre isso. fallbackIntent`,
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
      .lambda();
  };
}

export default Alexa;
