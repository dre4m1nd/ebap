import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dorm } from '../../dorm/entities/dorm.entity';

@Entity('electric_log')
export class ElectricLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dormId: number;

  @ManyToOne(() => Dorm)
  @JoinColumn({ name: 'dormId' })
  dorm: Dorm;

  @Column('tinyint')
  meterType: number;

  @Column('decimal', { precision: 10, scale: 2 })
  leftMoney: number;

  @Column('decimal', { precision: 10, scale: 2 })
  leftEle: number;

  @Column({ type: 'datetime' })
  queryTime: Date;
}
