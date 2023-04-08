import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import ProvidersEnum from '@shared/types/ProvidersEnum';
import IIntent from '../../interfaces/IIntent';
import IVirtualAssistantFunctions from '../AlexaFunctions';
import Config from '../../config';

/*
  User asked to stop
*/
@injectable()
class CancelAndStopIntentHandler implements IIntent {
  constructor(
    @inject(ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS)
    private alexaFunctions: IVirtualAssistantFunctions,
  ) {}

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
