import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Syllabus')
export class Syllabus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  program_id: number;

  @Column()
  code: string;

  @Column()
  description: string;

  @Column()
  programId: number;
}


