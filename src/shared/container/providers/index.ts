import Module from '@shared/decorators/Module';
import ProvidersEnum from './ProvidersEnum';
import ChatGPT from './Chatbot/implementations/ChatGPT';
import AlexaSkill from './VirtualAssistant/implementations/AlexaSkill';
import AlexaFunctions from './VirtualAssistant/implementations/AlexaFunctions';
import getStorageProvider from './StorageProvider';

@Module({
  name: 'ContainerProviders',
  providers: [
    {
      provideAs: ProvidersEnum.STORAGE,
      useClass: getStorageProvider(),
    },
    { provideAs: ProvidersEnum.CHATBOT, useClass: ChatGPT },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT_FUNCTIONS, useClass: AlexaFunctions },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT_SKILL, useClass: AlexaSkill },
  ],
})
export default class Providers {}
