import { Injectable } from '@nestjs/common';
import { RateService } from 'src/rates/rates.service';
import { SessionSceneContext } from '../core/types/Context';
import { Action, Ctx, Update } from 'nestjs-telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { escapeMarkdown } from '../core/helpers/escapeMarkdown';

@Update()
@Injectable()
export class RateUpdate {
  constructor(private rateService: RateService) {}

  async handleRateList(ctx: SessionSceneContext, edit: boolean = false) {
    const rates = await this.rateService.getAllRates();
    if (rates.length === 0) {
      ctx.reply('Простите, тарифов нет(');
      return;
    }
    if (edit) {
      ctx.deleteMessage();
    }
    ctx.replyWithMarkdownV2('*Выберите желаемый тариф:*', {
      reply_markup: {
        inline_keyboard: rates.map(({ name, id }) => [
          {
            text: name,
            callback_data: `rate_${id}`,
          },
        ]),
      },
    });
  }

  @Action(/^rate_(.+)$/)
  async onRate(@Ctx() ctx: SessionSceneContext) {
    const rate_id = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')[1];
    const to_delete = (
      ctx.callbackQuery as CallbackQuery & { data: string }
    ).data.split('_')?.[2];

    const rate = await this.rateService.getByQuery({ id: rate_id });

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
