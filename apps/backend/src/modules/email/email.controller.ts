import { Controller, Post, Put, Body, Param } from '@nestjs/common';
import { EmailService } from './email.service';
import { QueryEmailLogDto } from './dto/query-email-log.dto';
import { UpdateEmailLogDto } from './dto/update-email-log.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post('email/page')
  page(@Body() query: QueryEmailLogDto) {
    return this.emailService.page(query);
  }

  @Put('email/:id')
  update(@Param('id') id: string, @Body() dto: UpdateEmailLogDto) {
    return this.emailService.update(+id, dto);
  }
}