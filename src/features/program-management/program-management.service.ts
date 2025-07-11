import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, programs_status } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProgramManagementDto } from './dto/create-program-management.dto';
import { UpdateProgramManagementDto } from './dto/update-program-management.dto';

type ProgramStatus = programs_status;

@Injectable()
export class ProgramManagementService {
  constructor(private prisma: PrismaService) {}

  async create(createProgramManagementDto: CreateProgramManagementDto) {
  try {
    const { program_type, academic_year_id, ...rest } = createProgramManagementDto;

    return await this.prisma.$transaction(async (tx) => {
      let academicYear = await tx.academic_years.findUnique({
        where: { id: academic_year_id },
      });
      if (!academicYear) {
        academicYear = await tx.academic_years.create({
          data: {
            id: academic_year_id, 
            year_id: academic_year_id,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      }
      return tx.programs.create({
        data: {
          ...rest,
          academic_year_id: academicYear.id,
          program_type: program_type.toLowerCase() as any,
          status: (createProgramManagementDto.status?.toLowerCase() as programs_status) || 'draft',
        },
      });
    });
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
}


  async findAll() {
    try {
      const where: Prisma.programsWhereInput = {};
      const programs = await this.prisma.programs.findMany({
        where: {
          status: 'active',
        },
      });
      const resModel = programs.map(program => {
        return {
          id: program.id,
          code: program.code,
          name: program.name,
          description: program.description,
          accreditationDetails: program.accreditation_details,
          admissionCriteria: program.admission_criteria,
          durationYears: program.duration_years,
          totalSemesters: program.total_semesters,
          programType: program.program_type,
          status: program.status,
          programId: program.academic_year_id,
        };
      });

      return resModel;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    const program = await this.prisma.programs.findUnique({
      where: { id },
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }

    return program;
  }

  async update(id: number, updateProgramManagementDto: UpdateProgramManagementDto) {
    // Check if program exists
    await this.findOne(id);

    const { program_type, status, academic_year_id, ...rest } = updateProgramManagementDto;
    const updateData: any = { ...rest };

    if (program_type) {
      updateData.program_type = program_type.toLowerCase() as any;
    }

    if (status) {
      updateData.status = status.toLowerCase() as programs_status;
    }

    // Handle academic_year_id if provided
    if (academic_year_id !== undefined) {
      // Verify the new academic year exists
      const academicYear = await this.prisma.academic_years.findUnique({
        where: { id: academic_year_id },
      });

      if (!academicYear) {
        throw new NotFoundException(`Academic year with ID ${academic_year_id} not found`);
      }

      updateData.academic_year_id = academic_year_id;
    }

    return this.prisma.programs.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number) {
    // Check if program exists
    await this.findOne(id);

    return this.prisma.programs.delete({
      where: { id },
    });
  }
}
