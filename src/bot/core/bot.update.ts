import { Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { getStartText } from './texts/getStartText';
import { TgUser } from './decorators/TgUser';
import { TelegramUser } from './types/TelegramUser';
import { UserService } from 'src/users/users.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { RateUpdate } from '../rate/rate.update';
import { SessionSceneContext } from './types/Context';
import { Markup } from 'telegraf';
import { getProfile } from './texts/getProfile';

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
        tg_id: user.id.toString(),
        is_active: false,
        vpn_uuid: vpnBot.uuid,
      });
    }
    await ctx.replyWithMarkdownV2(
      getStartText(),
      Markup.keyboard([
        [Markup.button.callback('🛒 Список тарифов', 'rate_list')],
        [Markup.button.callback('👤 Профиль', 'profile')],
      ]).resize(),
    );
    await this.rateUpdate.handleRateList(ctx);
  }

  @Hears('🛒 Список тарифов')
  async sendRateList(@Ctx() ctx: SessionSceneContext) {
    await this.rateUpdate.handleRateList(ctx);
  }

  @Hears('👤 Профиль')
  async sendProfile(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });
    await ctx.replyWithMarkdownV2(getProfile(user));
  }
}
