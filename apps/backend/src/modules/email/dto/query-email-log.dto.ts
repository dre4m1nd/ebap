import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryEmailLogDto {
  @Type(() => Number)
  @IsNumber()
  pageNum: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  dormId?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  studentId?: number;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;
}