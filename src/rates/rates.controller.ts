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

@Controller('rates') // Маршрут для контроллера
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getAllRates() {
    return this.rateService.getAllRates();
  }

  @Get('query') // Используем другой маршрут для поиска по запросу
  async getByQuery(@Query() where: Prisma.RateWhereInput) {
    return this.rateService.getByQuery(where);
  }

  @Post()
  async addRate(@Body() data: Prisma.RateCreateInput) {
    return this.rateService.addRate(data);
  }

  @Patch(':id') // :id - параметр маршрута для обновления
  async updateRate(
    @Param('id') id: string,
    @Body() data: Prisma.RateUpdateInput,
  ) {
    return this.rateService.updateRate({ id: id }, data); // Передаем ID как часть where
  }

  @Delete(':id') // :id - параметр маршрута для удаления
  async deleteRate(@Param('id') id: string) {
    return this.rateService.deleteRate({ id: id }); // Передаем ID как часть where
  }

  @Delete() // Маршрут для удаления всех записей
  async deleteAllRates() {
    return this.rateService.deleteAllRates();
  }
}
