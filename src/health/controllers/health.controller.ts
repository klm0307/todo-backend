import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaHealthIndicator } from '../providers/prisma-health-indicator.service';
import {
  HealthCheckService,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private database: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('http', 'https://docs.nestjs.com'),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.database.checkDatabase('prisma'),
    ]);
  }
}
