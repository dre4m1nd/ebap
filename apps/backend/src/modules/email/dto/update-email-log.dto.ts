import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEmailLogDto {
  @IsNumber()
  @IsOptional()
  studentId?: number;

  @IsString()
  @IsOptional()
  sendTime?: string;
}