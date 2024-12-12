import { randomUUID } from 'crypto';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { getCryptoPaymentText } from 'src/bot/core/texts/getCryptoPaymentText';
import { SessionSceneContext } from 'src/bot/core/types/Context';
import { PrismaService } from 'src/db/prisma.service';
import { RateService } from 'src/rates/rates.service';
import {
  CallbackQuery,
  InlineKeyboardButton,
} from 'telegraf/typings/core/types/typegram';
import { WalletPaySDK } from 'wallet-pay-sdk';
import { ECurrencyCode } from 'wallet-pay-sdk/lib/src/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires

@Update()
export class CryptoPaymentService {
  constructor(
    private prisma: PrismaService,
    private rateService: RateService,
  ) {}

  @Action(/^crypto_(.+)$/)
  async sendPaymentInfo(@Ctx() ctx: SessionSceneContext) {
    const rate_id = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')[1];
    const settings = await this.prisma.settings.findMany();
    const { crypto_types } = settings[0];

    const buttons: InlineKeyboardButton[][] = [];
    for (let i = 0; i < crypto_types.length; i++) {
      const currency = crypto_types[i];
      if (i === crypto_types.length - 1) {
        buttons.push([
          { callback_data: `${currency}_${rate_id}`, text: currency },
        ]);
      } else {
        const nextCurrency = crypto_types[i + 1];

        buttons.push([
          { callback_data: `${currency}_${rate_id}`, text: currency },
          { callback_data: `${nextCurrency}_${rate_id}`, text: nextCurrency },
        ]);
        i++;
      }
    }
    await ctx.deleteMessage();
    await ctx.reply(
      `Выберите криптовалюту через которую вам будет удобно провести платеж.`,
      {
        reply_markup: {
          inline_keyboard: [
            ...buttons,
            [{ callback_data: `rate_${rate_id}`, text: '🔙 Назад' }],
          ],
        },
      },
    );
  }

  @Action(/^(BTC|EUR|RUB|TON|BUSD|USD|USDT)_(.+)$/)
  async sendCryptoInvoice(@Ctx() ctx: SessionSceneContext) {
    const currency = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')[0];
    const rate_id = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')[1];
    const rate = await this.rateService.getByQuery({ id: rate_id });
    const wp = new WalletPaySDK({
      apiKey: process.env.CRYPTO_PAYMENT_TOKEN,
      timeoutSeconds: 60 * 10,
    });
    const newOrder = {
      amount: {
        currencyCode: currency as ECurrencyCode,
        amount: '10.67',
      },
      description: 'My first order',
      // returnUrl: 'https://example.com',
      // failReturnUrl: 'https://example.com',
      externalId: randomUUID(),
      customerTelegramUserId: ctx.from.id,
    };

    const result = await wp.createOrder(newOrder);
    console.log(result);

    // await ctx.deleteMessage();
    // await ctx.replyWithMarkdownV2(
    //   getCryptoPaymentText((rate.price * currencyUSD) / currencyRate, currency),
    //   {
    //     reply_markup: {
    //       inline_keyboard: [
    //         [{ url: invoice.botPayUrl, text: '✅ Перейти к оплате' }],
    //         [
    //           {
    //             callback_data: `crypto_${rate.id}`,
    //             text: '🔙 Назад',
    //           },
    //         ],
    //       ],
    //     },
    //   },
    // );
  }
}
