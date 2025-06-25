import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { FileType } from './enums/file-type.enum';
import type { UploadedFileResponse } from './dto/file-upload.dto';
import axios from 'axios';

export { UploadedFileResponse } from './dto/file-upload.dto';

@Injectable()
export class FileUploadService {
  private readonly bucketName: string;
  private readonly fileUrl: string;

  constructor(
    @Inject('S3_CLIENT') private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
    this.fileUrl = this.configService.get<string>('AWS_S3_FILE_URL') || '';
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  private getFileType(mimetype: string): FileType {
    if (mimetype.startsWith('image/')) return FileType.IMAGE;
    if (mimetype === 'application/pdf') return FileType.PDF;
    return FileType.OTHER;
  }

  private getFileFolder(fileType: FileType): string {
    switch (fileType) {
      case FileType.IMAGE:
        return this.configService.get<string>('NEXT_PUBLIC_S3_IMAGE_FOLDER') || 'images';
      case FileType.PDF:
        return this.configService.get<string>('NEXT_PUBLIC_S3_PDF_FOLDER') || 'pdfs';
      default:
        return 'others';
    }
  }

  async uploadFile(
    file: Express.Multer.File, 
    organizationId: string, 
    programId: string,
    uuid: string
  ): Promise<UploadedFileResponse> {
    try {
      const fileType = this.getFileType(file.mimetype);
      const fileExtension = this.getFileExtension(file.originalname);
      const folder = this.getFileFolder(fileType);
      const key = `${folder}/${uuidv4()}.${fileExtension}`;
  
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
  
      const command = new PutObjectCommand(params);
      await this.s3Client.send(command);
  
      const url = `${this.fileUrl}/${key}`;
      let previewUrl = url;
  
      if (fileType !== FileType.IMAGE) {
        const getObjectCommand = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        previewUrl = await getSignedUrl(this.s3Client, getObjectCommand, { expiresIn: 3600 });
      };
  
      const fileUuid = key.split('/').pop()?.split('.')[0] || '';
  
      // ✅ Call the external PDF content extraction API
      const res = await axios.post('http://192.168.0.144:8000/locf/extract_pdf_content', {
        file_path: url,
        file_name: file.originalname,
        uuid: fileUuid,
        organization_id: Number(organizationId),
        program_id: Number(programId),
      });
  
      console.log("res",res);
      
      return {
        key,
        url,
        previewUrl: fileType === FileType.IMAGE ? undefined : previewUrl,
        type: file.mimetype,
        size: file.size,
        organization_id: organizationId,
        program_id: programId,
        uuid: fileUuid,
        file_path: key,
        file_name: file.originalname
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async getFileUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw new NotFoundException('File not found');
    }
  }
}
