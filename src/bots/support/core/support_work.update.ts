import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bots/bot/core/types/Context';
import { UserService } from 'src/users/user/users.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { getSupportText } from './texts/getSupportText';
import { Role } from '@prisma/client';
import { getHelpText } from './texts/getHelpText';

@Update()
export class SupportWorkBot {
  constructor(
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
  ) {}

  @Command('help')
  async help(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({ tg_id: ctx.from.id.toString() });
    if (user.role !== 'SUPPORT') {
      return;
    }

    await ctx.replyWithHTML(getHelpText());
  }

  @Start()
  async start(@Ctx() ctx: SessionSceneContext) {
    let user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });

    if (!user) {
      const vpnBot = await this.vpnAdminService.createUser({
        lang: ctx.from.language_code || 'ru',
        name: [ctx.from.username, ctx.from.id].join(' '),
        package_days: 0,
        usage_limit_GB: 0,
        telegram_id: ctx.from.id,
      });
      user = await this.userService.createUser({
        tg_id: ctx.from.id.toString(),
        name: vpnBot.name,
        is_active: false,
        vpn_uuid: vpnBot.uuid,
      });
    }

    switch (user.role) {
      case Role.SUPPORT:
        await ctx.replyWithMarkdownV2(getSupportText());
        break;
    }
  }
}
