import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/db/prisma.service';
import {
  ConfigAPI,
  AppAPI,
  InfoAPI,
  MTProxiesAPI,
  ShortAPI,
} from '../types/Apis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VpnUserService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async getProxy() {
    const settings = await this.prisma.settings.findMany();
    return settings[0].user_proxy_path;
  }

  async getUrl() {
    const proxy = await this.getProxy();
    return `${proxy}/api/v2`;
  }

  async getAllConfigs(user_id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<ConfigAPI[]>(`${url}/user/all-configs`, {
        headers: { 'Hiddify-API-Key': user_id },
      }),
    );
    return res.data;
  }

  async getAppAPI(user_id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<AppAPI[]>(`${url}/user/apps`, {
        headers: { 'Hiddify-API-Key': user_id },
      }),
    );
    return res.data;
  }

  async getInfoAPI(user_id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<InfoAPI>(`${url}/user/me`, {
        headers: { 'Hiddify-API-Key': user_id },
      }),
    );
    return res.data;
  }

  async getMTProxiesAPI(user_id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<MTProxiesAPI[]>(`${url}/user/mtproxies`, {
        headers: { 'Hiddify-API-Key': user_id },
      }),
    );
    return res.data;
  }

  async getShortAPI(user_id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<ShortAPI>(`${url}/user/short`, {
        headers: { 'Hiddify-API-Key': user_id },
      }),
    );
    return res.data;
  }
}
