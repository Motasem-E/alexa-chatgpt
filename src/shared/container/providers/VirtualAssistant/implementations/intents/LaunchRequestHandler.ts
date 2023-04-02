import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import IIntent from '../../models/IIntent';
import AlexaFunctions from '../AlexaFunctions';
import Config from '../../config';

/*
  Skill is Launched
  Restaurar histórico de conversa
*/
class LaunchRequestHandler implements IIntent {
  private alexaFunctions: AlexaFunctions;

  constructor(alexaFunctions: AlexaFunctions) {
    this.alexaFunctions = alexaFunctions;
  }

  getIntent(): RequestHandler {
    return {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        await this.alexaFunctions.restoreHistory(handlerInput);

        const speechText = this.alexaFunctions.getTextToSpeak({
          handlerInput,
          en: 'Hi there!',
          pt: 'Fala aí!',
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

export default LaunchRequestHandler;
