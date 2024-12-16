import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Prisma, Settings } from '@prisma/client';
import { SettingsService } from './settings.service';
import { Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

@Controller('settings')
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    @InjectBot() private readonly bot: Telegraf,
  ) {}

  @Get()
  getSettings(): Promise<Settings> {
    return this.settingsService.getSettings();
  }

  @Patch()
  async update(
    @Body() updateSettingDto: Prisma.SettingsUpdateInput,
  ): Promise<Settings> {
    const { admin_command } = updateSettingDto;
    const { admin_command: dbAdminCommand } =
      await this.settingsService.getSettings();
    this.bot.command(
      admin_command.toString() || dbAdminCommand,
      async (ctx) =>
        await ctx.reply('Секретная админ панель', {
          reply_markup: {
            inline_keyboard: [
              [{ web_app: { url: process.env.WEB_APP_URL }, text: 'Перейти' }],
            ],
          },
        }),
    );
    return this.settingsService.update(updateSettingDto);
  }
}
