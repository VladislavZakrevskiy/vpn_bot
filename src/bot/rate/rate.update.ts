import { Injectable } from '@nestjs/common';
import { RateService } from 'src/rates/rates.service';
import { SessionSceneContext } from '../core/types/Context';
import { Action, Ctx, InjectBot, Update } from 'nestjs-telegraf';
import {
  CallbackQuery,
  InlineKeyboardButton,
} from 'telegraf/typings/core/types/typegram';
import { escapeMarkdown } from '../core/helpers/escapeMarkdown';
import { UserService } from '../../users/users.service';
import { Telegraf } from 'telegraf';
import { Currency } from '@prisma/client';
import { PurchaseService } from 'src/purchases/purchases.service';
import { VpnUserService } from 'src/vpn/services/vpn.user.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { getSuccessfulPayload } from '../core/texts/getSuccessfulPayload.';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/db/prisma.service';

@Update()
@Injectable()
export class RateUpdate {
  constructor(
    private rateService: RateService,
    private userService: UserService,
    private purchaseService: PurchaseService,
    private vpnUserService: VpnUserService,
    private vpnAdminService: VpnAdminService,
    private prisma: PrismaService,
    @InjectBot() private bot: Telegraf,
  ) {}

  async handleRateList(ctx: SessionSceneContext, edit: boolean = false) {
    const user = await this.userService.getUserByQuery({
      tg_id: ctx.from.id.toString(),
    });
    const rates = await this.rateService.getAllRates();
    if (rates.length === 0) {
      ctx.reply('Простите, тарифов нет(');
      return;
    }
    if (edit) {
      ctx.deleteMessage();
    }
    const buttons: InlineKeyboardButton[][] = [];

    for (const { price, name, id } of rates) {
      if (!(price === 0 && user.was_trial)) {
        buttons.push([
          {
            text: name,
            callback_data: `rate_${id}`,
          },
        ]);
      }
    }
    ctx.replyWithMarkdownV2('*Выберите желаемый тариф:*', {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }

  @Action(/^rate_(.+)$/)
  async onRate(@Ctx() ctx: SessionSceneContext) {
    const user = await this.userService.getUserWithPurchaseByQuery({
      tg_id: ctx.from.id.toString(),
    });
    const settings = await this.prisma.settings.findFirst({});
    if (
      user?.purchases &&
      user?.purchases.filter(({ active }) => active).length >=
        (settings.max_sert || 3)
    ) {
      await ctx.replyWithMarkdownV2(
        escapeMarkdown(
          `Простите, у вас уже есть ${settings.max_sert || 3} активных тарифа! Если вы хотите делиться сертфикатами с ними, пожалуйста, порекомендуйте нас! Это просто, просто пришлите им имя бота @${this.bot.botInfo.username}`,
        ),
      );
      return;
    }
    const rate_id = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')[1];
    const to_delete = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')?.[2];

    const rate = await this.rateService.getByQuery({ id: rate_id });
    if (rate.price === 0) {
      const rate = await this.rateService.getByQuery({ id: rate_id });
      const vpnUser = await this.vpnAdminService.getUser(user.vpn_uuid);
      await this.vpnAdminService.updateUser(user.vpn_uuid, {
        usage_limit_GB: vpnUser.usage_limit_GB + rate.GB_limit,
        enable: true,
        package_days: vpnUser.package_days + rate.expiresIn,
      });
      await this.userService.updateUser(
        { id: user.id },
        { is_active: true, was_trial: true },
      );
      const configs = await this.vpnUserService.getAllConfigs(user.vpn_uuid);
      const autoConfig = configs.find(({ name }) => name === 'Auto');
      await this.purchaseService.createPurchase({
        active: true,
        amount: rate.price,
        vpn_token: autoConfig.link,
        currency: Currency.RUB,
        purchase_date: dayjs().add(rate.expiresIn, 'days').toISOString(),
        rate: { connect: { id: rate.id } },
        user: { connect: { id: user.id } },
      });

      await ctx.replyWithMarkdownV2(getSuccessfulPayload(autoConfig.link));
      return;
    }

    if (to_delete) ctx.deleteMessage(Number(to_delete));
    ctx.deleteMessage();
    ctx.replyWithMarkdownV2(
      escapeMarkdown(`*${rate.name}*
*${rate.description}*
*${rate.price} руб.*`),
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                callback_data: `crypto_${rate.id}`,
                text: '🌎 Оплатить CryptoBot',
              },
            ],
            [
              {
                callback_data: `card_${rate.id}`,
                text: '💳 Оплатить картой',
              },
            ],
            [
              {
                callback_data: `stars_${rate.id}`,
                text: '⭐️ Оплатить звездами',
              },
            ],
            [
              {
                callback_data: `return_rate_list`,
                text: '🔙 Назад',
              },
            ],
          ],
        },
      },
    );
  }

  @Action('return_rate_list')
  async returnToRateList(ctx: SessionSceneContext) {
    this.handleRateList(ctx, true);
  }
}
