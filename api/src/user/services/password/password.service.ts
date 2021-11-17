import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordService {
  async generate(rawPassword: string) {
    return await hash(rawPassword, 10);
  }

  async compare(requestPassword: string, hash: string): Promise<boolean> {
    return await compare(requestPassword, hash);
  }
}
