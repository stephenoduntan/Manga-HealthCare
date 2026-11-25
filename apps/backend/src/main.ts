import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';
import { ConsultationChatGateway } from './consultations/chat.gateway';

function isAllowedOrigin(origin: string | undefined, configuredOrigins: string[]): boolean {
  if (!origin) return true; // Mobile apps, server-to-server webhooks, curl
  if (configuredOrigins.includes('*') || configuredOrigins.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return (
      hostname === 'mangahealthcare.com' ||
      hostname.endsWith('.mangahealthcare.com') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.localhost')
    );
  } catch {
    return false;
  }
}

async function bootstrap() {
  const logger = new Logger('MangaHealthcareAPI');
  const app = await NestFactory.create(AppModule);

  // Security headers (Helmet-equivalent baseline)
  app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  // Subdomain CORS whitelist
  const configuredOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (isAllowedOrigin(origin, configuredOrigins)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not permitted by CORS`), false);
      }
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Serve uploaded files locally when S3 is not configured
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Swagger OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('MANGA HEALTHCARE — Telemedicine Backend API')
    .setDescription(
      'Core clinical backend engine for Manga Healthcare Beta. Supports Auth & OTP, Emergency-Symptom Triage, Instant Lobby Queue, Paystack/Flutterwave Payments, Consultations, Clinical Docs & E-Prescriptions, Partners, Admin Ops, and NDPR Auditing.',
    )
    .setVersion('1.0.0-beta')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 4000;
  const httpServer = app.getHttpServer();
  app.get(ConsultationChatGateway).attach(httpServer);

  await app.listen(port, '0.0.0.0');
  logger.log(`MANGA HEALTHCARE Backend running on http://0.0.0.0:${port}`);
  logger.log(`API Documentation available at http://0.0.0.0:${port}/api/docs`);
}

bootstrap();
