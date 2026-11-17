import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private isRedisConnected = false;

  // In-memory fallback stores
  private memoryStore = new Map<string, { value: string; expiresAt?: number }>();
  private memoryQueues = new Map<string, any[]>();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (redisUrl && !redisUrl.includes('localhost:6379')) {
      try {
        this.client = new Redis(redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          connectTimeout: 2000,
        });

        await this.client.connect();
        this.isRedisConnected = true;
        this.logger.log('Connected to remote Redis instance successfully.');
      } catch (err: any) {
        this.logger.warn(`Redis connection failed (${err?.message}). Using resilient in-memory fallback.`);
        this.isRedisConnected = false;
        this.client = null;
      }
    } else {
      this.logger.log('Using in-memory store for OTP & Queue state (development/testing mode).');
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isRedisConnected && this.client) {
      try {
        return await this.client.get(key);
      } catch (e) {
        this.logger.error(`Redis GET error for key ${key}, falling back to memory:`, e);
      }
    }

    const item = this.memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.isRedisConnected && this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (e) {
        this.logger.error(`Redis SET error for key ${key}, falling back to memory:`, e);
      }
    }

    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.memoryStore.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    if (this.isRedisConnected && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch (e) {
        this.logger.error(`Redis DEL error for key ${key}, falling back to memory:`, e);
      }
    }
    this.memoryStore.delete(key);
  }

  // Queue Operations for Instant Lobby ("Talk to Doctor Now")
  async pushQueue(queueName: string, item: any): Promise<number> {
    const payload = typeof item === 'string' ? item : JSON.stringify(item);

    if (this.isRedisConnected && this.client) {
      try {
        return await this.client.rpush(queueName, payload);
      } catch (e) {
        this.logger.error(`Redis RPUSH error for queue ${queueName}:`, e);
      }
    }

    if (!this.memoryQueues.has(queueName)) {
      this.memoryQueues.set(queueName, []);
    }
    const q = this.memoryQueues.get(queueName)!;
    q.push(payload);
    return q.length;
  }

  async popQueue(queueName: string): Promise<any | null> {
    if (this.isRedisConnected && this.client) {
      try {
        const item = await this.client.lpop(queueName);
        if (!item) return null;
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      } catch (e) {
        this.logger.error(`Redis LPOP error for queue ${queueName}:`, e);
      }
    }

    const q = this.memoryQueues.get(queueName);
    if (!q || q.length === 0) return null;
    const item = q.shift();
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  }

  async getQueue(queueName: string): Promise<any[]> {
    if (this.isRedisConnected && this.client) {
      try {
        const items = await this.client.lrange(queueName, 0, -1);
        return items.map((i) => {
          try {
            return JSON.parse(i);
          } catch {
            return i;
          }
        });
      } catch (e) {
        this.logger.error(`Redis LRANGE error for queue ${queueName}:`, e);
      }
    }

    const q = this.memoryQueues.get(queueName) || [];
    return q.map((i) => {
      try {
        return JSON.parse(i);
      } catch {
        return i;
      }
    });
  }

  async getQueueLength(queueName: string): Promise<number> {
    if (this.isRedisConnected && this.client) {
      try {
        return await this.client.llen(queueName);
      } catch (e) {
        this.logger.error(`Redis LLEN error for queue ${queueName}:`, e);
      }
    }

    const q = this.memoryQueues.get(queueName);
    return q ? q.length : 0;
  }

  async removeFromQueue(queueName: string, identifierKey: string, identifierValue: string): Promise<boolean> {
    const items = await this.getQueue(queueName);
    const index = items.findIndex((it) => it[identifierKey] === identifierValue);
    if (index === -1) return false;

    if (this.isRedisConnected && this.client) {
      try {
        const raw = JSON.stringify(items[index]);
        await this.client.lrem(queueName, 1, raw);
        return true;
      } catch (e) {
        this.logger.error(`Redis LREM error for queue ${queueName}:`, e);
      }
    }

    const q = this.memoryQueues.get(queueName);
    if (q) {
      q.splice(index, 1);
      return true;
    }
    return false;
  }
}
