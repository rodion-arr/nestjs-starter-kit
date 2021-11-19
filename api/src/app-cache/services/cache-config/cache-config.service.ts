import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheConfig } from '../../../services/app-config/configuration';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const { host, port, password } =
      this.configService.get<CacheConfig>('cache');

    return {
      ttl: 60 * 60,
      store: redisStore,
      host,
      port,
      auth_pass: password,
    };
  }
}
