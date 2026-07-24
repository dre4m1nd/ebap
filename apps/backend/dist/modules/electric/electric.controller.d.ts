import { ElectricService } from './electric.service';
import { QueryElectricLogDto } from './dto/query-electric-log.dto';
import { QueryElectricChartDto } from './dto/query-electric-chart.dto';
export declare class ElectricController {
    private readonly electricService;
    constructor(electricService: ElectricService);
    page(query: QueryElectricLogDto): Promise<{
        records: import("./entities/electric-log.entity").ElectricLog[];
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
