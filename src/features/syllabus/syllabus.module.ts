import { Module } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Syllabus } from './entities/syllabus.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Syllabus])],
  controllers: [SyllabusController],
  providers: [SyllabusService, PrismaService],
})
export class SyllabusModule { }
