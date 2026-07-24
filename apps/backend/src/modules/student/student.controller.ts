import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Public()
  @Get('student/list')
  list(@Query('dormId') dormId: string) {
    return this.studentService.list(+dormId);
  }

  @Post('student/add')
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Put('student/update')
  update(@Body() dto: UpdateStudentDto) {
    return this.studentService.update(dto);
  }

  @Delete('student/:id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
