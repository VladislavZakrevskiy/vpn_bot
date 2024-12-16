import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaModule } from 'src/db/prisma.module';
import { JwtService } from './jwt.service';
import { AuthController } from './auth.controller';
import { VpnModule } from 'src/vpn/vpn.module';
import { UserController } from './users.controller';
import { JwtAuthGuard } from 'src/core/decorators/JwtAuth';

@Module({
  imports: [PrismaModule, VpnModule],
  controllers: [AuthController, UserController],
  providers: [UserService, JwtService, JwtAuthGuard],
  exports: [UserService],
})
export class UserModule {}
