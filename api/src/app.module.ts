import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { getConfig } from './services/app-config/configuration';
import { AppCacheModule } from './app-cache/app-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
    }),
    DbModule,
    AppCacheModule,
    UserModule,
    ConfigModule,
    AppCacheModule,
  ],
})
export class AppModule {}
