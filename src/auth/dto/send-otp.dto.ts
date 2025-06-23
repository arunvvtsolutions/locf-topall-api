import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '',
    description: '',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
};