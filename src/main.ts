import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3004);
  
  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('LOCF API')
    .setDescription('LOCF API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`API Documentation: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
