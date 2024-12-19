import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { SettingsModule } from './settings/settings.module';
import { MailingModule } from './mailing/mailing.module';
import { BotModule } from './bots/bot/bot.module';
import { SupportBotModule } from './bots/support/support.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BotModule,
    SupportBotModule,
    PrismaModule,
    HttpModule.register({
      baseURL: process.env.VPN_URL,
      global: true,
      headers: { 'Hiddify-API-Key': process.env.PROXY_API_TOKEN },
    }),
    SettingsModule,
    MailingModule,
  ],
  providers: [],
})
export class AppModule {
  constructor() {}
}
