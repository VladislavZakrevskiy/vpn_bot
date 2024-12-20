import { Action, Command, Ctx, Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { getStartText } from './texts/getStartText';
import { TgUser } from './decorators/TgUser';
import { TelegramUser } from './types/TelegramUser';
import { UserService } from 'src/users/user/users.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { RateUpdate } from '../rate/rate.update';
import { SessionSceneContext } from './types/Context';
import { Markup, Telegraf } from 'telegraf';
import { getProfile } from './texts/getProfile';
import * as dayjs from 'dayjs';
import { Pagination } from '@vladislav_zakrevskiy/telegraf-pagination';
import { generatePurchaseCardEntities } from './texts/getPurchaseText';
import { escapeMarkdown } from './helpers/escapeMarkdown';
import { SettingsService } from 'src/settings/settings.service';

@Update()
export class BotCoreUpdate {
  constructor(
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
    private rateUpdate: RateUpdate,
    @InjectBot('main') private bot: Telegraf,
    private settingsService: SettingsService,
  ) {
    this.setAdmin();
  }

  async setAdmin() {
    const { admin_command } = await this.settingsService.getSettings();
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
  }

  @Command('test')
  async onTest(@Ctx() ctx: SessionSceneContext) {
    await ctx.replyWithMarkdownV2(`*bold text*
_italic text_
__underline__
~strikethrough~
||spoiler||
*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
[inline URL](http://www.example.com/)
[inline mention of a user](tg://user?id=123456789)
![👍](tg://emoji?id=5368324170671202286)
\`inline fixed-width code\`
\`\`\`
pre-formatted fixed-width code block
\`\`\`
\`\`\`python
pre-formatted fixed-width code block written in the Python programming language
\`\`\`
>Block quotation started
>Block quotation continued
>Block quotation continued
>Block quotation continued
>The last line of the block quotation
**>The expandable block quotation started right after the previous block quotation
>It is separated from the previous block quotation by an empty bold entity
>Expandable block quotation continued
>Hidden by default part of the expandable block quotation started
>Expandable block quotation continued
>The last line of the expandable block quotation with the expandability mark||`);
  }

  @Start()
  async start(@Ctx() ctx: SessionSceneContext, @TgUser() user: TelegramUser) {
    const dbUser = await this.userService.getUserByQuery({
      tg_id: user.id.toString(),
    });
    if (!dbUser) {
      const vpnBot = await this.vpnAdminService.createUser({
        lang: user.language_code || 'ru',
        name: [user.username, ctx.from.id].join(' '),
        package_days: 0,
        usage_limit_GB: 0,
        telegram_id: ctx.from.id,
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
        [Markup.button.callback('🗣 Поддержка', 'support')],
      ]).resize(),
    );
    await this.rateUpdate.handleRateList(ctx);
  }

  @Hears('🛒 Список тарифов')
  async sendRateList(@Ctx() ctx: SessionSceneContext) {
    await this.rateUpdate.handleRateList(ctx);
  }

  @Action('rate_list')
  async sendRateListAction(@Ctx() ctx: SessionSceneContext) {
    await this.rateUpdate.handleRateList(ctx);
  }

  @Hears('👤 Профиль')
  async sendProfile(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserWithPurchaseByQuery({
      tg_id: ctx.from.id.toString(),
    });
    if (!user?.purchases || user?.purchases?.length === 0) {
      await ctx.replyWithMarkdownV2(getProfile(user), {
        reply_markup: {
          inline_keyboard: [[{ text: '🛒 Мои покупки', callback_data: 'user_purchases' }]],
        },
      });
      return;
    }
    const activePurchases = user.purchases?.filter(({ active }) => active);
    let hoursDiff = 0;
    for (const activePurchase of activePurchases) {
      const lastDay = dayjs(activePurchase.purchase_date).add(activePurchase.rate.expiresIn, 'D');
      hoursDiff += Math.abs(dayjs(new Date()).diff(lastDay, 'hours'));
    }
    const vpnUser = (await this.vpnAdminService.getUser(user.vpn_uuid)).data;

    await ctx.replyWithMarkdownV2(
      getProfile(
        user,
        dayjs().add(hoursDiff, 'hours'),
        Number(vpnUser.usage_limit_GB - vpnUser.current_usage_GB).toFixed(3),
      ),
      {
        reply_markup: {
          inline_keyboard: [[{ text: '🛒 Мои покупки', callback_data: 'user_purchases' }]],
        },
      },
    );
  }

  @Hears('🗣 Поддержка')
  async sendSupport(@Ctx() ctx: SessionSceneContext) {
    await ctx.replyWithMarkdownV2(`*Поддержка*
Если у вас случилась проблема, вы можете обратиться в нашу поддержку, которая вам быстро ответит
@its3net\\_help\\_bot`);
  }

  @Action('user_purchases')
  async sendPurchases(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserWithPurchaseByQuery({
      tg_id: ctx.from.id.toString(),
    });
    if (!user.purchases || user.purchases.length === 0) {
      await ctx.deleteMessage();
      await ctx.replyWithMarkdownV2(
        escapeMarkdown(`Простите, вы еще не покупали тарифы
Вы можете их купить тут!`),
        {
          reply_markup: {
            inline_keyboard: [[{ callback_data: 'rate_list', text: '🛒 Список тарифов' }]],
          },
        },
      );
      return;
    }
    const pagination = new Pagination({
      data: user.purchases,
      format: generatePurchaseCardEntities,
      pageSize: 1,
      rowSize: 1,
      onlyNavButtons: true,
      isButtonsMode: false,
      isEnabledDeleteButton: false,
      header: (i, _, total) => `${i}/${total}`,
    });

    await pagination.handleActions(this.bot);
    const text = await pagination.text();
    const keyboard = await pagination.keyboard();
    await ctx.replyWithMarkdownV2(text, { ...keyboard, parse_mode: 'HTML' });
  }
}
