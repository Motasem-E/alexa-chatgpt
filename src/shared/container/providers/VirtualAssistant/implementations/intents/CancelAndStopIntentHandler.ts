import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import IIntent from '../../models/IIntent';
import AlexaFunctions from '../AlexaFunctions';
import Config from '../../config';

/*
  User asked to stop
*/
class CancelAndStopIntentHandler implements IIntent {
  private alexaFunctions: AlexaFunctions;

  constructor(alexaFunctions: AlexaFunctions) {
    this.alexaFunctions = alexaFunctions;
  }

  getIntent(): RequestHandler {
    return {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;
        return (
          request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent')
        );
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        const speechText = this.alexaFunctions.getTextToSpeak({
          handlerInput,
          en: 'Goodbye!',
          pt: 'Até Mais!',
          isSystemText: true,
        });

        await this.alexaFunctions.persistHistory(handlerInput);

        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard(Config.cardTitle, speechText)
          .withShouldEndSession(true)
          .getResponse();
      },
    };
  }
}

export default CancelAndStopIntentHandler;
