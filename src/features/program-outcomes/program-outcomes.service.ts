import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgramOutcomeDto } from './dto/create-program-outcome.dto';
import { UpdateProgramOutcomeDto } from './dto/update-program-outcome.dto';
import { ProgramOutcome } from './entities/program-outcome.entity';

@Injectable()
export class ProgramOutcomesService {
  constructor(
    @InjectRepository(ProgramOutcome)
    private readonly programOutcomeRepository: Repository<ProgramOutcome>,
  ) {}

  async create(createProgramOutcomeDto: CreateProgramOutcomeDto): Promise<ProgramOutcome> {
    const programOutcome = this.programOutcomeRepository.create(createProgramOutcomeDto);
    return this.programOutcomeRepository.save(programOutcome);
  }

  async findAll(): Promise<ProgramOutcome[]> {
    return this.programOutcomeRepository.find();
  }

}
