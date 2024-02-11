import { Test } from '@nestjs/testing';
import Mock = jest.Mock;
import { CacheHealthIndicator } from './cache.health-indicator';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getCacheMock } from 'test/test-utils/cache.mock';

describe('CacheHealthIndicator', () => {
  let service: CacheHealthIndicator;
  let cacheManagerMock: Partial<Cache>;

  beforeEach(async () => {
    cacheManagerMock = getCacheMock();

    const moduleRef = await Test.createTestingModule({
      controllers: [CacheHealthIndicator],
      providers: [{ provide: CACHE_MANAGER, useValue: cacheManagerMock }],
    }).compile();

    service = moduleRef.get<CacheHealthIndicator>(CacheHealthIndicator);
  });

  describe('isHealthy', () => {
    it('should return cache health check result', async () => {
      (cacheManagerMock.set as Mock).mockResolvedValueOnce('true');
      (cacheManagerMock.get as Mock).mockResolvedValueOnce('true');

      const result = await service.isHealthy();

      expect(result).toEqual({ cache: { status: 'up' } });
    });

    it('should return cache health error result', async () => {
      (cacheManagerMock.set as Mock).mockResolvedValueOnce('true');
      (cacheManagerMock.get as Mock).mockResolvedValueOnce('false');

      await expect(service.isHealthy()).rejects.toThrowError(
        'CacheHealthIndicator failed',
      );
    });
  });
});
