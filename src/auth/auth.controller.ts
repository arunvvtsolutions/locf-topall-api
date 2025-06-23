import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Send OTP to a phone number' })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async emailLogin(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.emailLogin(sendOtpDto);
  }
};
