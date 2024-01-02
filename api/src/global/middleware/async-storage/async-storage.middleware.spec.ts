import { AsyncStorageMiddleware } from './async-storage.middleware';
import { Test, TestingModule } from '@nestjs/testing';
import { ASYNC_STORAGE } from '../../constants';
import { AsyncLocalStorage } from 'async_hooks';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mock-trace-id'),
}));

describe('AsyncStorageMiddleware', () => {
  let middleware: AsyncStorageMiddleware;
  let storage: AsyncLocalStorage<Map<string, string>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsyncStorageMiddleware,
        {
          provide: ASYNC_STORAGE,
          useValue: {
            run: (store: unknown, callback: () => void) => {
              callback();
            },
          },
        },
      ],
    }).compile();

    middleware = module.get<AsyncStorageMiddleware>(AsyncStorageMiddleware);
    storage = module.get<AsyncLocalStorage<Map<string, string>>>(ASYNC_STORAGE);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should accept request id header', () => {
    const runSpy = jest.spyOn(storage, 'run');
    const nextMock = jest.fn();

    middleware.use(
      {
        headers: { 'x-request-id': 'mocked' },
      },
      null,
      nextMock,
    );

    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(runSpy).toHaveBeenCalledWith(
      new Map().set('traceId', 'mocked'),
      expect.anything(),
    );
  });

  it('should generate request id if no header found', () => {
    const runSpy = jest.spyOn(storage, 'run');
    const nextMock = jest.fn();

    middleware.use(
      {
        headers: {},
      },
      null,
      nextMock,
    );

    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(runSpy).toHaveBeenCalledWith(
      new Map().set('traceId', 'mock-trace-id'),
      expect.anything(),
    );
  });
});
