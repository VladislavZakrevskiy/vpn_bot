import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { MessageModule } from 'src/messages/messages.module';
import { TicketModule } from 'src/tickets/tickets.module';
import { UserModule } from 'src/users/users.module';
import { VpnModule } from 'src/vpn/vpn.module';
import { session } from 'telegraf';
import { MessageCheckService } from './core/message.check';
import { SupportUpdate } from './core/support.update';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_SUPPORT_BOT_TOKEN,
      middlewares: [session()],
    }),
    MessageModule,
    TicketModule,
    UserModule,
    VpnModule,
  ],
  providers: [MessageCheckService, SupportUpdate],
})
export class SupportBotModule {}
