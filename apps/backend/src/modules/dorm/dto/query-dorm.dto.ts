import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDormDto {
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
  dormNo?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  status?: number;
}