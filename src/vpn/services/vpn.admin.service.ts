import { lastValueFrom } from 'rxjs';
import { Admin } from '../types/Admin';
import { PrismaService } from 'src/db/prisma.service';
import { HttpService } from '@nestjs/axios';
import { User } from '../types/User';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VpnAdminService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async getProxy() {
    const setting = await this.prisma.settings.findMany();
    return setting[0].admin_proxy_path;
  }

  async getUrl() {
    const proxy = await this.getProxy();
    return `${proxy}/api/v2`;
  }

  async getAllAdmins() {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<Admin[]>(`${url}/admin/admin_user/`),
    );
    return res.data;
  }

  async createAdmin(createData: Admin) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.post<Admin, Admin>(
        `${url}/admin/admin_user/`,
        createData,
      ),
    );
    return res.data;
  }

  async deleteAdmin(id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.delete<Admin>(`${url}/admin/admin_user/${id}`),
    );
    return res.data;
  }

  async getAdmin(id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<Admin>(`${url}/admin/admin_user/${id}`),
    );
    return res.data;
  }

  async updateAdmin(id: string, updateData: Partial<Admin>) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.patch<Admin, Partial<Admin>>(
        `${url}/admin/admin_user/${id}`,
        updateData,
      ),
    );
    return res.data;
  }

  async getAdminUsers() {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<User[]>(`${url}/admin/user/`),
    );
    return res.data;
  }

  async createUser(createData: Partial<User>) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.post<User, Partial<User>>(
        `${url}/admin/user/`,
        createData,
      ),
    );
    return res.data;
  }

  async deleteUser(id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.delete<User>(`${url}/admin/user/${id}`),
    );
    return res.data;
  }

  async updateUser(id: string, updateData: Partial<User>) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.patch<User, Partial<User>>(
        `${url}/admin/user/${id}`,
        updateData,
      ),
    );
    return res.data;
  }

  async getUser(id: string) {
    const url = await this.getUrl();
    const res = await lastValueFrom(
      this.httpService.get<Admin, Partial<Admin>>(`${url}/admin/user/${id}`),
    );
    return res.data;
  }
}
