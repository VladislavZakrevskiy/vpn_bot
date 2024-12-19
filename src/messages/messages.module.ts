import { Module } from '@nestjs/common';
import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService],
  exports: [MessageService],
})
export class MessageModule {}
