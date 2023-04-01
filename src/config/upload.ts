import path from 'path';
import { env } from './env';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploaderConfig {
  driver: string;
  tmpFolder: string;
  uploadsFolder: string;
  config: {
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: env.STORAGE_PROVIDER,
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  config: {
    aws: {
      bucket: env.S3_BUCKET_NAME,
    },
  },
} as IUploaderConfig;
