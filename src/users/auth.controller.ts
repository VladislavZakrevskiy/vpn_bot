import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import * as crypto from 'crypto';
import { UserService } from './user/users.service';
import { JwtService } from './jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Post('/hash')
  async getHash(@Body() { dataCheckString }: { dataCheckString: string }) {
    if (!dataCheckString) throw new NotFoundException('No dataCheckString');
    const data = dataCheckString.split('=');
    const tg_user = JSON.parse(data[data.length - 1]);

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(process.env.TELEGRAM_BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    const user = await this.userService.getUserByQuery({
      tg_id: String(tg_user.id),
    });
    const accessToken = this.jwtService.generateAccessToken({
      user,
    });

    return {
      hash: calculatedHash,
      access_token: accessToken,
    };
  }
}
