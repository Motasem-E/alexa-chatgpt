import { LambdaHandler } from 'ask-sdk';

interface IVirtualAssistantProvider {
  getSkill(): LambdaHandler;
  configureVirtualAssistant(): void;
}

export default IVirtualAssistantProvider;
