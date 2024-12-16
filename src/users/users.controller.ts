import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { VpnAdminService } from '../vpn/services/vpn.admin.service';
import { User as VpnUser } from 'src/vpn/types/User';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
  ) {}

  @Get('')
  async getUsers() {
    const users = await this.userService.getUsersWithPurchaseByQuery({});
    const vpnUsers: (User & { vpn: VpnUser })[] = [];

    for (const user of users) {
      try {
        const vpnUser = await this.vpnAdminService.getUser(user.vpn_uuid);
        if (vpnUser.status === 404) {
          await this.userService.deleteUser({ id: user.id });
        } else {
          vpnUsers.push({ ...user, vpn: vpnUser.data });
        }
      } catch (e) {
        console.log('ERROR CONTROLLER', e);
        await this.userService.deleteUser({ id: user.id });
      }
    }

    return vpnUsers;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUser({ id });
    const vpnUser = await this.vpnAdminService.deleteUser(user.vpn_uuid);

    return { ...user, vpn: vpnUser };
  }

  @Post('synchronize')
  async synchronizeUsers() {
    const users = await this.userService.getUsersWithPurchaseByQuery({});
    const vpnUsers: (User & { vpn: VpnUser })[] = [];

    for (const user of users) {
      try {
        const vpnUser = await this.vpnAdminService.getUser(user.vpn_uuid);
        if (vpnUser.status === 404) {
          await this.userService.deleteUser({ id: user.id });
        } else {
          vpnUsers.push({ ...user, vpn: vpnUser.data });
        }
      } catch (e) {
        console.log('ERROR CONTROLLER', e);
        await this.userService.deleteUser({ id: user.id });
      }
    }

    return vpnUsers;
  }
}
