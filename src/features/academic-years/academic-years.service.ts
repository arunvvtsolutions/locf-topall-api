import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { AcademicYear } from './entities/academic-year.entity';

@Injectable()
export class AcademicYearsService {
  constructor(private prisma: PrismaService) {}
 
  async create(createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
    try {
      // Check if academic year already exists
      const existingYear = await this.prisma.academic_years.findFirst({
        where: {
        },
      });

      if (existingYear) {
        throw new Error('Academic year already exists');
      }

      // If this is the first academic year, set it as active
      const academicYears = await this.prisma.academic_years.findMany();
      const isFirstRecord = academicYears.length === 0;

      const data: any = {
        ...createAcademicYearDto,
      };

      // If setting this as active, deactivate others
      if (data.is_active) {
        await this.prisma.academic_years.updateMany({
          where: { is_active: true },
          data: { is_active: false },
        });
      }

      return this.prisma.academic_years.create({
        data: {
          year_id: data.year_id,
         is_active: data.is_active,
         created_at: new Date(),
         updated_at: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Failed to create academic year: ${error.message}`);
    }
  }


  async findAll(includeInactive: boolean = false): Promise<AcademicYear[]> {
    try {
      const where = includeInactive ? {} : { is_active: true };
      return this.prisma.academic_years.findMany({
        where,
        orderBy: { year_id: 'desc' },
      });
    } catch (error) {
      throw new Error(`Failed to fetch academic years: ${error.message}`);
    }
  }


  async findOne(id: number): Promise<AcademicYear> {
    const academicYear = await this.prisma.academic_years.findUnique({
      where: { id },
    });

    if (!academicYear) {
      throw new NotFoundException(`Academic year with ID ${id} not found`);
    }

    return academicYear;
  }


  async update(id: number, updateAcademicYearDto: UpdateAcademicYearDto): Promise<AcademicYear> {
    try {
      // Check if academic year exists
      await this.findOne(id);

      // If academic_year is being updated, check for duplicates
      

      return this.prisma.academic_years.update({
        where: { id },
        data: {
          ...updateAcademicYearDto,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update academic year: ${error.message}`);
    }
  }


  async remove(id: number): Promise<AcademicYear> {
    try {
      // Check if academic year exists
      const academicYear = await this.findOne(id);

      return this.prisma.academic_years.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to delete academic year: ${error.message}`);
    }
  }

  async setActive(id: number): Promise<AcademicYear> {
    try {
      // Check if academic year exists
      await this.findOne(id);

      // Deactivate all other academic years
      await this.prisma.academic_years.updateMany({
        where: {
          is_active: true,
          NOT: { id },
        },
        data: { is_active: false },
      });

      // Activate the specified academic year
      return this.prisma.academic_years.update({
        where: { id },
        data: {
          is_active: true,
          updated_at: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to set academic year as active: ${error.message}`);
    }
  }
}
