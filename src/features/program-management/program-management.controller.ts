import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ProgramManagementService } from './program-management.service';
import { CreateProgramManagementDto, ProgramType } from './dto/create-program-management.dto';
import { UpdateProgramManagementDto } from './dto/update-program-management.dto';

@ApiTags('Program Management')
@Controller('programs')
export class ProgramManagementController {
  constructor(private readonly programManagementService: ProgramManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new program' })
  @ApiResponse({ status: 201, description: 'Program created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateProgramManagementDto })
  create(@Body() createProgramManagementDto: CreateProgramManagementDto) {
    return this.programManagementService.create(createProgramManagementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all programs' })
  @ApiResponse({ status: 200, description: 'Return all programs' })
  async findAll(
  ) {
    return this.programManagementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a program by ID' })
  @ApiParam({ name: 'id', description: 'Program ID', type: Number })
  @ApiResponse({ status: 200, description: 'Return the program' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.programManagementService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a program' })
  @ApiParam({ name: 'id', description: 'Program ID', type: Number })
  @ApiResponse({ status: 200, description: 'Program updated successfully' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiBody({ type: UpdateProgramManagementDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgramManagementDto: UpdateProgramManagementDto,
  ) {
    return this.programManagementService.update(id, updateProgramManagementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a program' })
  @ApiParam({ name: 'id', description: 'Program ID', type: Number })
  @ApiResponse({ status: 200, description: 'Program deleted successfully' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.programManagementService.remove(id);
  }
}
