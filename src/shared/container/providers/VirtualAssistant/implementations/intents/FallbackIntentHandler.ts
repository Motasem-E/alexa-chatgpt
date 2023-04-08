import ProvidersEnum from '@shared/container/providers/ProvidersEnum';
import { getIntentName, getRequestType, HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import IVirtualAssistantFunctions from '../../interfaces/IVirtualAssistantFunctions';
import IIntent from '../../interfaces/IIntent';

/*
  Called when no other Intent is suported
*/
@injectable()
class FallbackIntentHandler implements IIntent {
  constructor(
    @inject(ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS)
    private alexaFunctions: IVirtualAssistantFunctions,
  ) {}

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
