import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { setTimeout } from 'node:timers/promises';

@Injectable()
export class CacheHealthIndicator extends HealthIndicator {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const timeIsUp = async () => {
        await setTimeout(1000);
        throw new Error('Cache timeout');
      };

      const cacheIsUp = async () => {
        await this.cacheManager.set('healthcheck', 'true', { ttl: 10 } as any);
        const result = await this.cacheManager.get('healthcheck');

        if (result !== 'true') {
          throw new Error('Cache is down');
        }
      };

      await Promise.race([cacheIsUp(), timeIsUp()]);

      return this.getStatus('cache', true);
    } catch {
      throw new HealthCheckError(
        'CacheHealthIndicator failed',
        this.getStatus('cache', false),
      );
    }
  }
}
