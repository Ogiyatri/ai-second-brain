import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { MINIO_CLIENT } from '../../../shared/storage/minio.constants';

@Injectable()
export class MinioStorageService implements OnModuleInit {
  private readonly bucket: string;

  constructor(
    @Inject(MINIO_CLIENT) private readonly client: Minio.Client,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.get('MINIO_BUCKET') || 'documents';
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      console.log(`✅ MinIO bucket "${this.bucket}" created`);
    }
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const objectName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    await this.client.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );
    return objectName;
  }

  async getUrl(objectName: string): Promise<string> {
    return this.client.presignedGetObject(this.bucket, objectName, 60 * 60);
  }

  async delete(objectName: string): Promise<void> {
    await this.client.removeObject(this.bucket, objectName);
  }
}
