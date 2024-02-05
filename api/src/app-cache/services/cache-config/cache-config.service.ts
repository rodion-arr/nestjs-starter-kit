import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { CacheConfig } from 'src/services/app-config/configuration';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const { host, port, password } = this.configService.get<CacheConfig>(
      'cache',
    ) as CacheConfig;

    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: async () => {
        return await redisStore({
          // Store-specific configuration:
          socket: {
            host,
            port,
          },
          password: password ?? null,
          ttl: 60 * 60, // 1h
        });
      },
    };
  }
}
