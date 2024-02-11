import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface';
import Mock = jest.Mock;

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckService: Partial<HealthCheckService>;
  let typeOrmHealthIndicator: Partial<TypeOrmHealthIndicator>;

  beforeEach(async () => {
    healthCheckService = {
      check: jest.fn(),
    };

    typeOrmHealthIndicator = {
      pingCheck: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: healthCheckService },
        { provide: TypeOrmHealthIndicator, useValue: typeOrmHealthIndicator },
      ],
    }).compile();

    healthController = moduleRef.get<HealthController>(HealthController);
    healthCheckService = moduleRef.get<HealthCheckService>(HealthCheckService);
    typeOrmHealthIndicator = moduleRef.get<TypeOrmHealthIndicator>(
      TypeOrmHealthIndicator,
    );
  });

  describe('healthCheck', () => {
    it('should return health check result', async () => {
      const healthCheckResult: HealthCheckResult = {
        status: 'ok',
        details: {
          db: {
            status: 'up',
          },
        },
      };

      (healthCheckService.check as Mock).mockImplementation(
        async (props: (() => void)[]) => {
          props.forEach((propFunction) => propFunction());
          return healthCheckResult;
        },
      );
      (typeOrmHealthIndicator.pingCheck as Mock).mockReturnValue(true);

      const result = await healthController.healthCheck();

      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
      expect(typeOrmHealthIndicator.pingCheck).toHaveBeenCalledWith('db');
      expect(result).toEqual(healthCheckResult);
    });
  });
});
