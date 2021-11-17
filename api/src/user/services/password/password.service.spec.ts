import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { mocked } from 'ts-jest/utils';
import { hash, compare } from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate passwords', async () => {
    const hashMock = mocked(hash);
    hashMock.mockResolvedValue('mock-password' as never);
    expect(await service.generate('password')).toBe('mock-password');
  });

  it('should compare password hash', async () => {
    const compareMock = mocked(compare);
    compareMock.mockResolvedValue(true as never);
    expect(await service.compare('password', 'hash')).toBe(true);
  });
});
