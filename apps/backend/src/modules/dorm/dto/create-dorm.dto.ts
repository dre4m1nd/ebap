import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateDormDto {
  @IsString()
  dormNo: string;

  @IsString()
  openId: string;

  @IsNumber()
  @Min(0)
  limitLight: number;

  @IsNumber()
  @Min(0)
  limitAir: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  status?: number;
}