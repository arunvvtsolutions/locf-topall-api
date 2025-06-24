import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProgramOutcomesService } from './program-outcomes.service';
import { CreateProgramOutcomeDto } from './dto/create-program-outcome.dto';

@Controller('program-outcomes')
export class ProgramOutcomesController {
  constructor(private readonly programOutcomesService: ProgramOutcomesService) { }

  @Post()
  create(@Body() createProgramOutcomeDto: CreateProgramOutcomeDto) {
    return this.programOutcomesService.create(createProgramOutcomeDto);
  }

  @Get()
  findAll() {
    return this.programOutcomesService.findAll();
  }

  @Get('program/:programId')
  findByProgramId(@Param('programId') programId: string) {
    return this.programOutcomesService.findByProgramId(Number(programId));
  }


}
