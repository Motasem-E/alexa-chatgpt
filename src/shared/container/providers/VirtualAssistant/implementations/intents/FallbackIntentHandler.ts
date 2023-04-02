import { getIntentName, getRequestType, HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import IIntent from '../../models/IIntent';
import AlexaFunctions from '../AlexaFunctions';

/*
  Called when no other Intent is suported
*/
class FallbackIntentHandler implements IIntent {
  private alexaFunctions: AlexaFunctions;

  constructor(alexaFunctions: AlexaFunctions) {
    this.alexaFunctions = alexaFunctions;
  }

  getIntent(): RequestHandler {
    return {
      canHandle: (handlerInput: HandlerInput): boolean =>
        getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
        getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent',
      handle: (handlerInput: HandlerInput): Response => {
        const speechText = this.alexaFunctions.getTextToSpeak({
          handlerInput,
          en: `Sorry, I have no knowledge about that. FallbackIntent`,
          pt: `Foi mal, não tenho o conhecimento sobre isso. fallbackIntent`,
          isSystemText: true,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
      },
    };
  }
}

export default FallbackIntentHandler;
