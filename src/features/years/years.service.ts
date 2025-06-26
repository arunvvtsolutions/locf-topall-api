import { Injectable } from '@nestjs/common';
import { CreateYearDto } from './dto/create-year.dto';
import { UpdateYearDto } from './dto/update-year.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class YearsService {
  constructor(private prisma: PrismaService) {}
  create(createYearDto: CreateYearDto) {
    return 'This action adds a new year';
  }

  async findAll() {   
    try {
      const years = await this.prisma.years.findMany({
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          years: true,
        },
      });

      const resModel = years.map((year) => {
        return{
          id: year.id,
          createdAt: year.created_at,
          updatedAt: year.updated_at,
          year: year.years,
        }
      })
      return resModel;
    } catch (error) {
      console.error('Error fetching years:', error);
      throw new Error('Failed to fetch years');
    }
  };

  findOne(id: number) {
    return `This action returns a #${id} year`;
  }

  update(id: number, updateYearDto: UpdateYearDto) {
    return `This action updates a #${id} year`;
  }

  remove(id: number) {
    return `This action removes a #${id} year`;
  }
}
