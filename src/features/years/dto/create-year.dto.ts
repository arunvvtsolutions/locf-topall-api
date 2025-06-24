import { ApiProperty } from '@nestjs/swagger';

export class CreateYearDto {
  @ApiProperty({
    description: 'The name of the year',
    example: '2023-2024',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'The start date of the academic year',
    example: '2023-06-01',
    required: true,
  })
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the academic year',
    example: '2024-05-31',
    required: true,
  })
  endDate: Date;

  @ApiProperty({
    description: 'Whether the year is currently active',
    example: true,
    default: false,
  })
  isActive?: boolean;
}
