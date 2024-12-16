import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RateService } from './rates.service';

@Controller('rates')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getAllRates() {
    return this.rateService.getAllRates();
  }

  @Get('query')
  async getByQuery(@Query() where: Prisma.RateWhereInput) {
    return this.rateService.getByQuery(where);
  }

  @Post()
  async addRate(@Body() data: Prisma.RateCreateInput) {
    return this.rateService.addRate(data);
  }

  @Patch(':id')
  async updateRate(
    @Param('id') id: string,
    @Body() data: Prisma.RateUpdateInput,
  ) {
    return this.rateService.updateRate({ id: id }, data);
  }

  @Delete(':id')
  async deleteRate(@Param('id') id: string) {
    return this.rateService.deleteRate({ id: id });
  }

  @Delete()
  async deleteAllRates() {
    return this.rateService.deleteAllRates();
  }
}
