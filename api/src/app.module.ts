import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from '../config/configuration';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
    }),
    CoreModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
