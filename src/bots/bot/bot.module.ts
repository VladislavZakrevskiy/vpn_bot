import { Module } from '@nestjs/common';
import { RateModule } from 'src/rates/rates.module';
import { UserModule } from 'src/users/users.module';
import { PurchaseModule } from 'src/purchases/purchases.module';
import { VpnModule } from 'src/vpn/vpn.module';
import { BotCoreUpdate } from './core/bot.update';
import { RateUpdate } from './rate/rate.update';
import { CardPaymentService } from './rate/payment/card_payment.update';
import { CryptoPaymentService } from './rate/payment/crypto_payment.update';
import { StarsPaymentService } from './rate/payment/stars_payment';
import { CryptoController } from './rate/payment/crypto.controller';
import { SettingsModule } from 'src/settings/settings.module';
import { JwtService } from 'src/users/jwt.service';
import { PrismaModule } from 'src/db/prisma.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';

@Module({
  controllers: [CryptoController],
  imports: [
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [session()],
    }),
    UserModule,
    PrismaModule,
    RateModule,
    PurchaseModule,
    VpnModule,
    SettingsModule,
  ],
  providers: [
    BotCoreUpdate,
    RateUpdate,
    CardPaymentService,
    CryptoPaymentService,
    StarsPaymentService,
    JwtService,
  ],
})
export class BotModule {}
