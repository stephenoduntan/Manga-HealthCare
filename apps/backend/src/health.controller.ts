import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { PrismaService } from './common/prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  getRootInfo() {
    return {
      status: 'ok',
      service: 'manga-healthcare-backend',
      version: '1.0.0-beta',
      docs: '/api/docs',
      health: '/api/v1/health',
      api_base: '/api/v1',
      db_connected: this.prisma.isConnected,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('api/v1/health')
  getApiHealth() {
    return {
      status: 'ok',
      service: 'manga-healthcare-backend',
      db_connected: this.prisma.isConnected,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('health')
  getRootHealth() {
    return this.getApiHealth();
  }
}
