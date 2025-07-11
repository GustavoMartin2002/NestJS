import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from '../messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from 'src/person/person.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from 'src/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env',
      // ignoreEnvFile: true,
      // load: [appConfig],
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.required(),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_DATABASE: Joi.required(),
        DATABASE_AUTO_LOAD_ENTITIES: Joi.number().min(0).max(1).default(0),
        DATABASE_SYNCHRONIZE: Joi.number().min(0).max(1).default(0),
      }),
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'postgres', 
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      autoLoadEntities: Boolean(process.env.DATABASE_AUTO_LOAD_ENTITIES), // loading entities without the need to specify
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // synchronize with the database. Do not use in production.
    }),
    ServeStaticModule.forRoot({
      rootPath:path.resolve(__dirname, '..', '..', 'pictures'),
      serveRoot: '/pictures',
    }),
    MessagesModule,
    PersonModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: ErrorExceptionFilter,
    // },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(SimpleMiddleware).forRoutes({
  //     path: '*',
  //     method: RequestMethod.ALL,
  //   });
  // }
}
