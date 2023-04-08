import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';
import { container } from 'tsyringe';
import ProvidersEnum from '@shared/types/ProvidersEnum';
import IVirtualAssistantProvider from '@shared/container/providers/VirtualAssistant/interfaces/IVirtualAssistantProvider';

const chatbot = container.resolve<IVirtualAssistantProvider>(ProvidersEnum.VIRTUAL_ASSISTANT_SKILL);
export const handler = chatbot.getSkill();
