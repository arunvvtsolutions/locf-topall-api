import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiCreatedResponse, 
  ApiOkResponse, 
  ApiNotFoundResponse, 
  ApiBadRequestResponse 
} from '@nestjs/swagger';
import { YearsService } from './years.service';
import { CreateYearDto } from './dto/create-year.dto';
import { UpdateYearDto } from './dto/update-year.dto';

@ApiTags('years')
@Controller('years')
export class YearsController {
  constructor(private readonly yearsService: YearsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new academic year' })
  @ApiCreatedResponse({ 
    description: 'The academic year has been successfully created.',
    type: CreateYearDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: CreateYearDto })
  create(@Body() createYearDto: CreateYearDto) {
    return this.yearsService.create(createYearDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all academic years' })
  @ApiOkResponse({ 
    description: 'Returns all academic years',
    type: [CreateYearDto],
  })
  findAll() {
    return this.yearsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an academic year by ID' })
  @ApiParam({ name: 'id', description: 'Academic year ID', type: Number })
  @ApiOkResponse({ 
    description: 'Returns the academic year with the specified ID',
    type: CreateYearDto,
  })
  @ApiNotFoundResponse({ description: 'Academic year not found' })
  findOne(@Param('id') id: string) {
    return this.yearsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an academic year' })
  @ApiParam({ name: 'id', description: 'Academic year ID', type: Number })
  @ApiOkResponse({ 
    description: 'The academic year has been successfully updated',
    type: UpdateYearDto,
  })
  @ApiNotFoundResponse({ description: 'Academic year not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: UpdateYearDto })
  update(@Param('id') id: string, @Body() updateYearDto: UpdateYearDto) {
    return this.yearsService.update(+id, updateYearDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an academic year' })
  @ApiParam({ name: 'id', description: 'Academic year ID', type: Number })
  @ApiOkResponse({ description: 'The academic year has been successfully deleted' })
  @ApiNotFoundResponse({ description: 'Academic year not found' })
  remove(@Param('id') id: string) {
    return this.yearsService.remove(+id);
  }
}
