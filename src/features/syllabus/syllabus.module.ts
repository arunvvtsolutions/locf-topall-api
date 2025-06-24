import { Module } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SyllabusController],
  providers: [SyllabusService, PrismaService],
})
export class SyllabusModule {}
