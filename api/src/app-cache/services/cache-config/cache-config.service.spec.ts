import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfigService } from './cache-config.service';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

jest.mock('@keyv/redis', () => ({
  createKeyv: jest.fn(),
}));

describe('CacheConfigService', () => {
  let service: CacheConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({
              host: 'host',
              port: 0,
              password: 'password',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CacheConfigService>(CacheConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return redis config', async () => {
    service.createCacheOptions();
    const redisMock = jest.mocked(createKeyv);

    expect(redisMock).toHaveBeenCalledWith({
      socket: {
        host: 'host',
        port: 0,
      },
      password: 'password',
    });
  });
});
