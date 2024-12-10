import { Module } from '@nestjs/common';
import { VpnSystemService } from './services/vpn.system.service';
import { PrismaModule } from 'src/db/prisma.module';
import { VpnV2Controller } from './vpn.controller';
import { VpnAdminService } from './services/vpn.admin.service';
import { VpnUserService } from './services/vpn.user.service';

@Module({
  imports: [PrismaModule],
  controllers: [VpnV2Controller],
  providers: [VpnSystemService, VpnAdminService, VpnUserService],
  exports: [VpnSystemService, VpnAdminService, VpnUserService],
})
export class VpnModule {}
