import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { DormModule } from '../dorm/dorm.module';
import { StudentModule } from '../student/student.module';
import { ElectricModule } from '../electric/electric.module';
import { EmailModule } from '../email/email.module';
import { ElectricLog } from '../electric/entities/electric-log.entity';
import { EmailLog } from '../email/entities/email-log.entity';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ElectricLog, EmailLog]),
    DormModule,
    StudentModule,
    ElectricModule,
    EmailModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
