import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { PrismaModule } from './db/prisma.module';

@Module({
  imports: [
    TelegrafModule.forRoot({ token: process.env.TELEGRAM_BOT_TOKEN }),
    BotModule,
    PrismaModule,
  ],
  providers: [],
})
export class AppModule {}
