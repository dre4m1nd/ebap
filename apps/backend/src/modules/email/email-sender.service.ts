import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { MeterType, CommonStatus } from '@ebap/shared';
import mailConfig from '../../config/mail.config';
import { EmailLog } from './entities/email-log.entity';
import { Student } from '../student/entities/student.entity';
import { Dorm } from '../dorm/entities/dorm.entity';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  constructor(
    @InjectRepository(EmailLog)
    private readonly emailRepo: Repository<EmailLog>,
  ) {}

  async sendWarning(
    student: Student,
    dorm: Dorm,
    meterType: MeterType,
    leftValue: string,
    threshold: number,
  ): Promise<EmailLog | null> {
    try {
      const config = mailConfig();

      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.port === 465,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

      const typeLabel = meterType === MeterType.AIR ? '空调' : '照明';
      const subject = `【电费预警】${dorm.dormNo} 宿舍剩余电量不足`;
      const content = `${dorm.dormNo} 宿舍的${typeLabel}剩余电量已低于预警阈值：\n\n剩余电量：${leftValue} 度\n预警阈值：${threshold} 度\n\n请及时充值！`;

      await transporter.sendMail({
        from: config.from,
        to: student.email,
        subject,
        text: content,
      });

      const emailLog = this.emailRepo.create({
        dormId: dorm.id,
        studentId: student.id,
        meterType,
        status: CommonStatus.ACTIVE,
        content,
        sendTime: new Date(),
      });

      return this.emailRepo.save(emailLog);
    } catch (error) {
      this.logger.error(
        `发送告警邮件失败 (student=${student.id}, dorm=${dorm.dormNo}): ${error.message}`,
      );

      const emailLog = this.emailRepo.create({
        dormId: dorm.id,
        studentId: student.id,
        meterType,
        status: CommonStatus.DISABLED,
        content: error.message,
        sendTime: new Date(),
      });

      return this.emailRepo.save(emailLog);
    }
  }
}
