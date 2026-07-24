import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ElectricService } from './electric.service';
import { QueryElectricLogDto } from './dto/query-electric-log.dto';
import { QueryElectricChartDto } from './dto/query-electric-chart.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class ElectricController {
  constructor(private readonly electricService: ElectricService) {}

  @Public()
  @Post('electric/list')
  page(@Body() query: QueryElectricLogDto) {
    return this.electricService.page(query);
  }

  @Public()
  @Get('electric/chart')
  chart(@Query() query: QueryElectricChartDto) {
    return this.electricService.chart(query);
  }
}