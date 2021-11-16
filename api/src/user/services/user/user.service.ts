import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { PasswordService } from '../password/password.service';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async isUserExists(email: string): Promise<boolean> {
    const existingUser = await this.usersRepository.findOne({
      select: ['id'],
      where: {
        email: email.toLowerCase(),
      },
    });

    return !!existingUser;
  }

  async createUser({
    email,
    firstName,
    password,
    lastName,
  }: CreateUserDto): Promise<UserEntity> {
    const userPayload = {
      email: email.toLocaleLowerCase(),
      firstName,
      lastName,
      password: await this.passwordService.generate(password),
    };

    const newUser = this.usersRepository.create({
      ...userPayload,
      token: this.jwtService.sign(userPayload),
    });

    return await this.usersRepository.save(newUser);
  }
}
