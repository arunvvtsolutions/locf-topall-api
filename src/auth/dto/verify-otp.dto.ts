import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '9876543210',
    description: 'Phone number to verify',
    minLength: 10,
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  phone: string;

  @ApiProperty({
    example: '123456',
    description: '4-6 digit OTP code received on the phone',
    minLength: 4,
    maxLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 6)
  otp: string;
};
