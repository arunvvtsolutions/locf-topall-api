import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AcademicYearsService } from './academic-years.service';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { AcademicYear } from './entities/academic-year.entity';

@ApiTags('academic-years')
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new academic year' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The academic year has been successfully created.',
    type: AcademicYear,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input or academic year already exists',
  })
  @ApiBody({ type: CreateAcademicYearDto })
  create(@Body() createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
    return this.academicYearsService.create(createAcademicYearDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all academic years' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all academic years',
    type: [AcademicYear],
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Include inactive academic years in the results',
  })
  findAll(
    @Query('includeInactive') includeInactive?: boolean,
  ): Promise<AcademicYear[]> {
    return this.academicYearsService.findAll(includeInactive);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get the currently active academic year' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the active academic year',
    type: AcademicYear,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No active academic year found',
  })
  async findActive(): Promise<AcademicYear> {
    const academicYears = await this.academicYearsService.findAll(false);
    const activeYear = academicYears.find((year) => year.is_active);
    
    if (!activeYear) {
      throw new Error('No active academic year found');
    }
    
    return activeYear;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an academic year by ID' })
  @ApiParam({ name: 'id', description: 'Academic year ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the requested academic year',
    type: AcademicYear,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Academic year not found',
  })
  findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<AcademicYear> {
    return this.academicYearsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an academic year' })
  @ApiParam({ name: 'id', description: 'Academic year ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The academic year has been successfully updated.',
    type: AcademicYear,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Academic year not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiBody({ type: UpdateAcademicYearDto })
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateAcademicYearDto: UpdateAcademicYearDto,
  ): Promise<AcademicYear> {
    return this.academicYearsService.update(id, updateAcademicYearDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an academic year' })
  @ApiParam({ name: 'id', description: 'Academic year ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The academic year has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Academic year not found',
  })
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<void> {
    await this.academicYearsService.remove(id);
  }

  @Post(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set an academic year as active (and deactivate others)' })
  @ApiParam({ name: 'id', description: 'Academic year ID to activate' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The academic year has been activated.',
    type: AcademicYear,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Academic year not found',
  })
  activate(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<AcademicYear> {
    return this.academicYearsService.setActive(id);
  }
}
