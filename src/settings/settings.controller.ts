import { Body, Controller, Get, Patch } from '@nestjs/common';
import { Prisma, Settings } from '@prisma/client';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  getSettings(): Promise<Settings> {
    return this.settingsService.getSettings();
  }

  @Patch()
  update(
    @Body() updateSettingDto: Prisma.SettingsUpdateInput,
  ): Promise<Settings> {
    return this.settingsService.update(updateSettingDto);
  }
}
