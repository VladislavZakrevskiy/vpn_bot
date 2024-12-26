import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaService } from 'src/db/prisma.service';
import { JwtService } from 'src/users/jwt.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService, JwtService],
})
export class TagsModule {}
