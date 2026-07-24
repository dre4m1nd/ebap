import { Repository } from 'typeorm';
import { EmailLog } from './entities/email-log.entity';
import { QueryEmailLogDto } from './dto/query-email-log.dto';
import { UpdateEmailLogDto } from './dto/update-email-log.dto';
export declare class EmailService {
    private emailRepo;
    constructor(emailRepo: Repository<EmailLog>);
    page(query: QueryEmailLogDto): Promise<{
        records: EmailLog[];
        total: number;
        size: number;
        current: number;
        pages: number;
    }>;
    update(id: number, dto: UpdateEmailLogDto): Promise<EmailLog | null>;
}
