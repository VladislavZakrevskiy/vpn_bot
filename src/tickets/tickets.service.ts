import { Injectable } from '@nestjs/common';
import { $Enums, Prisma, Role } from '@prisma/client';
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

  async getTickets(user_id: string, where: Prisma.TicketWhereInput) {
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
      include: { support_tickets: { where }, user_tickets: { where } },
    });

    return user.role === Role.SUPPORT
      ? user.support_tickets
      : user.user_tickets;
  }

  async addTicket(user_id: string) {
    const supporters = await this.prisma.user.findMany({
      where: { role: 'SUPPORT' },
      include: { support_tickets: true },
    });
    const support_tickets = supporters.map(({ support_tickets, id }) => ({
      id,
      tickets: support_tickets.filter(({ status }) => status === 'OPEN').length,
    }));
    const support_id = min(support_tickets, 'tickets')?.id;

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
    });
  }
}
