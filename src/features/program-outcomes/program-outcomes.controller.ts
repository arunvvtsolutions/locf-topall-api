import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProgramOutcomesService } from './program-outcomes.service';
import { CreateProgramOutcomeDto } from './dto/create-program-outcome.dto';
import { UpdateProgramOutcomeDto } from './dto/update-program-outcome.dto';

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


}
