import { Provider } from './Provider.type';

export interface IModuleMetadata {
  name?: string;
  providers?: Array<Provider>;
}
