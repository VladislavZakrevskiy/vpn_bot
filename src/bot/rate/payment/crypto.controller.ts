import { Body, Controller, Get, Post } from '@nestjs/common';
import { Invoice } from 'src/bot/core/types/Invoice';

@Controller('webhook')
export class CryptoController {
  constructor() {}

  @Post(process.env.CRYPTO_PAYMENT_TOKEN)
  async onPaidPOST(@Body() invoice: Invoice) {
    console.log(invoice);
  }

  @Get(process.env.CRYPTO_PAYMENT_TOKEN)
  async onPaidGET(@Body() invoice: Invoice) {
    console.log(invoice);
  }
}
