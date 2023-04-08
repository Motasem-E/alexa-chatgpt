import 'reflect-metadata';
import 'dotenv/config';
import '@shared/container';
import { container } from 'tsyringe';
import ProvidersEnum from '@shared/container/providers/ProvidersEnum';
import IVirtualAssistantProvider from '@shared/container/providers/VirtualAssistant/interfaces/IVirtualAssistantProvider';

const skill = container.resolve<IVirtualAssistantProvider>(ProvidersEnum.VIRTUAL_ASSISTANT_SKILL);
export const handler = skill.getSkill();
