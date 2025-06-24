import { ApiProperty } from '@nestjs/swagger';

export class AcademicYear {
  @ApiProperty({ description: 'The unique identifier of the academic year' })
  id: number;

  @ApiProperty({ description: 'The unique identifier of the academic year' })
  year_id: number;

  @ApiProperty({ description: 'Indicates if the academic year is currently active', required: false })
  is_active: boolean | null;

  @ApiProperty({ description: 'The date and time when the record was created', required: false })
  created_at: Date | null;

  @ApiProperty({ description: 'The date and time when the record was last updated', required: false })
  updated_at: Date | null;

}
