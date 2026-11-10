import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'API System & Database Health Check' })
  @SwaggerResponse({ status: 200, description: 'Service health status' })
  async checkHealth() {
    let dbStatus = 'disconnected';
    let dbLatencyMs: number | null = null;

    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - start;
      dbStatus = 'healthy';
    } catch {
      dbStatus = 'unreachable';
    }

    return {
      status: 'ok',
      service: 'ICMS Campus Suite API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
    };
  }
}

