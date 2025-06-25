import { IsInt, IsNotEmpty } from 'class-validator';

export class GetCourseDto {
  @IsInt()
  @IsNotEmpty()
  programId: number;
}
