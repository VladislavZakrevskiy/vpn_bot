import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Prisma, Settings } from '@prisma/client';
import { SettingsService } from './settings.service';
import { Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Controller('settings')
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    @InjectBot('main') private readonly bot: Telegraf,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getSettings() {
    const { admin_command, ...settings } = await this.settingsService.getSettings();
    return {
      ...settings,
      admin_command: admin_command[admin_command.length - 1],
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(
    @Body()
    updateSettingDto: Prisma.SettingsUpdateInput & { admin_command: string },
  ): Promise<Settings> {
    const { admin_command, ...updatedSettings } = await this.settingsService.update({
      ...updateSettingDto,
      admin_command: { push: updateSettingDto.admin_command },
    });
    this.bot.command(
      admin_command,
      async (ctx, next) => {
        const { admin_command } = await this.settingsService.getSettings();
        if (ctx.text === '/' + admin_command[admin_command.length - 1]) {
          await next();
        }
      },
      async (ctx) =>
        await ctx.reply('Секретная админ панель', {
          reply_markup: {
            inline_keyboard: [[{ web_app: { url: process.env.WEB_APP_URL }, text: 'Перейти' }]],
          },
        }),
    );
    return { ...updatedSettings, admin_command };
  }
}
