import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfigMain from './app/config/app.config.main';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfigMain(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
