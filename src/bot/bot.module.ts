import { Module } from '@nestjs/common';
import { RateModule } from 'src/rates/rates.module';
import { UserModule } from 'src/users/users.module';
import { PrismaModule } from '../db/prisma.module';
import { PurchaseModule } from 'src/purchases/purchases.module';
import { VpnModule } from 'src/vpn/vpn.module';
import { BotCoreUpdate } from './core/bot.update';
import { RateUpdate } from './rate/rate.update';
import { CardPaymentService } from './rate/payment/card_payment.update';
import { CryptoPaymentService } from './rate/payment/crypto_payment.update';
import { StarsPaymentService } from './rate/payment/stars_payment';
import { CryptoBotModule } from 'src/cryptoBot/cryptoBot.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    RateModule,
    PurchaseModule,
    VpnModule,
    CryptoBotModule,
  ],
  providers: [
    BotCoreUpdate,
    RateUpdate,
    CardPaymentService,
    CryptoPaymentService,
    StarsPaymentService,
  ],
})
export class BotModule {}
