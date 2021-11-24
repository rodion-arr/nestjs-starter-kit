import { Module } from '@nestjs/common';
import { AppLoggerService } from './services/app-logger/app-logger.service';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from './interceptors/request-logger.interceptor';

@Module({
  imports: [ConfigModule],
  providers: [
    AppLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
})
export class LoggerModule {}
