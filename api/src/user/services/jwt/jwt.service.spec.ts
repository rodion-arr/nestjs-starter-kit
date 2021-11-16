import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';

jest.mock('jsonwebtoken', () => {
  return { sign: jest.fn().mockReturnValue('jwt') };
});

describe('JwtService', () => {
  let service: JwtService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be sign jwt tokens', () => {
    const configGetSpy = jest.spyOn(config, 'get').mockReturnValue('secret');

    expect(service.sign('payload')).toBe('jwt');
    expect(configGetSpy).toHaveBeenCalledWith('jwtSecret');
  });
});
