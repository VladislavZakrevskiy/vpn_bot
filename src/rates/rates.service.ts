import { Injectable } from '@nestjs/common';
import { Rate, Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class RateService {
  constructor(private prisma: PrismaService) {}

  async getAllRates(): Promise<Rate[]> {
    return this.prisma.rate.findMany();
  }

  async getByQuery(where: Prisma.RateWhereInput) {
    return this.prisma.rate.findFirst({ where });
  }

  async addRate(data: Prisma.RateCreateInput): Promise<Rate> {
    return this.prisma.rate.create({
      data,
    });
  }

  async updateRate(
    where: Prisma.RateWhereUniqueInput,
    data: Prisma.RateUpdateInput,
  ): Promise<Rate> {
    return this.prisma.rate.update({
      where,
      data,
    });
  }

  async deleteRate(where: Prisma.RateWhereUniqueInput): Promise<Rate> {
    return this.prisma.rate.delete({
      where,
    });
  }

  async deleteAllRates(): Promise<Prisma.BatchPayload> {
    return this.prisma.rate.deleteMany();
  }
}
