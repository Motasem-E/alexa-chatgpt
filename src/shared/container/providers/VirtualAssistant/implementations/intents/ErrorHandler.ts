import { HandlerInput, ErrorHandler as IErrorHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import IIntent from '../../models/IIntent';
import AlexaFunctions from '../AlexaFunctions';

/*
  Error ocorrer in Skill
*/
class ErrorHandler implements IIntent {
  private alexaFunctions: AlexaFunctions;

  constructor(alexaFunctions: AlexaFunctions) {
    this.alexaFunctions = alexaFunctions;
  }

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
