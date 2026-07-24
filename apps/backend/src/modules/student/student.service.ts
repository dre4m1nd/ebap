import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async list(dormId: number) {
    return this.studentRepo.find({
      where: { dormId },
      order: { createTime: 'DESC' },
    });
  }

  async create(dto: CreateStudentDto) {
    const student = this.studentRepo.create(dto);
    return this.studentRepo.save(student);
  }

  async update(dto: UpdateStudentDto) {
    const { id, ...data } = dto;
    const student = await this.studentRepo.findOneBy({ id });
    if (!student) throw new NotFoundException('学生不存在');
    await this.studentRepo.update(id, data);
    return this.studentRepo.findOneBy({ id });
  }

  async remove(id: number) {
    const student = await this.studentRepo.findOneBy({ id });
    if (!student) throw new NotFoundException('学生不存在');
    await this.studentRepo.delete(id);
  }
}
