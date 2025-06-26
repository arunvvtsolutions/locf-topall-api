import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        const region = configService.get<string>('AWS_S3_REGION');
        if (!region) {
          throw new Error('AWS_S3_REGION is not defined in environment variables');
        }
        
        const accessKeyId = configService.get<string>('AWS_S3_ACCESS_KEY_ID');
        const secretAccessKey = configService.get<string>('AWS_S3_SECRET_ACCESS_KEY');
        
        if (!accessKeyId || !secretAccessKey) {
          throw new Error('AWS S3 credentials are not properly configured');
        }
        
        const config: S3ClientConfig = {
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        };
        
        return new S3Client(config);
      },
      inject: [ConfigService],
    },
  ],
  exports: [FileUploadService],
})
export class FileUploadModule {}
