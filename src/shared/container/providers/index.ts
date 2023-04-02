import Module from '@shared/decorators/Module';
import ProvidersEnum from './ProvidersEnum';
import ChatGPT from './Chatbot/implementations/ChatGPT';
import AlexaSkill from './VirtualAssistant/implementations/AlexaSkill';
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';
import AlexaFunctions from './VirtualAssistant/implementations/AlexaFunctions';

@Module({
  name: 'ContainerProviders',
  providers: [
    { provideAs: ProvidersEnum.STORAGE, useClass: S3StorageProvider },
    { provideAs: ProvidersEnum.CHATBOT, useClass: ChatGPT },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS, useClass: AlexaFunctions },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT_SKILL, useClass: AlexaSkill },
  ],
})
export default class Providers {}
