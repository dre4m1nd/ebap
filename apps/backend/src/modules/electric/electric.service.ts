import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ElectricLog } from './entities/electric-log.entity';
import { QueryElectricLogDto } from './dto/query-electric-log.dto';
import { QueryElectricChartDto } from './dto/query-electric-chart.dto';

@Injectable()
export class ElectricService {
  constructor(
    @InjectRepository(ElectricLog)
    private electricRepo: Repository<ElectricLog>,
  ) {}

  async page(query: QueryElectricLogDto) {
    const { dormId, type, pageNum, pageSize, startTime, endTime } = query;
    const where: any = { dormId, meterType: type };
    if (startTime && endTime) {
      where.queryTime = Between(new Date(startTime), new Date(endTime));
    } else if (startTime) {
      where.queryTime = MoreThanOrEqual(new Date(startTime));
    } else if (endTime) {
      where.queryTime = LessThanOrEqual(new Date(endTime));
    }

    const [records, total] = await this.electricRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { queryTime: 'DESC' },
    });

    return {
      records,
      total,
      size: pageSize,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
    };
  }

  async chart(query: QueryElectricChartDto) {
    const { dormId, type, timeRange } = query;

    let hours: number;
    switch (timeRange) {
      case '24h': hours = 24; break;
      case '7d': hours = 168; break;
      case '30d': hours = 720; break;
      default: hours = 24;
    }

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const records = await this.electricRepo.find({
      where: {
        dormId,
        meterType: type,
        queryTime: MoreThanOrEqual(since),
      },
      order: { queryTime: 'ASC' },
    });

    return records.map((r) => ({
      leftElectric: r.leftEle.toString(),
      leftMoney: r.leftMoney.toString(),
      time: r.queryTime.toISOString(),
    }));
  }
}