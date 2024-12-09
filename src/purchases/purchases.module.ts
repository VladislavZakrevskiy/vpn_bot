import { Module } from '@nestjs/common';
import { PurchaseService } from './purchases.service';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
