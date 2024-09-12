import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonConfig } from './config/winston.config';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create(AppModule, { logger });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Api Wallet')
    .setDescription('The Teste Back-End API description')
    .setVersion('1.0')
    .addTag('Back-End')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.API_PORT);
}
bootstrap();
