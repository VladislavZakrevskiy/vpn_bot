import { Module } from '@nestjs/common';
import { UserService } from './user/users.service';
import { PrismaModule } from 'src/db/prisma.module';
import { JwtService } from './jwt.service';
import { AuthController } from './auth.controller';
import { VpnModule } from 'src/vpn/vpn.module';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';
import { UserController } from './user/users.controller';
import { SupportController } from './support/support.controller';
import { SupportService } from './support/support.service';

@Module({
  imports: [PrismaModule, VpnModule],
  controllers: [AuthController, UserController, SupportController],
  providers: [UserService, JwtService, JwtAuthGuard, SupportService],
  exports: [UserService, SupportService],
})
export class UserModule {}
