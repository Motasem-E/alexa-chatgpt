import { LambdaHandler } from 'ask-sdk';

interface IVirtualAssistantProvider {
  configureVirtualAssistant(): void;
  getSkill(): LambdaHandler;
}

export default IVirtualAssistantProvider;
