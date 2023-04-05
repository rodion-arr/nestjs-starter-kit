import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(payload: string | Buffer | object): string {
    return sign(payload, this.configService.get('jwtSecret') as string, {
      expiresIn: '2h',
    });
  }
}
