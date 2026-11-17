import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private _isConnected = false;

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this._isConnected = true;
      this.logger.log('Prisma Client connected to PostgreSQL database successfully.');
    } catch (error: any) {
      this._isConnected = false;
      this.logger.warn(
        `Prisma database connection unavailable at startup (${error?.message || error}). Fallback/mock mode active where applicable.`,
      );
    }
  }

  async onModuleDestroy() {
    if (this._isConnected) {
      await this.$disconnect();
    }
  }

  get isConnected(): boolean {
    return this._isConnected;
  }
}
