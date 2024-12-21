import { Body, Controller, Post } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { PrismaService } from 'src/db/prisma.service';
import { Telegraf } from 'telegraf';

@Controller('mailing')
export class MailingController {
  constructor(
    private prisma: PrismaService,
    @InjectBot('main') private bot: Telegraf,
  ) {}

  @Post('')
  async sendMessagers(@Body() body: { msg: string; ids: string[] }) {
    const { ids, msg } = body;

    if (ids.find((val) => val === 'all_users')) {
      const users = await this.prisma.user.findMany({});
      for (const user of users) {
        try {
          await this.bot.telegram.sendMessage(user.tg_id, msg);
        } catch (e) {
          console.log(e);
        }
      }
      return;
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
    });
    for (const user of users) {
      try {
        await this.bot.telegram.sendMessage(user.tg_id, msg);
      } catch (e) {
        console.log(e);
      }
    }

    return { msg: 'success' };
  }
}
