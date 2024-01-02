import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { pino, LoggerOptions } from 'pino';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from 'src/global/constants';
import { ConfigService } from '@nestjs/config';
import { AppEnv } from 'src/services/app-config/configuration';

@Injectable()
export class AppLoggerService implements LoggerService {
  private pino: pino.Logger;

  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
    private readonly configService: ConfigService,
  ) {
    const logLevel = configService.get('logLevel');
    const appEnv = configService.get<AppEnv>('appEnv');

    const loggerConfig: LoggerOptions = {
      level: logLevel,
    };

    if (appEnv === AppEnv.DEV) {
      loggerConfig.transport = {
        target: 'pino-pretty',
      };
    }

    this.pino = pino(loggerConfig);
  }

  error(message: any, trace?: string, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    this.pino.error({ traceId }, this.getMessage(message, context));
    if (trace) {
      this.pino.error(trace);
    }
  }

  log(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    this.pino.info({ traceId }, this.getMessage(message, context));
  }

  warn(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    this.pino.warn({ traceId }, this.getMessage(message, context));
  }

  private getMessage(message: any, context?: string) {
    return context ? `[${context}] ${message}` : message;
  }
}
