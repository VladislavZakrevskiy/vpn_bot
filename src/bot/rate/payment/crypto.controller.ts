import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Currency } from '@prisma/client';
import { InjectBot } from 'nestjs-telegraf';
import { Invoice } from 'src/bot/core/types/Invoice';
import { PurchaseService } from 'src/purchases/purchases.service';
import { RateService } from 'src/rates/rates.service';
import { UserService } from 'src/users/users.service';
import { VpnAdminService } from 'src/vpn/services/vpn.admin.service';
import { VpnUserService } from 'src/vpn/services/vpn.user.service';
import { Telegraf } from 'telegraf';
import * as dayjs from 'dayjs';
import { getSuccessfulPayload } from 'src/bot/core/texts/getSuccessfulPayload.';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Controller('webhook')
export class CryptoController {
  constructor(
    @InjectBot() private bot: Telegraf,
    private userService: UserService,
    private rateService: RateService,
    private vpnAdminService: VpnAdminService,
    private vpnUserService: VpnUserService,
    private purchaseService: PurchaseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(process.env.CRYPTO_PAYMENT_TOKEN)
  async onPaidPOST(@Body() invoice: Invoice) {
    if (invoice.update_type && invoice.update_type === 'invoice_paid') {
      const purchaseCandidate = this.purchaseService.getPurchaseByQuery({
        hash: invoice.payload.payload,
      });
      if (!purchaseCandidate) {
        const tg_id = invoice.payload.payload.split('_')[1];
        const rate_id = invoice.payload.payload.split('_')[1];
        const user = await this.userService.getUserByQuery({
          tg_id: String(tg_id),
        });
        const rate = await this.rateService.getByQuery({ id: rate_id });
        const vpnUser = (await this.vpnAdminService.getUser(user.vpn_uuid))
          .data;
        await this.vpnAdminService.updateUser(user.vpn_uuid, {
          usage_limit_GB: vpnUser.usage_limit_GB + rate.GB_limit,
          enable: true,
          package_days: vpnUser.package_days + rate.expiresIn,
        });
        await this.userService.updateUser({ id: user.id }, { is_active: true });
        const configs = await this.vpnUserService.getAllConfigs(user.vpn_uuid);
        const autoConfig = configs.find(({ name }) => name === 'Auto');
        await this.purchaseService.createPurchase({
          active: true,
          amount: rate.price,
          hash: invoice.payload.payload,
          vpn_token: autoConfig.link,
          currency: Currency.RUB,
          purchase_date: dayjs().add(rate.expiresIn, 'days').toISOString(),
          rate: { connect: { id: rate.id } },
          user: { connect: { id: user.id } },
        });

        await this.bot.telegram.sendMessage(
          tg_id,
          getSuccessfulPayload(autoConfig.link),
          { parse_mode: 'HTML' },
        );
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(process.env.CRYPTO_PAYMENT_TOKEN)
  async onPaidGET(@Body() invoice: Invoice) {
    if (invoice.update_type && invoice.update_type === 'invoice_paid') {
      const purchaseCandidate = this.purchaseService.getPurchaseByQuery({
        hash: invoice.payload.payload,
      });
      if (!purchaseCandidate) {
        const tg_id = invoice.payload.payload.split('_')[1];
        const rate_id = invoice.payload.payload.split('_')[1];
        const user = await this.userService.getUserByQuery({
          tg_id: String(tg_id),
        });
        const rate = await this.rateService.getByQuery({ id: rate_id });
        const vpnUser = (await this.vpnAdminService.getUser(user.vpn_uuid))
          .data;
        await this.vpnAdminService.updateUser(user.vpn_uuid, {
          usage_limit_GB: vpnUser.usage_limit_GB + rate.GB_limit,
          enable: true,
          package_days: vpnUser.package_days + rate.expiresIn,
        });
        await this.userService.updateUser({ id: user.id }, { is_active: true });
        const configs = await this.vpnUserService.getAllConfigs(user.vpn_uuid);
        const autoConfig = configs.find(({ name }) => name === 'Auto');
        await this.purchaseService.createPurchase({
          active: true,
          amount: rate.price,
          hash: invoice.payload.payload,
          vpn_token: autoConfig.link,
          currency: Currency.RUB,
          purchase_date: dayjs().add(rate.expiresIn, 'days').toISOString(),
          rate: { connect: { id: rate.id } },
          user: { connect: { id: user.id } },
        });

        await this.bot.telegram.sendMessage(
          tg_id,
          getSuccessfulPayload(autoConfig.link),
          { parse_mode: 'HTML' },
        );
      }
    }
  }
}
