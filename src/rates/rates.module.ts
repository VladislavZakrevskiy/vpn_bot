import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { RateService } from './rates.service';

@Module({
  imports: [PrismaModule],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
