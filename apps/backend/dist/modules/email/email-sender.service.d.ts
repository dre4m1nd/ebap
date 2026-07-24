import { Repository } from 'typeorm';
import { MeterType } from '@ebap/shared';
import { EmailLog } from './entities/email-log.entity';
import { Student } from '../student/entities/student.entity';
import { Dorm } from '../dorm/entities/dorm.entity';
export declare class EmailSenderService {
    private readonly emailRepo;
    private readonly logger;
    constructor(emailRepo: Repository<EmailLog>);
    sendWarning(student: Student, dorm: Dorm, meterType: MeterType, leftValue: string, threshold: number): Promise<EmailLog | null>;
}
