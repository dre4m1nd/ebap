import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query,
} from '@nestjs/common';
import { DormService } from './dorm.service';
import { CreateDormDto } from './dto/create-dorm.dto';
import { UpdateDormDto } from './dto/update-dorm.dto';
import { QueryDormDto } from './dto/query-dorm.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class DormController {
  constructor(private readonly dormService: DormService) {}

  @Public()
  @Get('dorm/list')
  list() {
    return this.dormService.list();
  }

  @Public()
  @Get('dorm/page')
  page(@Query() query: QueryDormDto) {
    return this.dormService.page(query);
  }

  @Post('dorm/add')
  create(@Body() dto: CreateDormDto) {
    return this.dormService.create(dto);
  }

  @Put('dorm/:id')
  update(@Param('id') id: string, @Body() dto: UpdateDormDto) {
    return this.dormService.update(+id, dto);
  }

  @Delete('dorm/:id')
  remove(@Param('id') id: string) {
    return this.dormService.remove(+id);
  }
}