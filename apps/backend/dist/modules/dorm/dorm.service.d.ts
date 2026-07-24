import { Repository } from 'typeorm';
import { Dorm } from './entities/dorm.entity';
import { CreateDormDto } from './dto/create-dorm.dto';
import { UpdateDormDto } from './dto/update-dorm.dto';
import { QueryDormDto } from './dto/query-dorm.dto';
export declare class DormService {
    private dormRepo;
    constructor(dormRepo: Repository<Dorm>);
    list(): Promise<Dorm[]>;
    page(query: QueryDormDto): Promise<{
        records: Dorm[];
        total: number;
        size: number;
        current: number;
        pages: number;
    }>;
    create(dto: CreateDormDto): Promise<Dorm>;
    update(id: number, dto: UpdateDormDto): Promise<Dorm | null>;
    remove(id: number): Promise<void>;
}
