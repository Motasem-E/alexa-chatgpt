import Module from '@shared/decorators/Module';
// import DiskStorage from '@shared/container/providers/StorageProvider/implementations/DiskStorage';
import ProvidersEnum from './ProvidersEnum';
import ChatGPT from './Chatbot/implementations/ChatGPT';
import Alexa from './VirtualAssistant/implementations/Alexa';

@Module({
  name: 'ContainerProviders',
  providers: [
    //   { provideAs: ProvidersEnum.STORAGE, useClass: DiskStorage },
    { provideAs: ProvidersEnum.CHATBOT, useClass: ChatGPT },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT, useClass: Alexa },
  ],
})
export default class Providers {}
