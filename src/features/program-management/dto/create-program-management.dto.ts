import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum ProgramType {
  UNDERGRADUATE = 'undergraduate',
  POSTGRADUATE = 'postgraduate',
  DIPLOMA = 'diploma',
  CERTIFICATE = 'certificate',
  PHD = 'phd',
  OTHER = 'other',
}

export enum ProgramStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

export class CreateProgramManagementDto {
  @ApiProperty({ description: 'Unique program code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Name of the program' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the program', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Accreditation details in JSON format', required: false })
  @IsOptional()
  accreditation_details?: any;

  @ApiProperty({ description: 'Admission criteria in JSON format', required: false })
  @IsOptional()
  admission_criteria?: any;

  @ApiProperty({ description: 'Duration of the program in years', required: false })
  @IsNumber()
  @IsOptional()
  duration_years?: number;

  @ApiProperty({ description: 'Total number of semesters', required: false })
  @IsNumber()
  @IsOptional()
  total_semesters?: number;

  @ApiProperty({ enum: ProgramType, description: 'Type of the program' })
  @IsEnum(ProgramType)
  program_type: ProgramType;

  @ApiProperty({ enum: ProgramStatus, description: 'Status of the program', required: false })
  @IsEnum(ProgramStatus)
  @IsOptional()
  status?: ProgramStatus;

  @ApiProperty({ description: 'Organization ID' })
  @IsString()
  @IsNotEmpty()
  organization_id: string;

  @ApiProperty({ description: 'academic_year_id of the program', required: false })
  @IsNumber()
  @IsNotEmpty()
  academic_year_id: number;
}
