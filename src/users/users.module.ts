import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaModule } from 'src/db/prisma.module';
import { JwtService } from './jwt.service';

@Module({
  imports: [PrismaModule],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
