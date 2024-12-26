import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { SettingsModule } from './settings/settings.module';
import { MailingModule } from './mailing/mailing.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { SupportBotModule } from './bots/support/support.module';
import { BotModule } from './bots/bot/bot.module';
import { TagsModule } from './tags/tags.module';
import { SupportWorkModule } from './bots/support/support_work.module';

@Module({
  imports: [
    // Support TG Bot
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_SUPPORT_BOT_TOKEN,
      middlewares: [session()],
      botName: 'support',
      include: [SupportBotModule],
    }),
    SupportBotModule,
    // Main TG Bot
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [session()],
      include: [BotModule],
      botName: 'main',
    }),
    BotModule,
    // Support Work Bot
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_SUPPORT_WORK_BOT_TOKEN,
      middlewares: [session()],
      include: [SupportWorkModule],
      botName: 'support_work',
    }),
    SupportWorkModule,
    // Other
    HttpModule.register({
      baseURL: process.env.VPN_URL,
      global: true,
      headers: { 'Hiddify-API-Key': process.env.PROXY_API_TOKEN },
    }),
    PrismaModule,
    SettingsModule,
    MailingModule,
    TagsModule,
  ],
  providers: [],
})
export class AppModule {
  constructor() {}
}
