import { Controller, Get, UseGuards } from '@nestjs/common';
import { VpnSystemService } from './services/vpn.system.service';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Controller('vpn')
export class VpnV2Controller {
  constructor(private vpnService: VpnSystemService) {}

  @UseGuards(JwtAuthGuard)
  @Get('health')
  async checkHealth() {
    const health = await this.vpnService.ping();
    return health;
  }
}
