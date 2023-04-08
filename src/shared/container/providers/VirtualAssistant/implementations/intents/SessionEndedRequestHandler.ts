import ProvidersEnum from '@shared/types/ProvidersEnum';
import { HandlerInput, RequestHandler } from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { inject, injectable } from 'tsyringe';
import IVirtualAssistantFunctions from '../../interfaces/IVirtualAssistantFunctions';
import IIntent from '../../interfaces/IIntent';

/*
  Handler when session is ended (cleanup)
  Salvar todo histórico de conversa
*/
@injectable()
class SessionEndedRequestHandler implements IIntent {
  constructor(
    @inject(ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS)
    private alexaFunctions: IVirtualAssistantFunctions,
  ) {}

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
