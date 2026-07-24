import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { EmailLog } from './entities/email-log.entity';
import { QueryEmailLogDto } from './dto/query-email-log.dto';
import { UpdateEmailLogDto } from './dto/update-email-log.dto';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailLog)
    private emailRepo: Repository<EmailLog>,
  ) {}

  async page(query: QueryEmailLogDto) {
    const { pageNum, pageSize, dormId, studentId, startTime, endTime } = query;
    const where: any = {};
    if (dormId) where.dormId = dormId;
    if (studentId) where.studentId = studentId;
    if (startTime && endTime) {
      where.sendTime = Between(new Date(startTime), new Date(endTime));
    } else if (startTime) {
      where.sendTime = MoreThanOrEqual(new Date(startTime));
    } else if (endTime) {
      where.sendTime = LessThanOrEqual(new Date(endTime));
    }

    const [records, total] = await this.emailRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { sendTime: 'DESC' },
    });

    return {
      records,
      total,
      size: pageSize,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
    };
  }

  async update(id: number, dto: UpdateEmailLogDto) {
    const log = await this.emailRepo.findOneBy({ id });
    if (!log) throw new NotFoundException('邮件记录不存在');
    await this.emailRepo.update(id, dto);
    return this.emailRepo.findOneBy({ id });
  }
}