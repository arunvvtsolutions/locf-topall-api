import { Injectable } from '@nestjs/common';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AcademicYearsService {
  constructor(private prisma: PrismaService) {}
  async create(createAcademicYearDto: CreateAcademicYearDto) {
    try {
      const programs = await this.prisma.academic_years.findMany({
        where: {},
      });
      return 'This action adds a new academicYear';
    } catch (error) {}
  }

  async findAll() {
    try {
      const programs = await this.prisma.academic_years.findMany({
        where: {
          is_active: true,
        },
      });
      return `This action returns all academicYears`;
    } catch (error) {}
  }

  findOne(id: number) {
    return `This action returns a #${id} academicYear`;
  }

  update(id: number, updateAcademicYearDto: UpdateAcademicYearDto) {
    return `This action updates a #${id} academicYear`;
  }

  remove(id: number) {
    return `This action removes a #${id} academicYear`;
  }
}
