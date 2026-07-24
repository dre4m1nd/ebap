import { DormService } from './dorm.service';
import { CreateDormDto } from './dto/create-dorm.dto';
import { UpdateDormDto } from './dto/update-dorm.dto';
import { QueryDormDto } from './dto/query-dorm.dto';
export declare class DormController {
    private readonly dormService;
    constructor(dormService: DormService);
    list(): Promise<import("./entities/dorm.entity").Dorm[]>;
    page(query: QueryDormDto): Promise<{
        records: import("./entities/dorm.entity").Dorm[];
        total: number;
        size: number;
        current: number;
        pages: number;
    }>;
    create(dto: CreateDormDto): Promise<import("./entities/dorm.entity").Dorm>;
    update(id: string, dto: UpdateDormDto): Promise<import("./entities/dorm.entity").Dorm | null>;
    remove(id: string): Promise<void>;
}
