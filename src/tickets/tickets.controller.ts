import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TicketService } from './tickets.service';
import { UserService } from '../users/user/users.service';
import { VpnAdminService } from '../vpn/services/vpn.admin.service';
import { User } from '@prisma/client';
import { User as VpnUser } from 'src/vpn/types/User';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Controller('tickets')
export class TicketController {
  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('tickets')
  async getTickets(@Query('ids') ids: string) {
    const supportIds = ids?.split('/\\');
    if (supportIds && supportIds.length !== 0) {
      const supports = await this.userService.getUsersByQuery(
        { role: 'SUPPORT', id: { in: supportIds } },
        { support_tickets: { include: { supporter: true, user: true } } },
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return supports.map(({ support_tickets }) => support_tickets);
    } else {
      const supports = await this.userService.getUsersByQuery(
        { role: 'SUPPORT' },
        { support_tickets: { include: { supporter: true, user: true } } },
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return supports.map(({ support_tickets }) => support_tickets);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('supoorters')
  async getSupporters() {
    const supporters = await this.userService.getUsersByQuery({ role: 'SUPPORT' });
    const vpnUsers: (User & { vpn: VpnUser })[] = [];
    for (const support of supporters) {
      const vpnUser = await this.vpnAdminService.getUser(support.vpn_uuid);
      vpnUsers.push({ ...support, vpn: vpnUser.data });
    }
    return vpnUsers;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/ticket/:id')
  async getTicket(@Param('id') id: string) {
    const ticket = await this.ticketService.getTicket(id, { messages: true, supporter: true, user: true });
    return ticket;
  }
}
