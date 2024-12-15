import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './dto/JwtPayload';

@Injectable()
export class JwtService {
  constructor() {}

  private readonly accessSecret = process.env.SECRET_ACCESS_JWT;
  private readonly expiresAccess = process.env.EXPIRES_IN_ACCESS_JWT;

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessSecret, {
      expiresIn: this.expiresAccess,
    });
  }

  decodeAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.accessSecret);
      return decoded as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  verifyAccessToken(token: string) {
    try {
      console.log(jwt.verify(token, this.accessSecret));
      return jwt.verify(token, this.accessSecret) as JwtPayload;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
