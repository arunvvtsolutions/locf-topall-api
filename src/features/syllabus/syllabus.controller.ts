import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { GetSyllabusFileDto } from './dto/get-syllabus-file.dto';

@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) { }
  @Get(':programId/:organization_id')
  getSyllabusFile(
    @Param('programId') programId: number,
    @Param('organization_id') organization_id: string
  ) {
    return this.syllabusService.getSyllabusFile({
      program_id: Number(programId),
      organization_id: organization_id,
    });
  }
}
