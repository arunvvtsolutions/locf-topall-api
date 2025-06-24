import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProgramOutcomeDto {
  @IsNumber()
  @IsNotEmpty()
  program_id: number;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

