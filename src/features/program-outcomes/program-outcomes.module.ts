import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramOutcomesService } from './program-outcomes.service';
import { ProgramOutcomesController } from './program-outcomes.controller';
import { ProgramOutcome } from './entities/program-outcome.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramOutcome])],
  controllers: [ProgramOutcomesController],
  providers: [ProgramOutcomesService],
})
export class ProgramOutcomesModule {}
