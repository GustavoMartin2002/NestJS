import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { PersonModule } from 'src/person/person.module';
import { MyDynamicModule } from 'src/my-dynamic/my-dynamic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    PersonModule,
    MyDynamicModule.register({
      apiKey: 'example',
      apiUrl: 'https://example.com',
    }),
  ],
  controllers: [MessagesController],
  providers: [
    MessagesService,
  ],
})
export class MessagesModule {}
