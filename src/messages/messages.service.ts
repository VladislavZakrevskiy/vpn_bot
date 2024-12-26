import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async getMessagesByQuery(where?: Prisma.MessageWhereInput, include?: Prisma.MessageInclude) {
    return await this.prisma.message.findMany({ where, include });
  }

  async getMessageByQuery(where?: Prisma.MessageWhereInput, include?: Prisma.MessageInclude) {
    return await this.prisma.message.findFirst({ where, include });
  }

  async createMessage(data: Prisma.MessageCreateInput) {
    return await this.prisma.message.create({ data });
  }

  async updateMessage(where: Prisma.MessageWhereUniqueInput, data: Prisma.MessageUpdateInput) {
    return await this.prisma.message.update({ where, data });
  }

  async toggleSended(ids: string[]) {
    return await this.prisma.message.updateMany({
      data: { sended: true },
      where: { id: { in: ids } },
    });
  }
}
