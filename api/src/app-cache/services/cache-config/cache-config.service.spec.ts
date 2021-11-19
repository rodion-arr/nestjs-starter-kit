import { Test, TestingModule } from '@nestjs/testing';
import { CacheConfigService } from './cache-config.service';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

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

  it('should return redis config', () => {
    expect(service.createCacheOptions()).toStrictEqual({
      ttl: 60 * 60,
      store: redisStore,
      host: 'host',
      port: 0,
      auth_pass: 'password',
    });
  });
});
