import { getIntentName, HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import IIntent from '../../models/IIntent';
import AlexaFunctions from '../AlexaFunctions';

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
class IntentReflectorHandler implements IIntent {
  private alexaFunctions: AlexaFunctions;

  constructor(alexaFunctions: AlexaFunctions) {
    this.alexaFunctions = alexaFunctions;
  }

  getIntent(): RequestHandler {
    return {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest';
      },
      handle: (handlerInput: HandlerInput): Response => {
        const intentName = getIntentName(handlerInput.requestEnvelope);

        const speechText = this.alexaFunctions.getTextToSpeak({
          handlerInput,
          en: `You just triggered ${intentName}`,
          pt: `Você disparou ${intentName}`,
          isSystemText: true,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
      },
    };
  }
}

export default IntentReflectorHandler;
