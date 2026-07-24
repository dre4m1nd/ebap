import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dorm } from '../../dorm/entities/dorm.entity';
import { Student } from '../../student/entities/student.entity';

@Entity('email_log')
export class EmailLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dormId: number;

  @ManyToOne(() => Dorm)
  @JoinColumn({ name: 'dormId' })
  dorm: Dorm;

  @Column()
  studentId: number;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column('tinyint', { nullable: true })
  meterType: number;

  @Column('tinyint', { default: 1 })
  status: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'datetime' })
  sendTime: Date;
}
