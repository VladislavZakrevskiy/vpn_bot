import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class VpnSystemService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async getProxy() {
    const settings = await this.prisma.settings.findMany();
    return settings[0].admin_proxy_path;
  }

  async getUrl() {
    const proxy = await this.getProxy();
    return `${proxy}/api/v2`;
  }

  async ping() {
    const proxy = await this.getUrl();
    const version = await lastValueFrom(
      this.httpService.get(`${proxy}/panel/info`),
    );
    const deleteMethod = await lastValueFrom(
      this.httpService.delete(`${proxy}/panel/ping`),
    );
    const getMethod = await lastValueFrom(
      this.httpService.get(`${proxy}/panel/ping`),
    );
    const patchMethod = await lastValueFrom(
      this.httpService.patch(`${proxy}/panel/ping`),
    );
    const postMethod = await lastValueFrom(
      this.httpService.post(`${proxy}/panel/ping`),
    );
    const putMethod = await lastValueFrom(
      this.httpService.put(`${proxy}/panel/ping`),
    );

    return {
      version: version.data,
      delete: deleteMethod.data,
      get: getMethod.data,
      patch: patchMethod.data,
      post: postMethod.data,
      put: putMethod.data,
    };
  }
}
