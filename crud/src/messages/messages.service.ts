import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from 'src/person/person.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

// Scope.DEFAULT -> the provider is a singleton
// Scope.REQUEST -> the provider is instantiated on each request
// Scope.TRANSIENT -> an instance of the provider is created in each class that injects that provider

@Injectable({ scope: Scope.DEFAULT })
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly personSevice: PersonService,
  ) {}

  // error function
  errorNotFound() {
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  // find all messages
  async findAll(paginationDto?: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto ?? {};
      const messages = await this.messageRepository.find({
        take: limit, // page display
        skip: offset, // skipped records
        relations: ['from', 'to'],
        order: {
          id: 'desc',
        },
        select: {
          from: {
            id: true,
            name: true,
          },
          to: {
            id: true,
            name: true,
          },
        },
      });
      return messages;
    } catch {
      return this.errorNotFound();
    }
  }

  // find one message
  async finOne(id: number) {
    try {
      const message = await this.messageRepository.findOneBy({
        id,
      });

      if (!message) {
        throw new NotFoundException('Mensagem não encontrada.');
      }

      return message;
    } catch {
      return this.errorNotFound();
    }
  }

  // create message
  async create(createMessageDto: CreateMessageDto) {
    try {
      const { fromId, toId } = createMessageDto;
      const from = await this.personSevice.findOne(fromId);
      const to = await this.personSevice.findOne(toId);

      if (!from || from instanceof NotFoundException) {
        throw new NotFoundException('Remetente não encontrado.');
      }
      if (!to || to instanceof NotFoundException) {
        throw new NotFoundException('Destinatário não encontrado.');
      }

      const newMessage = {
        text: createMessageDto.text,
        from,
        to,
        read: false,
        date: new Date(),
      };

      const message = this.messageRepository.create(newMessage);
      await this.messageRepository.save(message);

      return {
        ...message,
        from: {
          id: message.from.id,
        },
        to: {
          id: message.to.id,
        },
      };
    } catch {
      return this.errorNotFound();
    }
  }

  // update message
  async update(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      const message = await this.finOne(id);

      if (!message) return new NotFoundException('Mensagem não encontrada.');

      message.text = updateMessageDto?.text ?? message.text;
      message.read = updateMessageDto?.read ?? message.read;

      await this.messageRepository.save(message);
      return message;
    } catch {
      return this.errorNotFound();
    }
  }

  // delete message
  async remove(id: number) {
    try {
      const message = await this.messageRepository.findOneBy({
        id,
      });

      if (!message) return new NotFoundException('Mensagem não encontrada.');

      await this.messageRepository.remove(message);
      return message;
    } catch {
      return this.errorNotFound();
    }
  }
}
