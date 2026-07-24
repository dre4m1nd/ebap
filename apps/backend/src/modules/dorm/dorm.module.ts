import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dorm } from './entities/dorm.entity';
import { DormController } from './dorm.controller';
import { DormService } from './dorm.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dorm])],
  controllers: [DormController],
  providers: [DormService],
  exports: [DormService],
})
export class DormModule {}