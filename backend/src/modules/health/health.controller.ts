import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';
import { RedisService } from '../redis/redis.service';
import { FirebaseService } from '../firebase/firebase.service';
import { R2Service } from '../r2/r2.service';

@ApiTags('System & Health')
@Controller()
export class HealthController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly redisService: RedisService,
    private readonly firebaseService: FirebaseService,
    private readonly r2Service: R2Service,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Live Health Check for PostgreSQL, Upstash Redis, Firebase Admin SDK & Cloudflare R2' })
  @ApiResponse({ status: 200, description: 'Real-time infrastructure health report' })
  async getHealth() {
    const startTime = Date.now();

    // Run all 4 health checks concurrently in parallel
    const [postgresRes, redisHealth, firebaseHealth, r2Health] = await Promise.all([
      (async () => {
        const dbStart = Date.now();
        try {
          await this.databaseService.query('SELECT 1');
          return { status: 'connected', latencyMs: Date.now() - dbStart };
        } catch (err: any) {
          return { status: 'degraded', latencyMs: Date.now() - dbStart, message: err.message };
        }
      })(),
      this.redisService.checkHealth(),
      this.firebaseService.checkHealth(),
      this.r2Service.checkHealth(),
    ]);

    const isHealthy =
      postgresRes.status === 'connected' &&
      redisHealth.status === 'connected' &&
      firebaseHealth.status === 'connected' &&
      r2Health.status === 'connected';

    return {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      totalLatencyMs: Date.now() - startTime,
      services: {
        postgres: {
          status: postgresRes.status,
          latencyMs: postgresRes.latencyMs,
          engine: 'PostgreSQL 15 / Supabase',
        },
        redis: {
          status: redisHealth.status,
          driver: redisHealth.driver,
          endpoint: redisHealth.endpoint,
          latencyMs: redisHealth.latencyMs,
          ...(redisHealth.operations ? { operations: redisHealth.operations } : {}),
          ...(redisHealth.message ? { message: redisHealth.message } : {}),
        },
        firebase: {
          status: firebaseHealth.status,
          projectId: firebaseHealth.projectId,
          appsCount: firebaseHealth.appsCount,
          latencyMs: firebaseHealth.latencyMs,
          certsReachable: firebaseHealth.certsReachable,
          ...(firebaseHealth.message ? { message: firebaseHealth.message } : {}),
        },
        cloudflare_r2: {
          status: r2Health.status,
          bucket: r2Health.bucket,
          endpoint: r2Health.endpoint,
          publicUrl: r2Health.publicUrl,
        },
      },
    };
  }
}
