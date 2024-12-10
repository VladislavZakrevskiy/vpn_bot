import { Action, Ctx, Update } from 'nestjs-telegraf';
import { SessionSceneContext } from 'src/bot/core/types/Context';

@Update()
export class StarsPaymentService {
  constructor() {}

  @Action(/^stars_(.+)$/)
  async sendPaymentInfo(@Ctx() ctx: SessionSceneContext) {
    ctx.reply('stars');
  }
}
