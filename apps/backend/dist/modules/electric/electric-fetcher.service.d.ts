import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { MeterType } from '@ebap/shared';
import { ElectricLog } from './entities/electric-log.entity';
import { Dorm } from '../dorm/entities/dorm.entity';
export declare class ElectricFetcherService {
    private readonly electricRepo;
    private readonly httpService;
    private readonly dormRepo;
    private readonly logger;
    constructor(electricRepo: Repository<ElectricLog>, httpService: HttpService, dormRepo: Repository<Dorm>);
    fetchAndStore(dorm: Dorm, meterType: MeterType): Promise<ElectricLog | null>;
}
