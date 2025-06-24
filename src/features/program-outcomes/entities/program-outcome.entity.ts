import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('program_outcomes')
export class ProgramOutcome {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  program_id: number;

  @Column()
  code: string;

  @Column()
  description: string;
}

