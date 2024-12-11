import { Module } from '@nestjs/common';
// import { CryptoBotService } from './cryptoBot.service';
import { CryptoBotController } from './cryptoBot.controller';

@Module({
  controllers: [CryptoBotController],
  // providers: [CryptoBotService],
  // exports: [CryptoBotService],
})
export class CryptoBotModule {}
