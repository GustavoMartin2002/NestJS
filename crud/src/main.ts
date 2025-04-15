/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //  remove keys that are not in dto
      forbidNonWhitelisted: true, // displays error when key does not exist
      transform: false, // tries to transform parameter types and dtos
    }),
  ); //create new validation in application
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
