import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { PasswordService } from './services/password/password.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './services/jwt/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { mockUserEntity } from './entities/__fixtures__/user-entity.fixture';

describe('UserController', () => {
  let controller: UserController;
  let authService: AuthService;
  let userService: UserService;

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
        {
          provide: 'CACHE_MANAGER',
          useValue: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
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

  describe('getUsers method', () => {
    it('should retrieve all users', async () => {
      const userServiceSpy = jest
        .spyOn(userService, 'getAll')
        .mockResolvedValue([mockUserEntity]);

      expect(await controller.getUsers()).toStrictEqual({
        message: 'Users retrieved successfully',
        users: [mockUserEntity],
      });
      expect(userServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
