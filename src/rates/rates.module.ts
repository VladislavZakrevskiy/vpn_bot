import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { RateService } from './rates.service';
import { RateController } from './rates.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
