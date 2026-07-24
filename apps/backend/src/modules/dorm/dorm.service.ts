import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Dorm } from './entities/dorm.entity';
import { CreateDormDto } from './dto/create-dorm.dto';
import { UpdateDormDto } from './dto/update-dorm.dto';
import { QueryDormDto } from './dto/query-dorm.dto';

@Injectable()
export class DormService {
  constructor(
    @InjectRepository(Dorm)
    private dormRepo: Repository<Dorm>,
  ) {}

  async list() {
    return this.dormRepo.find({ order: { dormNo: 'ASC' } });
  }

  async page(query: QueryDormDto) {
    const { pageNum, pageSize, dormNo, status } = query;
    const where: any = {};
    if (dormNo) where.dormNo = Like(`%${dormNo}%`);
    if (status !== undefined) where.status = status;

    const [records, total] = await this.dormRepo.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { updateTime: 'DESC' },
    });

    return {
      records,
      total,
      size: pageSize,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
    };
  }

  async create(dto: CreateDormDto) {
    const dorm = this.dormRepo.create(dto);
    return this.dormRepo.save(dorm);
  }

  async update(id: number, dto: UpdateDormDto) {
    const dorm = await this.dormRepo.findOneBy({ id });
    if (!dorm) throw new NotFoundException('宿舍不存在');
    await this.dormRepo.update(id, dto);
    return this.dormRepo.findOneBy({ id });
  }

  async remove(id: number) {
    const dorm = await this.dormRepo.findOneBy({ id });
    if (!dorm) throw new NotFoundException('宿舍不存在');
    await this.dormRepo.delete(id);
  }
}