import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PrismaService } from 'src/db/prisma.service';
import { JwtService } from 'src/users/jwt.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, PrismaService, JwtService],
  exports: [SettingsService],
})
export class SettingsModule {}
