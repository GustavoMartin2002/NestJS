import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfigMain from './app/config/app.config.main';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfigMain(app);

  if (process.env.NODE_ENV === 'production') {
    // HELMET -> security protocols HTTP
    app.use(helmet());
    // CORS -> Domain whitelisting requests
    app.enableCors({
      origin: process.env.ORIGIN,
    });
  }

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Messages API')
    .setDescription('API for managing messages')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
