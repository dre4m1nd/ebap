import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dorm } from '../../dorm/entities/dorm.entity';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dormId: number;

  @ManyToOne(() => Dorm)
  @JoinColumn({ name: 'dormId' })
  dorm: Dorm;

  @Column({ length: 100 })
  nickName: string;

  @Column({ length: 255 })
  email: string;

  @Column('tinyint', { default: 1 })
  status: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
