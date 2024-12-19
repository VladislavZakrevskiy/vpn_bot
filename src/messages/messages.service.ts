import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getMessagesByQuery(
    where?: Prisma.MessageWhereInput,
    include?: Prisma.MessageInclude,
  ) {
    return await this.prisma.message.findMany({ where, include });
  }

  async getMessageByQuery(where?: Prisma.MessageWhereInput) {
    return await this.prisma.message.findFirst({ where });
  }

  async createMessage(data: Prisma.MessageCreateInput) {
    return await this.prisma.message.create({ data });
  }

  async toggleSended(ids: string[]) {
    return await this.prisma.message.updateMany({
      data: { sended: true },
      where: { id: { in: ids } },
    });
  }
}
