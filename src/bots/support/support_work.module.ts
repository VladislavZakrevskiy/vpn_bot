import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MessageModule } from 'src/messages/messages.module';
import { TicketModule } from 'src/tickets/tickets.module';
import { UserModule } from 'src/users/users.module';
import { VpnModule } from 'src/vpn/vpn.module';
import { SupportUpdate } from './supporter/support.update';
import { PrismaService } from 'src/db/prisma.service';
import { SupportWorkBot } from './core/support_work.update';

@Module({
  imports: [MessageModule, TicketModule, UserModule, VpnModule, ScheduleModule.forRoot()],
  providers: [SupportWorkBot, SupportUpdate, PrismaService],
})
export class SupportWorkModule {}
