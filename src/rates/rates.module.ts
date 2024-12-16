import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/db/prisma.module';
import { RateService } from './rates.service';
import { RateController } from './rates.controller';
import { JwtService } from 'src/users/jwt.service';

@Module({
  imports: [PrismaModule],
  controllers: [RateController],
  providers: [RateService, JwtService],
  exports: [RateService],
})
export class RateModule {}
