import { container, inject, injectable } from 'tsyringe';
import { DefaultApiClient, SkillBuilders, LambdaHandler } from 'ask-sdk';
import ProvidersEnum from '../../../../types/ProvidersEnum';
import IVirtualAssistantProvider from '../interfaces/IVirtualAssistantProvider';
import IStorageProvider from '../../StorageProvider/interfaces/IStorageProvider';
import LaunchRequestHandler from './intents/LaunchRequestHandler';
import UtteranceIntentHandler from './intents/UtteranceIntentHandler';
import ContinueIntentHandler from './intents/ContinueIntentHandler';
import HelpIntentHandler from './intents/HelpIntentHandler';
import CancelAndStopIntentHandler from './intents/CancelAndStopIntentHandler';
import SessionEndedRequestHandler from './intents/SessionEndedRequestHandler';
import FallbackIntentHandler from './intents/FallbackIntentHandler';
import IntentReflectorHandler from './intents/IntentReflectorHandler';
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
    this.skill = SkillBuilders.custom()
      .addRequestHandlers(
        container.resolve(LaunchRequestHandler).getIntent(),
        container.resolve(UtteranceIntentHandler).getIntent(),
        container.resolve(ContinueIntentHandler).getIntent(),
        container.resolve(HelpIntentHandler).getIntent(),
        container.resolve(CancelAndStopIntentHandler).getIntent(),
        container.resolve(SessionEndedRequestHandler).getIntent(),
        container.resolve(FallbackIntentHandler).getIntent(),
        container.resolve(IntentReflectorHandler).getIntent(), // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
      )
      .addErrorHandlers(container.resolve(ErrorHandler).getIntent())
      .withApiClient(new DefaultApiClient()) // Obter o timezone, device_id
      .withPersistenceAdapter(this.storage.getPersistenceAdapter())
      .lambda();
  }
}

export default AlexaSkill;
