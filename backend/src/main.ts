import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('AthloboardAPI');
  const app = await NestFactory.create(AppModule);

  // Enable CORS across all frontends (Mobile app, Web portal, Admin console)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Athloboard Unified Backend API')
    .setDescription("India's Federated Athletic Strength & Verification Ecosystem API")
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Firebase-JWT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`⚡ Athloboard Backend API is running on http://localhost:${port}`);
  logger.log(`📖 Swagger API Docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
