import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { PrismaService } from './common/prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

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
