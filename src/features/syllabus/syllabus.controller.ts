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

  @Get('course-outcomes/:courseId')
  @ApiOperation({ summary: 'Get course outcomes by course ID' })
  @ApiParam({
    name: 'courseId',
    required: true,
    description: 'The ID of the course',
    type: Number,
  })
  @ApiOkResponse({ description: 'The course outcomes for the given course ID.' })
  getCourseOutcomesByCourseId(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.syllabusService.getCourseOutcomesByCourseId(courseId);
  }

  @Get('co-po-mappings/:courseId')
  @ApiOperation({ summary: 'Get course outcomes by course ID' })
  @ApiParam({
    name: 'courseId',
    required: true,
    description: 'The ID of the course',
    type: Number,
  })
  @ApiOkResponse({ description: 'The course outcomes for the given course ID.' })
  getCOPOMappingsByCourseId(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.syllabusService.getCOPOMappingsByCourseId(courseId);
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