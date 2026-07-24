import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ElectricLog } from './entities/electric-log.entity';
import { Dorm } from '../dorm/entities/dorm.entity';
import { ElectricController } from './electric.controller';
import { ElectricService } from './electric.service';
import { ElectricFetcherService } from './electric-fetcher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElectricLog, Dorm]),
    HttpModule,
  ],
  controllers: [ElectricController],
  providers: [ElectricService, ElectricFetcherService],
  exports: [ElectricService, ElectricFetcherService],
})
export class ElectricModule {}