import {
  CACHE_MANAGER,
  CacheModule,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { CacheConfigService } from './services/cache-config/cache-config.service';
import { ConfigModule } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfigService,
    }),
  ],
  providers: [CacheConfigService],
  exports: [CacheModule],
})
export class AppCacheModule implements OnModuleDestroy {
  private readonly logger = new Logger(AppCacheModule.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  onModuleDestroy(): any {
    this.logger.log('Disconnecting from cache');
    (this.cacheManager.store as any).getClient().end(true);
  }
}
