import { env } from '@config/env';
import { RequestEnvelope } from 'ask-sdk-model';

export default {
  s3: {
    bucketName: env.S3_BUCKET_NAME || '',
    pathPrefix: 'Media/',
    objectKeyGenerator: (_: RequestEnvelope) => 'chathistory.txt',
  },
  dynamoDB: {
    tableName: 'b8561264-7f67-4658-bdc5-3aa62c695aea',
  },
};
