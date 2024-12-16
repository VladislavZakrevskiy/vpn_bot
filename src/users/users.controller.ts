import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { VpnAdminService } from '../vpn/services/vpn.admin.service';
import { User as VpnUser } from 'src/vpn/types/User';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUsers() {
    const users = await this.userService.getUsersByQuery({});
    const vpnUsers: (User & { vpn: VpnUser })[] = [];

    for (const user of users) {
      try {
        const vpnUser = await this.vpnAdminService.getUser(user.vpn_uuid);
        console.log(user, vpnUser);
        if (vpnUser.status === 404) {
          await this.userService.deleteUser({ id: user.id });
        } else {
          vpnUsers.push({ ...user, vpn: vpnUser.data });
        }
      } catch (e) {
        console.log(e);
        await this.userService.deleteUser({ id: user.id });
      }
    }

    return vpnUsers;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUser({ id });
    const vpnUser = await this.vpnAdminService.deleteUser(user.vpn_uuid);

    return { ...user, vpn: vpnUser };
  }

  @UseGuards(JwtAuthGuard)
  @Post('synchronize')
  async synchronizeUsers() {
    const users = await this.userService.getUsersByQuery({});
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
        await this.userService.deleteUser({ id: user.id });
      }
    }

    return vpnUsers;
  }
}
