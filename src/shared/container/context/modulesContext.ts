import { IModuleMetadata } from '@shared/types/IModuleMetadata';

class ModulesContext {
  public metadata: IModuleMetadata[] = [];
}

const context = new ModulesContext();

export default context;
