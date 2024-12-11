import { Action, Ctx, Update } from 'nestjs-telegraf';
import { getCryptoPaymentText } from 'src/bot/core/texts/getCryptoPaymentText';
import { SessionSceneContext } from 'src/bot/core/types/Context';
import { PrismaService } from 'src/db/prisma.service';
import { RateService } from 'src/rates/rates.service';
import {
  CallbackQuery,
  InlineKeyboardButton,
} from 'telegraf/typings/core/types/typegram';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoBotAPI = require('crypto-bot-api');

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

  @Action(/^(BTC|ETH|TON|BNB|BUSD|USDC|USDT)_(.+)$/)
  async sendCryptoInvoice(@Ctx() ctx: SessionSceneContext) {
    const currency = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')[0];
    const rate_id = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')[1];
    const rate = await this.rateService.getByQuery({ id: rate_id });
    const client = new CryptoBotAPI(process.env.CRYPTO_PAYMENT_TOKEN);
    const invoice = await client.createInvoice({
      amount: rate.price,
      currencyType: CryptoBotAPI.CurrencyType.Fiat,
      fiat: 'RUB',
      description: `Оплата тарифа ${rate.name} - ${rate.description}`,
      isAllowAnonymous: false,
      acceptedAssets: [currency],
    });
    const currencyUSD = await client.getExchangeRate('RUB', 'USD');
    const currencyRate = await client.getExchangeRate(currency, 'USD');

    await ctx.deleteMessage();
    await ctx.replyWithMarkdownV2(
      getCryptoPaymentText((rate.price * currencyUSD) / currencyRate, currency),
      {
        reply_markup: {
          inline_keyboard: [
            [{ url: invoice.botPayUrl, text: '✅ Перейти к оплате' }],
            [
              {
                callback_data: `crypto_${rate.id}`,
                text: '🔙 Назад',
              },
            ],
          ],
        },
      },
    );

    const onPaid = (invoice, requestDate) => {
      console.log(requestDate, invoice);
    };

    client.createServer(
      {
        http: true,
      },
      '/secret-webhooks-path',
    );
  }
}
