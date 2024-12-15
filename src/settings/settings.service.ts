// settings.service.ts
import { Injectable } from '@nestjs/common';
import { Prisma, Settings } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings(): Promise<Settings | null> {
    return this.prisma.settings.findFirst();
  }

  async update(data: Prisma.SettingsUpdateInput): Promise<Settings> {
    const settings = this.prisma.settings.findFirst();

    return this.prisma.settings.update({
      where: { id: (await settings).id },
      data,
    });
  }
}
