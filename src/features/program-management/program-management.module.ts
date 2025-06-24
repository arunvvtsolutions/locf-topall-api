import { Module } from '@nestjs/common';
import { ProgramManagementService } from './program-management.service';
import { ProgramManagementController } from './program-management.controller';

@Module({
  controllers: [ProgramManagementController],
  providers: [ProgramManagementService],
})
export class ProgramManagementModule {}
