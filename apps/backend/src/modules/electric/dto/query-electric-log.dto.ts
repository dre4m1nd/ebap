import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryElectricLogDto {
  @Type(() => Number)
  @IsNumber()
  dormId: number;

  @Type(() => Number)
  @IsNumber()
  type: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageNum: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;
}