import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User as VpnUser } from 'src/vpn/types/User';
import { Role, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';
import { UserService } from './users.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';

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
  @Post('/role')
  async switchRole(@Body() { role, id }: { role: Role; id: string }) {
    return await this.userService.updateUser({ id }, { role });
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
