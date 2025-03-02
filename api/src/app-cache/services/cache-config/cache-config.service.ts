import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { CacheConfig } from 'src/services/app-config/configuration';
import { createKeyv } from '@keyv/redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const { host, port, password } = this.configService.get<CacheConfig>(
      'cache',
    ) as CacheConfig;

    return {
      stores: [
        createKeyv({
          // Store-specific configuration:
          socket: {
            host,
            port,
          },
          password: password ?? null,
        }),
      ],
    };
  }
}
