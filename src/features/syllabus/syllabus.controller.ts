import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SyllabusService } from './syllabus.service';

@ApiTags('Syllabus')
@ApiBearerAuth()
@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) { }

  @Get('course/:programId')
  @ApiOperation({ summary: 'Get courses by program ID' })
  @ApiParam({
    name: 'programId',
    required: true,
    description: 'The ID of the program',
    type: Number,
  })
  @ApiOkResponse({ description: 'The courses for the given program ID.' })
  getCoursesByProgramId(
    @Param('programId', ParseIntPipe) programId: number,
  ) {
    return this.syllabusService.getCoursesByProgramId(Number(programId));
  }

  @Get('processing-results/:p_id')
  getFileProcessingStatus(
    @Param('p_id', ParseIntPipe) p_id: number,
  ) {
    return this.syllabusService.getFileProcessingStatus(Number(p_id));
  }

  @Get(':programId/:organization_id')
  getSyllabusFile(
    @Param('programId', ParseIntPipe) programId: number,
    @Param('organization_id') organization_id: string
  ) {
    return this.syllabusService.getSyllabusFile({
      program_id: programId,
      organization_id: organization_id,
    });
  }


}