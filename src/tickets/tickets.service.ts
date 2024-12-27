import { Injectable } from '@nestjs/common';
import { $Enums, Prisma, Role, Status } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

const min = <T>(array: T[], key: keyof T): T | undefined => {
  if (array.length === 0) {
    return undefined;
  }

  let min_obj: T = array[0];
  for (const elem of array) {
    if (elem[key] < min_obj[key]) {
      min_obj = elem;
    }
  }

  return min_obj;
};

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async getTicket(ticket_id: string, include?: Prisma.TicketInclude, status?: Status) {
    return await this.prisma.ticket.findUnique({
      where: { id: ticket_id, status: status },
      include,
    });
  }

  async setTagToTicket(ticket_id: string, tag_id: number) {
    return await this.prisma.ticket.update({ where: { id: ticket_id }, data: { tag: { connect: { id: tag_id } } } });
  }

  async getAllTickets(where?: Prisma.TicketWhereInput, include?: Prisma.TicketInclude) {
    return await this.prisma.ticket.findMany({ where, include });
  }

  async getTickets(user_id: string, where?: Prisma.TicketWhereInput, include?: Prisma.TicketInclude) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
      include: {
        support_tickets: { where, include, orderBy: { updated_at: 'desc' } },
        user_tickets: { where, include, orderBy: { updated_at: 'desc' } },
      },
    });

    return user.role === Role.SUPPORT ? user.support_tickets : user.user_tickets;
  }

  async addTicket(user_id: string) {
    const supporters = await this.prisma.user.findMany({
      where: { role: 'SUPPORT' },
      include: { support_tickets: { where: { status: 'OPEN' } } },
    });
    const support_tickets = supporters.map(({ support_tickets, id }) => ({
      id,
      tickets: support_tickets.length,
    }));
    const support_id = min(support_tickets, 'tickets')?.id;
    if (!support_id) {
      return;
    }

    return await this.prisma.ticket.create({
      data: {
        status: $Enums.Status.OPEN,
        supporter: { connect: { id: support_id } },
        user: { connect: { id: user_id } },
      },
    });
  }

  async closeTicket(id: string) {
    return await this.prisma.ticket.update({
      where: { id },
      data: { status: 'CLOSE' },
      include: { supporter: true, user: true, messages: { take: 1, include: { user: true } }, tag: true },
    });
  }
}
