import { Injectable } from '@nestjs/common';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async addTag(value: string) {
    return await this.prisma.tag.create({ data: { value } });
  }

  async removeTag(id: number) {
    return await this.prisma.tag.delete({ where: { id } });
  }

  async updateTag({ id, value }: { id: number; value: string }) {
    return await this.prisma.tag.update({ where: { id }, data: { value } });
  }

  async updateTags(data: [id: number, value: string][]) {
    const updatedTags: Tag[] = [];
    for (const [id, value] of data) {
      updatedTags.push(await this.updateTag({ id, value }));
    }
    return updatedTags;
  }

  async getTag(where: Prisma.TagWhereInput) {
    return await this.prisma.tag.findFirst({ where });
  }

  async getTags(where: Prisma.TagWhereInput) {
    return await this.prisma.tag.findMany({ where });
  }
}
