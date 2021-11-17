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

  async isUserExists(email: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const userPayload = {
      email: userDto.email.toLocaleLowerCase(),
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      password: await this.passwordService.generate(userDto.password),
    };

    const newUser = this.usersRepository.create({
      ...userPayload,
      token: this.getUserToken(userDto),
    });

    return await this.updateUser(newUser);
  }

  async updateUser(newUser: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.save(newUser);
  }

  async checkUserPassword(
    user: UserEntity,
    requestPassword: string,
  ): Promise<boolean> {
    return this.passwordService.compare(requestPassword, user.passwordHash);
  }

  public getUserToken(user: CreateUserDto | UserEntity): string {
    return this.jwtService.sign({
      email: user.email.toLocaleLowerCase(),
      firstName: user.firstName,
      lastName: user.lastName,
    });
  }
}
