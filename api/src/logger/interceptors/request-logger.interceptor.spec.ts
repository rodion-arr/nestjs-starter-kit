import { RequestLoggerInterceptor } from './request-logger.interceptor';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, LoggerService } from '@nestjs/common';

describe('RequestLoggerInterceptor', () => {
  let interceptor: RequestLoggerInterceptor;
  let loggerMock: LoggerService;

  beforeEach(async () => {
    loggerMock = {
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestLoggerInterceptor],
    })
      .setLogger(loggerMock)
      .compile();

    interceptor = module.get<RequestLoggerInterceptor>(
      RequestLoggerInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log incoming request', () => {
    const nextMock = {
      handle: jest.fn(),
    };
    const requestMock = () => ({
      method: 'test-method',
      url: 'test-url',
      query: 'test-query',
      body: 'test-body',
    });
    const contextMock = {
      switchToHttp: () => ({
        getRequest: requestMock,
      }),
    };

    interceptor.intercept(contextMock as ExecutionContext, nextMock);

    expect(nextMock.handle).toHaveBeenCalledTimes(1);
    expect(loggerMock.log).toHaveBeenCalledWith(
      '{"message":"test-method test-url REQUEST","query":"test-query","body":"test-body"}',
      'RequestLoggerInterceptor',
    );
  });
});
