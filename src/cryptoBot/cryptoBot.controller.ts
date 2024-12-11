import { Controller, Get, Req } from '@nestjs/common';

@Controller('')
export class CryptoBotController {
  constructor() {}

  @Get(`/${process.env.CRYPTO_PAYMENT_TOKEN}`)
  getWebhook(@Req() req: Request) {
    console.log(req);
  }
}
