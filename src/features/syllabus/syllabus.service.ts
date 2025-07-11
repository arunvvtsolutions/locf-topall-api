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
        description: programWithCourses.description,
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

      return resModal;
    } catch (error) {
      console.error('Error fetching program with courses:', error);
      throw new Error('Could not fetch program with courses');
    }
  }

  async getCourseOutcomesByCourseId(courseId: number) {
    try {
      const courseOutcomes = await this.prisma.course_outcomes.findMany({
        where: {
          course_id: courseId,
        },
        select: {
          id: true,
          co_number: true,
          content: true,
        },
      });
      const resModel = courseOutcomes.map(data => ({
        id: data.id,
        code: data.co_number,
        description: data.content,
        courseId: courseId,
      }));
      return resModel;
    } catch (error) {
      console.error('Error fetching course outcomes:', error);
      throw new Error('Could not fetch course outcomes');
    }
  }

  async getCOPOMappingsByCourseId(courseId: number) {
    try {
      // Step 1: Fetch CO-PO mappings for the given course
      const coPoData = await this.prisma.co_po_mappings.findMany({
        where: {
          course_id: courseId,
        },
        select: {
          id: true,
          course_id: true,
          co_label: true,
          po_label: true,
          value: true,
        },
      });

      // ✅ Extract all unique co_labels
      const uniqueCoLabels = [...new Set(coPoData.map(mapping => mapping.co_label))];

      // Step 2: Fetch all program outcomes (for matching po_label)
      const allProgramOutcomes = await this.prisma.program_outcomes.findMany({
        select: {
          code: true,
          description: true,
          program_id: true,
        },
      });

      // ✅ Step 3: Fetch course_outcomes based on co_number IN [co_label list]
      const courseOutcomes = await this.prisma.course_outcomes.findMany({
        where: {
          co_number: {
            in: uniqueCoLabels,
          },
        },
        select: {
          co_number: true,
          content: true,
        },
      });

      // Step 4: Enrich the co_po_mappings with both program_outcome and course_outcome
      const enrichedData = coPoData.map(mapping => {
        const matchedPO = allProgramOutcomes.find(po => po.code === mapping.po_label);
        const matchedCO = courseOutcomes.find(co => co.co_number === mapping.co_label);

        return {
          ...mapping,
          program_outcome_description: matchedPO?.description || null,
          course_outcome_content: matchedCO?.content || null,
        };
      });

      return enrichedData;
    } catch (error) {
      console.error('Error fetching CO-PO mappings:', error);
      throw new Error('Could not fetch CO-PO mappings');
    }
  }
}
