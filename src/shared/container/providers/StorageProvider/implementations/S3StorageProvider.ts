import { PersistenceAdapter } from 'ask-sdk';
import { S3PersistenceAdapter } from 'ask-sdk-s3-persistence-adapter';
import Configs from '../configs';
import IStorageProvider from '../interfaces/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  getPersistenceAdapter(): PersistenceAdapter {
    const adapter = new S3PersistenceAdapter(Configs.S3);
    return adapter;
  }
}

export default S3StorageProvider;
