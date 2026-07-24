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
    const path =
      meterType === MeterType.AIR ? config.airPath : config.lightPath;
    const url = `${config.baseUrl}${path}`.replace('{openId}', dorm.openId);

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, { timeout: config.timeout }),
      );

      const electricLog = this.electricRepo.create({
        dormId: dorm.id,
        meterType,
        leftMoney: data.leftMoney ?? data.money ?? 0,
        leftEle: data.leftEle ?? data.ele ?? data.electric ?? 0,
        queryTime: data.queryTime ? new Date(data.queryTime) : new Date(),
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
