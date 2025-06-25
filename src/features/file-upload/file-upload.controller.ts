import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Express } from 'express';
import { FileUploadDto } from './dto/file-upload.dto';
import type { UploadedFileResponse } from './dto/file-upload.dto';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: FileUploadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The file has been successfully uploaded.',
    type: Object,
    schema: {
      properties: {
        key: { type: 'string' },
        url: { type: 'string' },
        previewUrl: { type: 'string', nullable: true },
        type: { type: 'string' },
        size: { type: 'number' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ): Promise<UploadedFileResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Parse the form data
    const formData = JSON.parse(JSON.stringify(body));
    console.log('Form data:', formData);
    console.log('File:', file);

    if (!formData.uuid) {
      throw new BadRequestException('UUID is required');
    }
    if (!formData.organization_id) {
      throw new BadRequestException('Organization ID is required');
    }
    if (!formData.program_id) {
      throw new BadRequestException('Program ID is required');
    }

    return this.fileUploadService.uploadFile(
      file, 
      formData.organization_id, 
      formData.program_id, 
      formData.uuid,
    );
  }

  @Get('url/:key')
  @ApiOperation({ summary: 'Get a file URL' })
  @ApiParam({ name: 'key', description: 'File key' })
  @ApiResponse({
    status: 200,
    description: 'Returns the file URL',
    type: String,
  })
  async getFileUrl(@Param('key') key: string): Promise<{ url: string }> {
    const url = await this.fileUploadService.getFileUrl(key);
    return { url };
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'key', description: 'File key' })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully deleted.',
  })
  async deleteFile(@Param('key') key: string): Promise<{ message: string }> {
    await this.fileUploadService.deleteFile(key);
    return { message: 'File deleted successfully' };
  }
}
