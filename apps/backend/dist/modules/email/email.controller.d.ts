import { EmailService } from './email.service';
import { QueryEmailLogDto } from './dto/query-email-log.dto';
import { UpdateEmailLogDto } from './dto/update-email-log.dto';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    page(query: QueryEmailLogDto): Promise<{
        records: import("./entities/email-log.entity").EmailLog[];
        total: number;
        size: number;
        current: number;
        pages: number;
    }>;
    update(id: string, dto: UpdateEmailLogDto): Promise<import("./entities/email-log.entity").EmailLog | null>;
}
