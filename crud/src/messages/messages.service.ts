import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  private lastId = 1; // dynamic id for test
  private messages: Message[] = [
    {
      id: 1,
      text: 'text test 1',
      from: 'Gustavo',
      to: 'Mirele',
      read: true,
      date: new Date(),
    },
  ];

  // error function
  errorNotFound() {
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  // find all messages
  findAll() {
    if (!this.messages) {
      this.errorNotFound();
    }

    return this.messages;
  }

  // find one message
  finOne(id: number) {
    const findMessage = this.messages.find((message) => message.id === id);

    if (!findMessage) return this.errorNotFound();

    return findMessage;
  }

  // create message
  create(createMessage: CreateMessageDto) {
    this.lastId++;
    const id: number = this.lastId;

    const newMessage = {
      id,
      ...createMessage,
      read: false,
      date: new Date(),
    };

    try {
      this.messages.push(newMessage);
      return newMessage;
    } catch (e) {
      this.errorNotFound();
      console.log(e);
    }
  }

  // update message
  update(id: number, updateMessage: UpdateMessageDto) {
    const messageIndex = this.messages.findIndex(
      (message) => message.id === id,
    );

    if (messageIndex >= 0) {
      const oldMessage = this.messages[messageIndex];

      return {
        ...oldMessage,
        ...updateMessage,
      };
    }

    this.errorNotFound();
  }

  // delete message
  remove(id: number) {
    const messageIndex = this.messages.findIndex(
      (message) => message.id === id,
    );

    if (messageIndex >= 0) {
      return this.messages.splice(messageIndex, 1);
    }

    this.errorNotFound();
  }
}
