import { Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';

@Injectable()
export class PasswordService {
  async generate(rawPassword: string) {
    return await hash(rawPassword, 10);
  }
}
