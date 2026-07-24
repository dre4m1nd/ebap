import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailSenderService } from './email-sender.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailLog])],
  controllers: [EmailController],
  providers: [EmailService, EmailSenderService],
  exports: [EmailService, EmailSenderService],
})
export class EmailModule {}
