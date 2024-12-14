import { Body, Post } from '@nestjs/common';
import { Invoice } from 'src/bot/core/types/Invoice';

export class CryptoController {
  constructor() {}

  @Post(process.env.CRYPTO_PAYMENT_TOKEN)
  async onPaid(@Body() invoice: Invoice) {
    console.log(invoice);
  }
}
