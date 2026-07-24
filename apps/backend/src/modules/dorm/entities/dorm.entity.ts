import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('dorm')
export class Dorm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  dormNo: string;

  @Column({ length: 255 })
  openId: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  limitLight: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  limitAir: number;

  @Column('tinyint', { default: 1 })
  status: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
