import { Module } from '@nestjs/common';
import { RateModule } from 'src/rates/rates.module';
import { UserModule } from 'src/users/users.module';
import { PrismaModule } from '../db/prisma.module';
import { PurchaseModule } from 'src/purchases/purchases.module';

@Module({
  imports: [UserModule, PrismaModule, RateModule, PurchaseModule],
  providers: [],
})
export class BotModule {}
