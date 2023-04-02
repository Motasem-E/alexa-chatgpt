import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import IIntent from '../../models/IIntent';
import AlexaFunctions from '../AlexaFunctions';

/*
  Handler when session is ended (cleanup)
  Salvar todo histórico de conversa
*/
class SessionEndedRequestHandler implements IIntent {
  private alexaFunctions: AlexaFunctions;

  constructor(alexaFunctions: AlexaFunctions) {
    this.alexaFunctions = alexaFunctions;
  }

  getIntent(): RequestHandler {
    return {
      canHandle(handlerInput: HandlerInput): boolean {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
      },
      handle: async (handlerInput: HandlerInput): Promise<Response> => {
        await this.alexaFunctions.persistHistory(handlerInput);
        return handlerInput.responseBuilder.getResponse();
      },
    };
  }
}

export default SessionEndedRequestHandler;
