import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ASYNC_STORAGE } from '../../constants';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}

  use(req: any, res: any, next: () => void) {
    const traceId = req.headers['x-request-id'] || uuid();
    const store = new Map().set('traceId', traceId);
    this.asyncStorage.run(store, () => {
      next();
    });
  }
}
