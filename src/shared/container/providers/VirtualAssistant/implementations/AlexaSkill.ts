import { container, inject, injectable } from 'tsyringe';
import { DefaultApiClient, SkillBuilders, LambdaHandler } from 'ask-sdk';
import ProvidersEnum from '../../ProvidersEnum';
import IVirtualAssistantProvider from '../models/IVirtualAssistantProvider';
import IStorageProvider from '../../StorageProvider/models/IStorageProvider';
import LaunchRequestHandler from './intents/LaunchRequestHandler';
import UtteranceIntentHandler from './intents/UtteranceIntentHandler';
import ContinueIntentHandler from './intents/ContinueIntentHandler';
import HelpIntentHandler from './intents/HelpIntentHandler';
import CancelAndStopIntentHandler from './intents/CancelAndStopIntentHandler';
import SessionEndedRequestHandler from './intents/SessionEndedRequestHandler';
import FallbackIntentHandler from './intents/FallbackIntentHandler';
import IntentReflectorHandler from './intents/IntentReflectorHandler';
import AlexaFunctions from './AlexaFunctions';
import ErrorHandler from './intents/ErrorHandler';

@injectable()
class AlexaSkill implements IVirtualAssistantProvider {
  skill: LambdaHandler;

  public constructor(
    @inject(ProvidersEnum.STORAGE)
    private storage: IStorageProvider,
  ) {
    this.configureVirtualAssistant();
  }

  getSkill(): LambdaHandler {
    return this.skill;
  }

  configureVirtualAssistant() {
    const chatbotFunctions = container.resolve(AlexaFunctions);

    this.skill = SkillBuilders.custom()
      .addRequestHandlers(
        new LaunchRequestHandler(chatbotFunctions).getIntent(),
        new UtteranceIntentHandler(chatbotFunctions).getIntent(),
        new ContinueIntentHandler(chatbotFunctions).getIntent(),
        new HelpIntentHandler(chatbotFunctions).getIntent(),
        new CancelAndStopIntentHandler(chatbotFunctions).getIntent(),
        new SessionEndedRequestHandler(chatbotFunctions).getIntent(),
        new FallbackIntentHandler(chatbotFunctions).getIntent(),
        new IntentReflectorHandler(chatbotFunctions).getIntent(), // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
      )
      .addErrorHandlers(new ErrorHandler(chatbotFunctions).getIntent())
      .withApiClient(new DefaultApiClient()) // Obter o timezone, device_id
      .withPersistenceAdapter(this.storage.getPersistenceAdapter())
      .lambda();
  }
}

export default AlexaSkill;
