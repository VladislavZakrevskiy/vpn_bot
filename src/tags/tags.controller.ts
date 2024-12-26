import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addTag(@Body() { value }: { value: string }) {
    return await this.tagsService.addTag(value);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeTag(@Param('id') id: string) {
    return await this.tagsService.removeTag(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateTag(@Param('id') id: string, @Body() { value }: { value: string }) {
    return await this.tagsService.updateTag({ id: Number(id), value });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  async updateTags(@Body() { data }: { data: [id: string, value: string][] }) {
    return await this.tagsService.updateTags(data.map(([id, value]) => [Number(id), value]));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTag(@Param('id') id: string) {
    return await this.tagsService.getTag({ id: Number(id) });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTags() {
    return await this.tagsService.getTags({});
  }
}
