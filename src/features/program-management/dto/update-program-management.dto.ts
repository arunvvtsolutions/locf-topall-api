import { PartialType } from '@nestjs/swagger';
import { CreateProgramManagementDto } from './create-program-management.dto';

export class UpdateProgramManagementDto extends PartialType(CreateProgramManagementDto) {}
