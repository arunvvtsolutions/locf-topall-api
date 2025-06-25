import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GetSyllabusFileDto } from './dto/get-syllabus-file.dto';

@Injectable()
export class SyllabusService {
  constructor(private readonly prisma: PrismaService) {}

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
    try {
      const programWithCourses = await this.prisma.programs.findUnique({
        where: {
          id: programId,
        },
        select: {
          organization_id: true,
          description: true,
          created_at: true,
          updated_at: true,
          code: true,
          courses: {
            select: {
              id: true,
              code: true,
              program_id: true,
              subjects: {
                select: {
                  s_name: true,
                },
              },
              course_type: true,
              credits: true,
              syllabus_file_url: true,
            },
          },
        },
      });
      const resModal = programWithCourses?.courses.map(course => ({
        id: course.id,
        program_id: course.program_id,
        organization_id: programWithCourses.organization_id,
        name: course.subjects.s_name,
        code: course.code,
        description : programWithCourses.description,
        credits: course.credits,
        // subjects: course.subjects,
        course_type: course.course_type,
        syllabus_file_url: course.syllabus_file_url,
        created_at: programWithCourses.created_at,
        updated_at: programWithCourses.updated_at,
      }));
      if (!programWithCourses) {
        return [];
      }
      console.log('Program with courses:', programWithCourses);

      return resModal;
    } catch (error) {
      console.error('Error fetching program with courses:', error);
      throw new Error('Could not fetch program with courses');
    }
  }

  async getCourseOutcomesByCourseId(courseId: number) {
    try {
      const courseOutcomes = await this.prisma.courses.findMany({
        where: {
          id: courseId,
        },
        select: {
          id: true,
          code: true,
          program_id: true,
          credits: true,
         
        }
      });
      console.log('courseOutcomes', courseOutcomes);
      return courseOutcomes;
    } catch (error) {
      console.error('Error fetching course outcomes:', error);
      throw new Error('Could not fetch course outcomes');
    }
  }

  async getCOPOMappingsByCourseId(courseId: number) {
    return this.prisma.co_po_mappings.findMany({
      where: {
        course_id: courseId,
      },
      include: {
        // co_po_mapping_data: true,
      },
    });
  }
}
