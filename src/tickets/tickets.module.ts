import { Module } from '@nestjs/common';
import { TicketController } from './tickets.controller';
import { TicketService } from './tickets.service';
import { PrismaService } from 'src/db/prisma.service';
import { UserModule } from 'src/users/users.module';
import { VpnModule } from 'src/vpn/vpn.module';
import { JwtService } from 'src/users/jwt.service';

@Module({
  imports: [UserModule, VpnModule],
  controllers: [TicketController],
  providers: [TicketService, PrismaService, JwtService],
  exports: [TicketService],
})
export class TicketModule {}
