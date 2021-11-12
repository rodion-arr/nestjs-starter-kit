import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
