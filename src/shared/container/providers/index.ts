import Module from '@shared/decorators/Module';
import { env } from '@config/env';
import ProvidersEnum from './ProvidersEnum';
import ChatGPT from './Chatbot/implementations/ChatGPT';
import AlexaSkill from './VirtualAssistant/implementations/AlexaSkill';
import DynamoDBStorageProvider from './StorageProvider/implementations/DynamoDBStorageProvider';
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';
import AlexaFunctions from './VirtualAssistant/implementations/AlexaFunctions';
import StorageEnum from './StorageProvider/interfaces/StorageEnum';

@Module({
  name: 'ContainerProviders',
  providers: [
    {
      provideAs: ProvidersEnum.STORAGE,
      useClass: env.STORAGE_PROVIDER === StorageEnum.DYNAMODB ? DynamoDBStorageProvider : S3StorageProvider,
    },
    { provideAs: ProvidersEnum.CHATBOT, useClass: ChatGPT },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS, useClass: AlexaFunctions },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT_SKILL, useClass: AlexaSkill },
  ],
})
export default class Providers {}
