import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PasswordService } from '../password/password.service';
import { JwtService } from '../jwt/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { mockUserEntity } from '../../entities/__fixtures__/user-entity.fixture';

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
        .mockResolvedValue(mockUserEntity);
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
        .mockResolvedValue(null);
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

  describe('login', () => {
    it('should check for user existence', async () => {
      expect.assertions(2);

      const existSpy = jest
        .spyOn(userService, 'isUserExists')
        .mockResolvedValue(null);

      try {
        await authService.login({
          email: 'email',
          password: 'password',
        });
      } catch (e) {
        expect(e.message).toBe('Login failed');
      }
      expect(existSpy).toHaveBeenCalledWith('email');
    });

    it('should check for password correct', async () => {
      expect.assertions(3);

      const existSpy = jest
        .spyOn(userService, 'isUserExists')
        .mockResolvedValue(mockUserEntity);
      const checkPassSpy = jest
        .spyOn(userService, 'checkUserPassword')
        .mockResolvedValue(false);

      try {
        await authService.login({
          email: 'email',
          password: 'password',
        });
      } catch (e) {
        expect(e.message).toBe('Incorrect password');
      }
      expect(existSpy).toHaveBeenCalledWith('email');
      expect(checkPassSpy).toHaveBeenCalledWith(mockUserEntity, 'password');
    });

    it('should return session token', async () => {
      const existSpy = jest
        .spyOn(userService, 'isUserExists')
        .mockResolvedValue(mockUserEntity);
      const checkPassSpy = jest
        .spyOn(userService, 'checkUserPassword')
        .mockResolvedValue(true);
      const userTokenSpy = jest
        .spyOn(userService, 'getUserToken')
        .mockReturnValue('mock-token');
      const userUpdateSpy = jest
        .spyOn(userService, 'updateUser')
        .mockResolvedValue(mockUserEntity);

      const token = await authService.login({
        email: 'email',
        password: 'password',
      });

      expect(token).toBe('mock-token');
      expect(existSpy).toHaveBeenCalledWith('email');
      expect(checkPassSpy).toHaveBeenCalledWith(mockUserEntity, 'password');
      expect(userTokenSpy).toHaveBeenCalledWith(mockUserEntity);
      expect(userUpdateSpy).toHaveBeenCalledWith({
        ...mockUserEntity,
        token: 'mock-token',
      });
    });
  });
});
