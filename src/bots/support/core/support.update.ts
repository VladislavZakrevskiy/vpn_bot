import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bots/bot/core/types/Context';
import { UserService } from '../../../users/user/users.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { Role } from '@prisma/client';
import { Telegraf } from 'telegraf';
import { PrismaService } from 'src/db/prisma.service';

@Update()
export class SupportBotUpdate {
  constructor(
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
    @InjectBot('support') private readonly bot: Telegraf,
    private prisma: PrismaService,
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
        name: vpnBot.name,
        is_active: false,
        vpn_uuid: vpnBot.uuid,
      });
    }

    const settings = await this.prisma.settings.findFirst({});

    switch (user.role) {
      case Role.USER:
      case Role.ADMIN:
        await ctx.replyWithMarkdownV2(settings.tp_hello_message);
        // Здравствуйте, какая у вас возникла проблема?
        break;
    }
  }
}
