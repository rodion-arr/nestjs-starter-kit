import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfigService } from './cache-config.service';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

jest.mock('cache-manager-redis-store', () => ({
  redisStore: jest.fn(),
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
    const cacheOptions = service.createCacheOptions();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await cacheOptions.store();
    const redisMock = jest.mocked(redisStore);

    expect(redisMock).toHaveBeenCalledWith({
      socket: {
        host: 'host',
        port: 0,
      },
      password: 'password',
      ttl: 60 * 60,
    });
  });
});
