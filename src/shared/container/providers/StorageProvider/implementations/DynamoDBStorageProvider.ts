import { DynamoDbPersistenceAdapter, PersistenceAdapter } from 'ask-sdk';
import Configs from '../configs';
import IStorageProvider from '../interfaces/IStorageProvider';

class DynamoDBStorageProvider implements IStorageProvider {
  getPersistenceAdapter(): PersistenceAdapter {
    const adapter = new DynamoDbPersistenceAdapter(Configs.dynamoDB);
    return adapter;
  }
}

export default DynamoDBStorageProvider;
