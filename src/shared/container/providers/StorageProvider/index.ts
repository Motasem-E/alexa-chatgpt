import { env } from '@config/env';
import DynamoDBStorageProvider from './implementations/DynamoDBStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';
import StorageEnum from './interfaces/StorageEnum';

export default function getStorageProvider() {
  const storageProviders = {
    [StorageEnum.DYNAMODB]: DynamoDBStorageProvider,
    [StorageEnum.S3]: S3StorageProvider,
  };
  return storageProviders[env.STORAGE_PROVIDER];
}
