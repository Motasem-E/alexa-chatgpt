import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import IIntent from '../../models/IIntent';
import AlexaFunctions from '../AlexaFunctions';
import Config from '../../config';

/*
  User asked for help
*/
class HelpIntentHandler implements IIntent {
  private alexaFunctions: AlexaFunctions;

  constructor(alexaFunctions: AlexaFunctions) {
    this.alexaFunctions = alexaFunctions;
  }

  getIntent(): RequestHandler {
    return {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
      },
      handle: (handlerInput: HandlerInput): Response => {
        const speechText = this.alexaFunctions.getTextToSpeak({
          handlerInput,
          en: `I'm ChatGPT bot, you can ask me anything.`,
          pt: 'Eu sou ChatGPT, você pode me perguntar qualquer coisa',
          isSystemText: true,
        });

        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .withSimpleCard(Config.cardTitle, speechText)
          .getResponse();
      },
    };
  }
}

export default HelpIntentHandler;
