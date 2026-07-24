import { Dorm } from '../../dorm/entities/dorm.entity';
import { Student } from '../../student/entities/student.entity';
export declare class EmailLog {
    id: number;
    dormId: number;
    dorm: Dorm;
    studentId: number;
    student: Student;
    meterType: number;
    status: number;
    content: string;
    sendTime: Date;
}
