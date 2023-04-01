import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@shared/container/providers/StorageProvider/config';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-west-2',
    });
  }

  public async saveDataToFile(fileName: string, data: string): Promise<void> {
    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: fileName,
        ACL: 'public-read',
        Body: data,
        ContentDisposition: `inline; filename=${fileName}`,
      })
      .promise();
  }

  public async getFileContents(fileName: string): Promise<string> {
    const content = await this.client
      .getObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: fileName,
      })
      .promise();

    const data = content.Body?.valueOf() as string | undefined;

    if (data === undefined) {
      throw new AppError('File not found');
    }

    return data;
  }

  getLastFileContents(): string {
    throw new Error('Method not implemented.');
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
