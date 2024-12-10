import { Ctx, Start, Update } from 'nestjs-telegraf';
import { getStartText } from './texts/getStartText';
import { TgUser } from './decorators/TgUser';
import { TelegramUser } from './types/TelegramUser';
import { UserService } from 'src/users/users.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { RateUpdate } from '../rate/rate.update';
import { SessionSceneContext } from './types/Context';

@Update()
export class BotCoreUpdate {
  constructor(
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
    private rateUpdate: RateUpdate,
  ) {}

  @Start()
  async start(@Ctx() ctx: SessionSceneContext, @TgUser() user: TelegramUser) {
    const dbUser = await this.userService.getUserByQuery({
      tg_id: user.id.toString(),
    });
    if (!dbUser) {
      const vpnBot = await this.vpnAdminService.createUser({
        lang: user.language_code || 'ru',
        name: [user.first_name, user.last_name, user.username].join(' '),
      });
      await this.userService.createUser({
        first_name: user.first_name,
        last_name: user.last_name,
        tg_id: user.id.toString(),
        username: user.username,
        is_active: false,
        vpn_uuid: vpnBot.uuid,
      });
    }
    await ctx.replyWithMarkdownV2(getStartText());
    await this.rateUpdate.handleRateList(ctx);
  }
}
