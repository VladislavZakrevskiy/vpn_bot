import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { PrismaModule } from './db/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { session } from 'telegraf';
import { ScheduleModule } from '@nestjs/schedule';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [session()],
    }),
    ScheduleModule.forRoot(),
    BotModule,
    PrismaModule,
    HttpModule.register({
      baseURL: process.env.VPN_URL,
      global: true,
      headers: { 'Hiddify-API-Key': process.env.PROXY_API_TOKEN },
    }),
    SettingsModule,
  ],
  providers: [],
})
export class AppModule {
  constructor() {}
}
