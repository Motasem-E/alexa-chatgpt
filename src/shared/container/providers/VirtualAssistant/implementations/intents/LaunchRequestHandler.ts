import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import ProvidersEnum from '@shared/types/ProvidersEnum';
import IIntent from '../../interfaces/IIntent';
import Config from '../../config';
import IVirtualAssistantFunctions from '../../interfaces/IVirtualAssistantFunctions';

/*
  Skill is Launched
  Restaurar histórico de conversa
*/
@injectable()
class LaunchRequestHandler implements IIntent {
  constructor(
    @inject(ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS)
    private alexaFunctions: IVirtualAssistantFunctions,
  ) {}

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
