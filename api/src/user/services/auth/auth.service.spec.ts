import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';
import { JwtService } from '../jwt/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should check for user existence', async () => {
      expect.assertions(3);

      const existSpy = jest
        .spyOn(userService, 'isUserExists')
        .mockResolvedValue(true);
      const createSpy = jest.spyOn(userService, 'createUser');

      try {
        await authService.register({
          email: 'email',
          password: 'password',
          lastName: 'lName',
          firstName: 'fName',
        });
      } catch (e) {
        expect(e.message).toBe('User already exists');
      }
      expect(existSpy).toHaveBeenCalledWith('email');
      expect(createSpy).toHaveBeenCalledTimes(0);
    });

    it('should create user', async () => {
      const existSpy = jest
        .spyOn(userService, 'isUserExists')
        .mockResolvedValue(false);
      const createSpy = jest
        .spyOn(userService, 'createUser')
        .mockResolvedValue(new UserEntity());

      const newUser = await authService.register({
        email: 'email',
        password: 'password',
        lastName: 'lName',
        firstName: 'fName',
      });

      expect(newUser).toBeInstanceOf(UserEntity);
      expect(existSpy).toHaveBeenCalledWith('email');
      expect(createSpy).toHaveBeenCalledWith({
        email: 'email',
        password: 'password',
        lastName: 'lName',
        firstName: 'fName',
      });
    });
  });
});
