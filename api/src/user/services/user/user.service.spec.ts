import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { PasswordService } from '../password/password.service';
import { JwtService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { mockUserEntity } from '../../entities/__fixtures__/user-entity.fixture';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<UserEntity>;
  let passwordService: PasswordService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        PasswordService,
        JwtService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    passwordService = module.get<PasswordService>(PasswordService);
    jwtService = module.get<JwtService>(JwtService);
    repo = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to check user existence', async () => {
    const findOneSpy = jest.spyOn(repo, 'findOne').mockResolvedValue(null);

    expect(await service.isUserExists('mail')).toBe(null);
    expect(findOneSpy).toHaveBeenCalledWith({
      where: {
        email: 'mail',
      },
    });
  });

  it('should be able to create user', async () => {
    const passwordSpy = jest
      .spyOn(passwordService, 'generate')
      .mockResolvedValue('password-hash');
    const jwtSpy = jest.spyOn(jwtService, 'sign').mockReturnValue('jwt');
    const createSpy = jest
      .spyOn(repo, 'create')
      .mockReturnValue(mockUserEntity);
    const saveSpy = jest.spyOn(repo, 'save').mockResolvedValue(mockUserEntity);

    const newUser = await service.createUser({
      email: 'EMAIL',
      firstName: 'fName',
      lastName: 'lName',
      password: 'password',
    });

    expect(newUser).toStrictEqual(mockUserEntity);
    expect(passwordSpy).toHaveBeenCalledWith('password');
    expect(saveSpy).toHaveBeenCalledTimes(2);
    expect(jwtSpy).toHaveBeenCalledWith({
      id: 0,
      email: 'email',
      firstName: 'fName',
      lastName: 'lName',
    });
    expect(createSpy).toHaveBeenCalledWith({
      email: 'email',
      firstName: 'fName',
      lastName: 'lName',
      passwordHash: 'password-hash',
    });
  });

  it('should check user password', async () => {
    const compareSpy = jest
      .spyOn(passwordService, 'compare')
      .mockResolvedValue(true);

    expect(
      await service.checkUserPassword(mockUserEntity, 'request-password'),
    ).toBe(true);
    expect(compareSpy).toHaveBeenCalledWith(
      'request-password',
      mockUserEntity.passwordHash,
    );
  });

  it('should get all users', async () => {
    const repoSpy = jest
      .spyOn(repo, 'find')
      .mockResolvedValue([mockUserEntity]);

    expect(await service.getAll()).toStrictEqual([mockUserEntity]);
    expect(repoSpy).toHaveBeenCalledWith({
      select: ['id', 'email', 'lastName', 'firstName'],
    });
  });
});
