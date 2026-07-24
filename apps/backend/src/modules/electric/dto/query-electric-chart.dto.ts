import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryElectricChartDto {
  @Type(() => Number)
  @IsNumber()
  dormId: number;

  @Type(() => Number)
  @IsNumber()
  type: number;

  @IsString()
  timeRange: string;
}