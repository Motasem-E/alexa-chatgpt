import ProvidersEnum from '@shared/types/ProvidersEnum';
import { getIntentName, HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import IVirtualAssistantFunctions from '../../interfaces/IVirtualAssistantFunctions';
import IIntent from '../../interfaces/IIntent';

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
@injectable()
class IntentReflectorHandler implements IIntent {
  constructor(
    @inject(ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS)
    private alexaFunctions: IVirtualAssistantFunctions,
  ) {}

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
