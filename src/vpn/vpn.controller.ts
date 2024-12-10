import { Controller, Get } from '@nestjs/common';
import { VpnSystemService } from './services/vpn.system.service';

@Controller('vpn')
export class VpnV2Controller {
  constructor(private vpnService: VpnSystemService) {}

  @Get('health')
  async checkHealth() {
    const health = await this.vpnService.ping();
    return health;
  }
}
