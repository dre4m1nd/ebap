import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MeterType } from '@ebap/shared';
import apiConfig from '../../config/api.config';
import { ElectricLog } from './entities/electric-log.entity';
import { Dorm } from '../dorm/entities/dorm.entity';

@Injectable()
export class ElectricFetcherService {
  private readonly logger = new Logger(ElectricFetcherService.name);

  constructor(
    @InjectRepository(ElectricLog)
    private readonly electricRepo: Repository<ElectricLog>,
    private readonly httpService: HttpService,
    @InjectRepository(Dorm)
    private readonly dormRepo: Repository<Dorm>,
  ) {}

  async fetchAndStore(
    dorm: Dorm,
    meterType: MeterType,
  ): Promise<ElectricLog | null> {
    const config = apiConfig();
    const url = `${config.baseUrl}?openId=${dorm.openId}&type=${meterType}`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, { timeout: config.timeout }),
      );

      const result = data.resultObject ?? data;

      const electricLog = this.electricRepo.create({
        dormId: dorm.id,
        meterType,
        leftMoney: parseFloat(result.leftMoney) || 0,
        leftEle: parseFloat(result.leftEle) || 0,
        queryTime: result.monTime ? new Date(result.monTime) : new Date(),
      });

      return this.electricRepo.save(electricLog);
    } catch (error) {
      this.logger.error(
        `查询宿舍 ${dorm.dormNo} 电费失败 (meterType=${meterType}): ${error.message}`,
      );
      return null;
    }
  }
}
