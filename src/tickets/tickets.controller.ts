import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TicketService } from './tickets.service';
import { UserService } from '../users/user/users.service';
import { VpnAdminService } from '../vpn/services/vpn.admin.service';
import { Ticket, User } from '@prisma/client';
import { User as VpnUser } from 'src/vpn/types/User';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Controller('tickets')
export class TicketController {
  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private vpnAdminService: VpnAdminService,
  ) {}

  @Get('tickets')
  async getTickets(@Query('ids') ids: string) {
    const supportIds = ids?.split('/\\');
    const supports = await this.userService.getUsersByQuery(
      { role: 'SUPPORT', id: supportIds && supportIds.length !== 0 ? { in: supportIds } : undefined },
      { support_tickets: { include: { supporter: true, user: true, tag: true }, orderBy: { created_at: 'asc' } } },
    );
    const tickets: (Ticket & { supporter: User & { vpn: VpnUser }; user: User & { vpn: VpnUser } })[] = supports
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .map(({ support_tickets }) => support_tickets)
      .flat();

    for (let i = 0; i < tickets.length; i++) {
      const { supporter, user } = tickets[i];
      const vpnSupport = await this.vpnAdminService.getUser(supporter.vpn_uuid);
      const vpnUser = await this.vpnAdminService.getUser(user.vpn_uuid);

      tickets[i].supporter = { ...tickets[i].supporter, vpn: vpnSupport.data as VpnUser };
      tickets[i].user = { ...tickets[i].user, vpn: vpnUser.data as VpnUser };
    }

    return tickets;
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
    const ticket = await this.ticketService.getTicket(id, { messages: true, supporter: true, user: true, tag: true });

    const { supporter, user } = ticket;
    const vpnSupport = await this.vpnAdminService.getUser(supporter.vpn_uuid);
    const vpnUser = await this.vpnAdminService.getUser(user.vpn_uuid);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ticket.supporter = { ...ticket.supporter, vpn: vpnSupport.data as VpnUser };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ticket.user = { ...ticket.user, vpn: vpnUser.data as VpnUser };

    return ticket;
  }
}
