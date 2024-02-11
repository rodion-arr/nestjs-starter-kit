import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { CacheHealthIndicator } from './indicators/cache/cache.health-indicator';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [CacheHealthIndicator],
})
export class HealthModule {}
