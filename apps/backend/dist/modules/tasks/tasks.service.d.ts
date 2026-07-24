import { Repository } from 'typeorm';
import { DormService } from '../dorm/dorm.service';
import { StudentService } from '../student/student.service';
import { ElectricFetcherService } from '../electric/electric-fetcher.service';
import { EmailSenderService } from '../email/email-sender.service';
import { ElectricLog } from '../electric/entities/electric-log.entity';
import { EmailLog } from '../email/entities/email-log.entity';
export declare class TasksService {
    private readonly dormService;
    private readonly studentService;
    private readonly electricFetcher;
    private readonly emailSender;
    private readonly electricRepo;
    private readonly emailRepo;
    private readonly logger;
    constructor(dormService: DormService, studentService: StudentService, electricFetcher: ElectricFetcherService, emailSender: EmailSenderService, electricRepo: Repository<ElectricLog>, emailRepo: Repository<EmailLog>);
    handleElectricFetch(): Promise<void>;
    private processDorm;
    private shouldSkipElectric;
    private checkAndAlert;
    private shouldSkipAlert;
}
