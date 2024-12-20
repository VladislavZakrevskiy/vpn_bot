import { Cron } from '@nestjs/schedule';
import { User, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/db/prisma.service';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @InjectBot('main') private bot: Telegraf,
  ) {}

  @Cron(process.env.RATE_CHECK_TIME)
  async checkRate() {
    const users = await this.getUsersWithPurchaseByQuery({});

    for (const user of users) {
      if (user.is_active && user.purchases && user.purchases.length !== 0) {
        const { tg_id, purchases } = user;
        const activePurchases = purchases.filter(({ active }) => active);
        let hoursDiff = 0;
        for (const activePurchase of activePurchases) {
          const lastDay = dayjs(activePurchase.purchase_date).add(activePurchase.rate.expiresIn, 'D');
          hoursDiff += Math.abs(dayjs(new Date()).diff(lastDay, 'hours'));
        }
        if (hoursDiff < 24 * 3) {
          await this.bot.telegram.sendMessage(
            tg_id,
            `⚠️ Скоро закончится ваш тариф, осталось менее 3 дней!
Успейте обновить!`,
            {
              reply_markup: {
                inline_keyboard: [[{ callback_data: 'rate_list', text: '🛒 Список тарифов' }]],
              },
            },
          );
          return;
        }
        if (hoursDiff < 24) {
          await this.bot.telegram.sendMessage(
            tg_id,
            `⚠️ Скоро закончится ваш тариф, осталось менее 1 дня!
Успейте обновить!`,
            {
              reply_markup: {
                inline_keyboard: [[{ callback_data: 'rate_list', text: '🛒 Список тарифов' }]],
              },
            },
          );
          return;
        }
        if (hoursDiff <= 0) {
          await this.updateUser(
            { id: user.id },
            {
              is_active: false,
              purchases: {
                updateMany: {
                  where: { active: true },
                  data: { active: false },
                },
              },
            },
          );
          await this.bot.telegram.sendMessage(
            tg_id,
            `🚨🚨🚨 Ваш тариф истек! Вы можете обновить его у нас в магазине!`,
            {
              reply_markup: {
                inline_keyboard: [[{ callback_data: 'rate_list', text: '🛒 Список тарифов' }]],
              },
            },
          );
          return;
        }
      }
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserByQuery(query: Prisma.UserWhereInput): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: query,
    });
  }

  async getUserWithPurchaseByQuery(query: Prisma.UserWhereInput) {
    return await this.prisma.user.findFirst({
      where: query,
      include: { purchases: { include: { rate: true } } },
    });
  }

  async getUsersByQuery(query: Prisma.UserWhereInput): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: query,
    });
    return users;
  }

  async getUsersWithPurchaseByQuery(query: Prisma.UserWhereInput) {
    return await this.prisma.user.findMany({
      where: query,
      include: { purchases: { include: { rate: true } } },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    await this.prisma.purchase.deleteMany({ where: { user_id: where.id } });
    return this.prisma.user.delete({
      where,
    });
  }
}
