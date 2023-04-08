import ProvidersEnum from '@shared/container/providers/ProvidersEnum';
import { HandlerInput, ErrorHandler as IErrorHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import IVirtualAssistantFunctions from '../../interfaces/IVirtualAssistantFunctions';
import IIntent from '../../interfaces/IIntent';

/*
  Error ocorrer in Skill
*/
@injectable()
class ErrorHandler implements IIntent {
  constructor(
    @inject(ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS)
    private alexaFunctions: IVirtualAssistantFunctions,
  ) {}

  getIntent(): IErrorHandler {
    return {
      canHandle: (_handlerInput: HandlerInput, _error: Error): boolean => true,
      handle: async (handlerInput: HandlerInput, _error: Error): Promise<Response> => {
        console.log(`Error handled: ${_error.message}`);

        const speechText = this.alexaFunctions.getTextToSpeak({
          handlerInput,
          en: `Sorry, I don't understand your command. Please say it again.`,
          pt: 'Desulpe, eu não entendi, por favor fale novamente',
          isSystemText: true,
        });

        return handlerInput.responseBuilder.speak(speechText).reprompt(speechText).getResponse();
      },
    };
  }
}

export default ErrorHandler;
