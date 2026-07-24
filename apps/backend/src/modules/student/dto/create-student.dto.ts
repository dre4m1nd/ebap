import { IsString, IsNumber, IsOptional, Min, Max, IsEmail } from 'class-validator';

export class CreateStudentDto {
  @IsNumber()
  dormId: number;

  @IsString()
  nickName: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(1)
  status?: number;
}
