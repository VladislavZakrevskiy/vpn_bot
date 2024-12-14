import { Body, Controller, Post } from '@nestjs/common';
import { Invoice } from 'src/bot/core/types/Invoice';

@Controller('webhook')
export class CryptoController {
  constructor() {}

  @Post(process.env.CRYPTO_PAYMENT_TOKEN)
  async onPaid(@Body() invoice: Invoice) {
    console.log(invoice);
  }
}
