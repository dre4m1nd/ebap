import { Repository } from 'typeorm';
import { ElectricLog } from './entities/electric-log.entity';
import { QueryElectricLogDto } from './dto/query-electric-log.dto';
import { QueryElectricChartDto } from './dto/query-electric-chart.dto';
export declare class ElectricService {
    private electricRepo;
    constructor(electricRepo: Repository<ElectricLog>);
    page(query: QueryElectricLogDto): Promise<{
        records: ElectricLog[];
        total: number;
        size: number;
        current: number;
        pages: number;
    }>;
    chart(query: QueryElectricChartDto): Promise<{
        leftElectric: string;
        leftMoney: string;
        time: string;
    }[]>;
}
