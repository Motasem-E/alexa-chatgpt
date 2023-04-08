import { PersistenceAdapter } from 'ask-sdk';

interface IStorageProvider {
  getPersistenceAdapter(): PersistenceAdapter;
}

export default IStorageProvider;
