import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioStorageService } from 'src/documents/infrastructure/storage/minio-storage.service';
import * as Minio from 'minio';
import { MINIO_CLIENT } from './minio.constants';

export { MINIO_CLIENT } from './minio.constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MINIO_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Minio.Client({
          endPoint: config.get('MINIO_HOST') || 'localhost',
          port: config.get<number>('MINIO_PORT') || 9000,
          useSSL: false,
          accessKey: config.get('MINIO_ROOT_USER'),
          secretKey: config.get('MINIO_ROOT_PASSWORD'),
        });
      },
    },
    MinioStorageService,
  ],
  exports: [MINIO_CLIENT, MinioStorageService],
})
export class MinioModule {}
