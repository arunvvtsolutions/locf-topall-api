import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsNotEmpty()
  file: any;

  @ApiProperty({ description: 'Organization ID', example: "1" })
  @IsString()
  @IsNotEmpty()
  organization_id: string;

  @ApiProperty({ description: 'Program ID', example: "1" })
  @IsString()
  @IsNotEmpty()
  program_id: string;

  @ApiProperty({ description: 'uuid', example: '134234324324432432' })
  @IsString()
  @IsNotEmpty()
  uuid: string;
}

export interface UploadedFileResponse {
  key: string;
  url: string;
  previewUrl?: string;
  type: string;
  size: number;
  organization_id: string;
  program_id: string;
  uuid: string;
  file_path: string;
  file_name: string;
}
