import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentService {
    private studentRepo;
    constructor(studentRepo: Repository<Student>);
    list(dormId: number): Promise<Student[]>;
    create(dto: CreateStudentDto): Promise<Student>;
    update(dto: UpdateStudentDto): Promise<Student | null>;
    remove(id: number): Promise<void>;
}
