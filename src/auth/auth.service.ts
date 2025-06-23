import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async emailLogin(sendOtpDto: SendOtpDto) {
    try {
      const { email, password } = sendOtpDto;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException('Invalid email format');
      }

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (password !== user.password) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Login successful',
        accessToken,
      };
    } catch (error) {
      console.log('error', error);
    }
  }
}
