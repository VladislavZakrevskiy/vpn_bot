import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoBotAPI = require('crypto-bot-api');

@Injectable()
export class CryptoBotService {
  client;

  constructor() {
    const client = new CryptoBotAPI(process.env.CRYPTO_PAYMENT_TOKEN);
    this.client = client;
    client.createServer(
      {
        http: true,
      },
      '/secret-webhooks-path',
    );
  }

  getClient() {
    return this.client;
  }
}
