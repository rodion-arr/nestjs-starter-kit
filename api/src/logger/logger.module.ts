import { Module } from '@nestjs/common';
import { AppLoggerService } from './services/app-logger/app-logger.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AppLoggerService],
})
export class LoggerModule {}
