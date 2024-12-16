import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { PrismaModule } from 'src/db/prisma.module';
import { JwtService } from './jwt.service';
import { AuthController } from './auth.controller';
import { VpnModule } from 'src/vpn/vpn.module';

@Module({
  imports: [PrismaModule, VpnModule],
  controllers: [AuthController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
