import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetSyllabusFileDto } from './dto/get-syllabus-file.dto';

@Injectable()
export class SyllabusService {
  constructor(private readonly prisma: PrismaService) { }

  async getSyllabusFile(query: GetSyllabusFileDto) {
    return this.prisma.file_uploads.findMany({
      where: {
        program_id: query.program_id,
        organization_id: query.organization_id,
      },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        file_path: true,
        file_size: true,
        original_filename: true,
        program_id: true,
        stored_filename: true,
        processing_status: true,
        created_at: true,
        updated_at: true,
        uploader_id: true,
        organization_id: true,
      },
    });
  }

  async getFileProcessingStatus(id: number) {
    const file = await this.prisma.file_uploads.findUnique({
      where: { id },
      select: { processing_results: true },
    });
    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }
    return file;
  }

  async getCoursesByProgramId(programId: number) {
    const programWithCourses = await this.prisma.programs.findUnique({
      where: {
        id: programId,
      },
      include: {
        courses: {
          select: {
            id: true,
            code: true,
            name: true,
            description: true,
            course_type: true,
            credits: true,
            practical_hours: true,
            theory_hours: true,
            syllabus_file_url: true,
          },
        },
      },
    });
    if (!programWithCourses) {
      return [];
    }
    return programWithCourses.courses;
  }
}
