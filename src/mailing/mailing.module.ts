import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  controllers: [MailingController, PrismaModule],
})
export class MailingModule {}
