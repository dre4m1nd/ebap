import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    list(dormId: string): Promise<import("./entities/student.entity").Student[]>;
    create(dto: CreateStudentDto): Promise<import("./entities/student.entity").Student>;
    update(dto: UpdateStudentDto): Promise<import("./entities/student.entity").Student | null>;
    remove(id: string): Promise<void>;
}
