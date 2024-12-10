import { Action, Ctx, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bot/core/types/Context';

@Update()
export class CryptoPaymentService {
  constructor() {}

  @Action(/^crypto_(.+)$/)
  async sendPaymentInfo(@Ctx() ctx: SessionSceneContext) {
    ctx.reply('crypto');
  }
}
