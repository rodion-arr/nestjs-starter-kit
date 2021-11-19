import { CacheModule, Module } from '@nestjs/common';
import { CacheConfigService } from './services/cache-config/cache-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfigService,
    }),
  ],
  providers: [CacheConfigService],
  exports: [CacheModule],
})
export class AppCacheModule {}
