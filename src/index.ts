import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';
import { container } from 'tsyringe';
import ProvidersEnum from '@shared/container/providers/ProvidersEnum';
import IVirtualAssistantProvider from '@shared/container/providers/VirtualAssistant/models/IVirtualAssistantProvider';

const skill = container.resolve<IVirtualAssistantProvider>(ProvidersEnum.VIRTUAL_ASSISTANT);
export const handler = skill.getSkill();
