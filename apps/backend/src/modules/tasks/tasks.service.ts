import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { MeterType, CommonStatus } from '@ebap/shared';
import { DormService } from '../dorm/dorm.service';
import { StudentService } from '../student/student.service';
import { ElectricFetcherService } from '../electric/electric-fetcher.service';
import { EmailSenderService } from '../email/email-sender.service';
import { ElectricLog } from '../electric/entities/electric-log.entity';
import { EmailLog } from '../email/entities/email-log.entity';
import { Dorm } from '../dorm/entities/dorm.entity';
import { Student } from '../student/entities/student.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly dormService: DormService,
    private readonly studentService: StudentService,
    private readonly electricFetcher: ElectricFetcherService,
    private readonly emailSender: EmailSenderService,
    @InjectRepository(ElectricLog)
    private readonly electricRepo: Repository<ElectricLog>,
    @InjectRepository(EmailLog)
    private readonly emailRepo: Repository<EmailLog>,
  ) {}

  @Cron(process.env.ELECTRIC_FETCH_CRON || '0 * * * *')
  async handleElectricFetch() {
    this.logger.log('开始定时电费查询任务');

    const dorms = await this.dormService.list();
    const activeDorms = (dorms as Dorm[]).filter(
      (d) => d.status === CommonStatus.ACTIVE && d.openId,
    );
    if (activeDorms.length === 0) {
      this.logger.log('没有可查询的活跃宿舍');
      return;
    }

    for (const dorm of activeDorms) {
      await this.processDorm(dorm).catch((error) => {
        this.logger.error(`宿舍 ${dorm.dormNo} 处理异常: ${error.message}`);
      });
    }

    this.logger.log('定时电费查询任务结束');
  }

  private async processDorm(dorm: Dorm) {
    for (const meterType of [MeterType.LIGHT, MeterType.AIR]) {
      if (await this.shouldSkipElectric(dorm.id, meterType)) {
        continue;
      }

      const log = await this.electricFetcher.fetchAndStore(dorm, meterType);
      if (!log) continue;

      await this.checkAndAlert(dorm, log, meterType);
    }
  }

  private async shouldSkipElectric(
    dormId: number,
    meterType: MeterType,
  ): Promise<boolean> {
    const recent = await this.electricRepo.findOne({
      where: {
        dormId,
        meterType,
        queryTime: MoreThanOrEqual(
          new Date(Date.now() - 55 * 60 * 1000),
        ),
      },
    });
    return !!recent;
  }

  private async checkAndAlert(
    dorm: Dorm,
    log: ElectricLog,
    meterType: MeterType,
  ) {
    const threshold =
      meterType === MeterType.AIR ? dorm.limitAir : dorm.limitLight;
    if (!threshold || Number(threshold) === 0) return;

    const leftValue = Number(log.leftEle);
    if (leftValue >= Number(threshold)) return;

    const typeLabel = meterType === MeterType.AIR ? '空调' : '照明';
    this.logger.log(
      `${dorm.dormNo} ${typeLabel} 低于阈值 (剩余=${leftValue}, 阈值=${threshold})`,
    );

    const students = await this.studentService.list(dorm.id) as Student[];
    const activeStudents = students.filter(
      (s) => s.status === CommonStatus.ACTIVE,
    );

    for (const student of activeStudents) {
      if (await this.shouldSkipAlert(student.id, dorm.id, meterType)) {
        continue;
      }

      await this.emailSender.sendWarning(
        student,
        dorm,
        meterType,
        String(leftValue),
        Number(threshold),
      );
    }
  }

  private async shouldSkipAlert(
    studentId: number,
    dormId: number,
    meterType: MeterType,
  ): Promise<boolean> {
    const recent = await this.emailRepo.findOne({
      where: {
        studentId,
        dormId,
        meterType,
        status: CommonStatus.ACTIVE,
        sendTime: MoreThanOrEqual(
          new Date(Date.now() - 24 * 60 * 60 * 1000),
        ),
      },
    });
    return !!recent;
  }
}
