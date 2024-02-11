import { Cache } from 'cache-manager';

export const getCacheMock = (): Partial<Cache> => {
  return {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };
};
