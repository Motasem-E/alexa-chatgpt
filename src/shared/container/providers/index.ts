import Module from '@shared/decorators/Module';
import S3StorageProvider from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';
import ProvidersEnum from './ProvidersEnum';
import ChatGPT from './Chatbot/implementations/ChatGPT';
import Alexa from './VirtualAssistant/implementations/Alexa';

@Module({
  name: 'ContainerProviders',
  providers: [
    // { provideAs: ProvidersEnum.STORAGE, useClass: S3StorageProvider },
    { provideAs: ProvidersEnum.CHATBOT, useClass: ChatGPT },
    { provideAs: ProvidersEnum.VIRTUAL_ASSISTANT, useClass: Alexa },
  ],
})
export default class Providers {}
