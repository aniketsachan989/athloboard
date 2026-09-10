import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis as UpstashRedis } from '@upstash/redis';
import IORedis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public upstashClient: UpstashRedis | null = null;
  public ioRedisClient: IORedis | null = null;
  private endpointUrl: string = '';
  private driverType: 'upstash_rest' | 'ioredis_tcp' | 'none' = 'none';

  onModuleInit() {
    this.initClients();
  }

  initClients() {
    const upstashUrl = (
      process.env.UPSTASH_REDIS_REST_URL ||
      (process.env.REDIS_URL && process.env.REDIS_URL.startsWith('https://') ? process.env.REDIS_URL : '') ||
      ''
    ).trim();

    const upstashToken = (
      process.env.UPSTASH_REDIS_REST_TOKEN ||
      process.env.REDIS_TOKEN ||
      ''
    ).trim();

    const tcpRedisUrl = (
      process.env.REDIS_URL && !process.env.REDIS_URL.startsWith('https://') ? process.env.REDIS_URL : ''
    ).trim();

    if (upstashUrl.startsWith('https://') && upstashToken) {
      // 1. Upstash Native REST Client
      try {
        this.upstashClient = new UpstashRedis({
          url: upstashUrl,
          token: upstashToken,
        });
        this.endpointUrl = upstashUrl;
        this.driverType = 'upstash_rest';
        this.logger.log(`Upstash Redis REST Client initialized for endpoint: ${upstashUrl}`);
      } catch (err: any) {
        this.logger.error(`Failed to initialize Upstash REST Client: ${err.message}`);
      }
    } else if (tcpRedisUrl) {
      // 2. Standard Redis / Upstash TCP Client via ioredis
      try {
        this.ioRedisClient = new IORedis(tcpRedisUrl, {
          lazyConnect: true,
          connectTimeout: 3000,
          maxRetriesPerRequest: 1,
          retryStrategy: () => null,
        });
        this.endpointUrl = tcpRedisUrl.replace(/:[^:@]+@/, ':****@');
        this.driverType = 'ioredis_tcp';
        this.logger.log(`Redis TCP Client initialized for endpoint: ${this.endpointUrl}`);
      } catch (err: any) {
        this.logger.error(`Failed to initialize ioredis Client: ${err.message}`);
      }
    } else {
      this.logger.warn('No Upstash or Redis credentials configured in process.env (UPSTASH_REDIS_REST_URL / REDIS_URL)');
    }
  }

  async onModuleDestroy() {
    if (this.ioRedisClient) {
      await this.ioRedisClient.quit().catch(() => {});
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.upstashClient) {
      if (ttlSeconds) {
        await this.upstashClient.set(key, value, { ex: ttlSeconds });
      } else {
        await this.upstashClient.set(key, value);
      }
      return;
    }

    if (this.ioRedisClient) {
      if (ttlSeconds) {
        await this.ioRedisClient.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.ioRedisClient.set(key, value);
      }
      return;
    }

    throw new Error('Redis/Upstash client is not initialized. Check your environment variables.');
  }

  async get(key: string): Promise<string | null> {
    if (this.upstashClient) {
      const val = await this.upstashClient.get<string>(key);
      return val !== null ? String(val) : null;
    }

    if (this.ioRedisClient) {
      return await this.ioRedisClient.get(key);
    }

    throw new Error('Redis/Upstash client is not initialized.');
  }

  async del(key: string): Promise<void> {
    if (this.upstashClient) {
      await this.upstashClient.del(key);
      return;
    }

    if (this.ioRedisClient) {
      await this.ioRedisClient.del(key);
      return;
    }

    throw new Error('Redis/Upstash client is not initialized.');
  }

  /**
   * Health Check: Performs a real SET -> GET -> DEL cycle directly against Upstash / Redis
   */
  async checkHealth(): Promise<{
    status: 'connected' | 'error';
    driver: string;
    endpoint: string;
    latencyMs: number;
    operations?: string;
    message?: string;
  }> {
    const start = Date.now();

    if (!this.upstashClient && !this.ioRedisClient) {
      return {
        status: 'error',
        driver: 'None',
        endpoint: 'Not configured',
        latencyMs: 0,
        message: 'Missing UPSTASH_REDIS_REST_URL and REDIS_URL in environment',
      };
    }

    try {
      const testKey = `athloboard:health:test:${Date.now()}`;
      const testVal = 'ping_upstash_verified';

      // Real live operations against Upstash
      await this.set(testKey, testVal, 10);
      const readBack = await this.get(testKey);
      await this.del(testKey);

      const latency = Date.now() - start;

      if (readBack !== testVal) {
        return {
          status: 'error',
          driver: this.driverType === 'upstash_rest' ? '@upstash/redis (REST)' : 'ioredis (TCP)',
          endpoint: this.endpointUrl,
          latencyMs: latency,
          message: 'Data readback mismatch during live Redis health check',
        };
      }

      return {
        status: 'connected',
        driver: this.driverType === 'upstash_rest' ? '@upstash/redis (REST API)' : 'ioredis (TCP)',
        endpoint: this.endpointUrl,
        latencyMs: Math.max(latency, 1),
        operations: 'SET -> GET -> DEL verified live',
      };
    } catch (err: any) {
      this.logger.error(`Redis/Upstash Health Check failed: ${err.message}`);
      return {
        status: 'error',
        driver: this.driverType === 'upstash_rest' ? '@upstash/redis (REST)' : 'ioredis (TCP)',
        endpoint: this.endpointUrl || 'unreachable',
        latencyMs: Date.now() - start,
        message: err.message,
      };
    }
  }
}
