import { Injectable } from '@nestjs/common';
import { Prisma, Purchase } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async getAllPurchases(): Promise<Purchase[]> {
    return this.prisma.purchase.findMany();
  }

  async getPurchasesByUser(user_id: string): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({ where: { user_id } });
  }

  async getPurchasesByRate(rate_id: string): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({ where: { rate_id } });
  }

  async getPurchaseByQuery(where: Prisma.PurchaseWhereInput) {
    return await this.prisma.purchase.findMany({ where });
  }

  async getPurchasesByRateUser(
    rate_id: string,
    user_id: string,
  ): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({
      where: { rate_id, user_id },
    });
  }

  async getPurchasesByQuery(
    query: Prisma.PurchaseWhereInput,
  ): Promise<Purchase[]> {
    return this.prisma.purchase.findMany({ where: query });
  }

  async createPurchase(data: Prisma.PurchaseCreateInput): Promise<Purchase> {
    return this.prisma.purchase.create({ data });
  }

  async updatePurchase(
    where: Prisma.PurchaseWhereUniqueInput,
    data: Prisma.PurchaseUpdateInput,
  ): Promise<Purchase> {
    return this.prisma.purchase.update({ where, data });
  }

  async deletePurchase(
    where: Prisma.PurchaseWhereUniqueInput,
  ): Promise<Purchase> {
    return this.prisma.purchase.delete({ where });
  }

  async connectPurchase(id: string): Promise<Purchase> {
    return this.prisma.purchase.update({
      where: { id },
      data: { active: true },
    });
  }

  async disconnectPurchase(id: string): Promise<Purchase> {
    return this.prisma.purchase.update({
      where: { id },
      data: { active: false },
    });
  }
}
