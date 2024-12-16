import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RateService } from './rates.service';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllRates() {
    return this.rateService.getAllRates();
  }

  @UseGuards(JwtAuthGuard)
  @Get('query')
  async getByQuery(@Query() where: Prisma.RateWhereInput) {
    return this.rateService.getByQuery(where);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addRate(@Body() data: Prisma.RateCreateInput) {
    return this.rateService.addRate(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateRate(
    @Param('id') id: string,
    @Body() data: Prisma.RateUpdateInput,
  ) {
    return this.rateService.updateRate({ id: id }, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRate(@Param('id') id: string) {
    return this.rateService.deleteRate({ id: id });
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteAllRates() {
    return this.rateService.deleteAllRates();
  }
}
