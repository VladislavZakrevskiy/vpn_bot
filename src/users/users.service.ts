import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserByQuery(query: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: query,
    });
  }

  async getUsersByQuery(query: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({
      where: query,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async getRateEnd(tg_id: string): Promise<Date | null> {
    const user = await this.prisma.user.findUnique({
      where: { tg_id },
      include: {
        purchases: { include: { rate: true } },
      },
    });
    const activeRates = user.purchases.filter((a) => a.active);

    if (!user || activeRates.length === 0) {
      return null;
    }

    const startDate = dayjs(new Date(activeRates[0].purchase_date));

    if (activeRates.length === 1) {
      return startDate.add(activeRates[0].rate.expiresIn, 'days').toDate();
    }

    for (let i = 1; i < activeRates.length; i++) {
      startDate.add(dayjs(activeRates[i].rate.expiresIn).get('days'), 'days');
    }

    return startDate.toDate();
  }
}
