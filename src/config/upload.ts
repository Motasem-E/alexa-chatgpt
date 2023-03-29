import path from 'path';
import { env } from './env';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploaderConfig {
  driver: string;
  tmpFolder: string;
  uploadsFolder: string;
  config: {
    disk: unknown;
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
    disk: {},
    aws: {
      bucket: 'example-bucket',
    },
  },
} as IUploaderConfig;
