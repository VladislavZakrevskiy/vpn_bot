import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [MailingController],
  providers: [PrismaService],
})
export class MailingModule {}
