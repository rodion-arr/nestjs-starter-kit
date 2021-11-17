import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { PasswordService } from './services/password/password.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './services/jwt/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        AuthService,
        UserService,
        PasswordService,
        ConfigService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register method', () => {
    it('should register user', async () => {
      jest.spyOn(authService, 'register').mockResolvedValue({
        id: 0,
        token: 'token',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        passwordHash: 'p',
      });

      expect(
        await controller.register({
          firstName: 'firstName',
          lastName: 'lastName',
          email: 'email',
          password: 'p',
        }),
      ).toStrictEqual({
        message: 'User created',
        user: {
          id: 0,
          token: 'token',
        },
      });
    });
  });

  describe('login method', () => {
    it('should login user', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue('mock-token');

      expect(
        await controller.login({
          email: 'email',
          password: 'p',
        }),
      ).toStrictEqual({
        message: 'Login successful',
        token: 'mock-token',
      });
    });
  });
});
