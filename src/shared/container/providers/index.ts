import Module from '@shared/decorators/Module';
import ProvidersEnum from './ProvidersEnum';
import ChatGPT from './Chatbot/implementations/ChatGPT';
import AlexaSkill from './VirtualAssistant/implementations/AlexaSkill';
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';

@Module({
  name: 'ContainerProviders',
  providers: [
    { provideAs: ProvidersEnum.STORAGE, useClass: S3StorageProvider },
    { provideAs: ProvidersEnum.CHATBOT, useClass: ChatGPT },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT, useClass: AlexaSkill },
  ],
})
export default class Providers {}
