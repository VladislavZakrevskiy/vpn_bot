import { randomUUID } from 'crypto';
import * as dayjs from 'dayjs';
import { Action, Ctx, On, Update } from 'nestjs-telegraf';
import { RateService } from 'src/rates/rates.service';
import { UserService } from 'src/users/user/users.service';
import {
  CallbackQuery,
  SuccessfulPayment,
} from 'telegraf/typings/core/types/typegram';
import { Currency } from '@prisma/client';
import { VpnUserService } from 'src/vpn/services/vpn.user.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { PurchaseService } from 'src/purchases/purchases.service';
import { SessionSceneContext } from '../../core/types/Context';
import { getSuccessfulPayload } from '../../core/texts/getSuccessfulPayload.';

@Update()
export class CardPaymentService {
  constructor(
    private rateService: RateService,
    private userService: UserService,
    private purchaseService: PurchaseService,
    private vpnUserService: VpnUserService,
    private vpnAdminService: VpnAdminService,
  ) {}

  @Action(/^card_(.+)$/)
  async sendPaymentInfo(@Ctx() ctx: SessionSceneContext) {
    const rate_id = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')[1];
    const rate = await this.rateService.getByQuery({ id: rate_id });
    await ctx.deleteMessage();
    const invoice = await ctx.sendInvoice({
      currency: 'RUB',
      description: rate.description,
      payload: `${randomUUID()}_${rate.id}`,
      prices: [{ amount: rate.price * 100, label: rate.name }],
      provider_token: process.env.PAYMENT_TOKEN,
      title: rate.name,
    });
    await ctx.replyWithMarkdownV2(`*Хотите вернуться?*`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              callback_data: `rate_${rate.id}_${invoice.message_id}`,
              text: '🔙 Назад',
            },
          ],
        ],
      },
    });
  }

  @On('pre_checkout_query')
  async preCheckoutQuery(@Ctx() ctx: SessionSceneContext) {
    await ctx.answerPreCheckoutQuery(true);
  }

  @On('successful_payment')
  async onSuccessfulPayment(
    @Ctx()
    ctx: SessionSceneContext & {
      message?: { successful_payment?: SuccessfulPayment };
    },
  ) {
    const user = await this.userService.getUserByQuery({
      tg_id: String(ctx.from.id),
    });
    const rate_id =
      ctx.message.successful_payment.invoice_payload.split('_')[1];
    const rate = await this.rateService.getByQuery({ id: rate_id });
    const vpnUser = (await this.vpnAdminService.getUser(user.vpn_uuid)).data;
    await this.vpnAdminService.updateUser(user.vpn_uuid, {
      usage_limit_GB: vpnUser.usage_limit_GB + rate.GB_limit,
      enable: true,
      package_days: vpnUser.package_days + rate.expiresIn,
    });
    await this.userService.updateUser({ id: user.id }, { is_active: true });
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

    await ctx.replyWithHTML(getSuccessfulPayload(autoConfig.link));
  }
}
