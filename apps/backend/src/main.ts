import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('MangaHealthcareAPI');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
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

  // Serve uploaded files (e-prescription PDFs and rash/wound images)
  const uploadsPath = path.resolve(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Swagger OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('MANGA HEALTHCARE — Telemedicine Backend API')
    .setDescription(
      'Core clinical backend engine for Manga Healthcare Beta. Supports Auth & OTP, Emergency-Symptom Triage, Instant Lobby Queue, Paystack/Flutterwave Payments, Consultations, E-Prescriptions with MDCN stamps, and NDPR Auditing.',
    )
    .setVersion('1.0.0-beta')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`MANGA HEALTHCARE Backend running on http://localhost:${port}`);
  logger.log(`API Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
