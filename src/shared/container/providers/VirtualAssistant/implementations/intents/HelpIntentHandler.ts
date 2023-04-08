import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import ProvidersEnum from '@shared/container/providers/ProvidersEnum';
import IIntent from '../../interfaces/IIntent';
import Config from '../../config';
import IVirtualAssistantFunctions from '../../interfaces/IVirtualAssistantFunctions';

/*
  User asked for help
*/
@injectable()
class HelpIntentHandler implements IIntent {
  constructor(
    @inject(ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS)
    private alexaFunctions: IVirtualAssistantFunctions,
  ) {}

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
