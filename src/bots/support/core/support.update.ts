import { Ctx, Start, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bots/bot/core/types/Context';
import { UserService } from '../../../users/user/users.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { Role } from '@prisma/client';
import { getSupportText } from './texts/getSupportText';

@Update()
export class SupportUpdate {
  constructor(
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
  ) {}

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
        is_active: false,
        vpn_uuid: vpnBot.uuid,
      });
    }

    switch (user.role) {
      case Role.SUPPORT:
        await ctx.replyWithMarkdownV2(getSupportText());
        break;

      case Role.USER:
      case Role.ADMIN:
        await ctx.replyWithMarkdownV2(`Здравствуйте, что вас беспокоит?`);
        break;
    }
  }
}
