import { Module } from '@nestjs/common';
import { MessageModule } from 'src/messages/messages.module';
import { TicketModule } from 'src/tickets/tickets.module';
import { UserModule } from 'src/users/users.module';
import { VpnModule } from 'src/vpn/vpn.module';
import { MessageCheckService } from './core/message.check';
import { SupportBotUpdate } from './core/support.update';
import { UserUpdate } from './user/user.update';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  imports: [MessageModule, TicketModule, UserModule, VpnModule, ScheduleModule.forRoot()],
  providers: [MessageCheckService, PrismaService, SupportBotUpdate, UserUpdate],
})
export class SupportBotModule {}
