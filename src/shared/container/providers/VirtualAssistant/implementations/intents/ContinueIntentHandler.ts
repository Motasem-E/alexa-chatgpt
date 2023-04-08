import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import ProvidersEnum from '@shared/types/ProvidersEnum';
import IIntent from '../../interfaces/IIntent';
import Config from '../../config';
import IVirtualAssistantFunctions from '../../interfaces/IVirtualAssistantFunctions';

// Continuar a historia (enquanto falar para continuar, ele vai concatenando o que já falou e irá complementar)
@injectable()
class ContinueIntentHandler implements IIntent {
  constructor(
    @inject(ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS)
    private alexaFunctions: IVirtualAssistantFunctions,
  ) {}

  getIntent(): RequestHandler {
    return {
      canHandle: (handlerInput: HandlerInput): boolean => {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'ContinueIntent';
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        try {
          const query = this.alexaFunctions.getSpokenText(handlerInput);

          const result = await this.alexaFunctions.askChatbot(handlerInput, query);

          const speechText = this.alexaFunctions.getTextToSpeak({ handlerInput, en: result, pt: result, isSystemText: false });

          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(Config.cardTitle, speechText)
            .getResponse();
        } catch (error) {
          const speechText = this.alexaFunctions.getTextToSpeak({
            handlerInput,
            en: 'Error while processing response, please try again later.',
            pt: 'Erro durante processamento da resposta, por favor tente mais tarde.',
            isSystemText: true,
          });
          console.log('ContinueIntentHandler Error: ', error);
          return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(Config.cardTitle, speechText)
            .getResponse();
        }
      },
    };
  }
}

export default ContinueIntentHandler;
