import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonService } from 'src/person/person.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

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
  async findOne(id: number) {
    try {
      const message = await this.messageRepository.findOne({
        where: { 
          id,
        },
        relations: ['from', 'to'],
        order: {
          id:'desc'
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

      if (!message) {
        throw new NotFoundException('Mensagem não encontrada.');
      }

      return message;
    } catch {
      return this.errorNotFound();
    }
  }

  // create message
  async create(createMessageDto: CreateMessageDto, tokenPayload: TokenPayloadDto) {
    try {
      const { toId } = createMessageDto;
      const from = await this.personSevice.findOne(tokenPayload.sub);
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
          name: message.from.name,
        },
        to: {
          id: message.to.id,
          name: message.to.name,
        },
      };
    } catch {
      return this.errorNotFound();
    }
  }

  // update message
  async update(id: number, updateMessageDto: UpdateMessageDto, tokenPayload: TokenPayloadDto) {
    try {
      const message = await this.findOne(id);

      if (!message) throw new NotFoundException('Mensagem não encontrada.');
      if (message.from.id !== tokenPayload.sub) throw new ForbiddenException('Você não tem autorização para atualizar essa mensagem.');

      message.text = updateMessageDto?.text ?? message.text;
      message.read = updateMessageDto?.read ?? message.read;

      await this.messageRepository.save(message);
      return message;
    } catch {
      return this.errorNotFound();
    }
  }

  // delete message
  async remove(id: number, tokenPayload: TokenPayloadDto) {
    try {
      const message = await this.findOne(id);

      if (!message) throw new NotFoundException('Mensagem não encontrada.');
      if (message.from.id !== tokenPayload.sub) throw new ForbiddenException('Você não tem autorização para deletar essa mensagem.');

      await this.messageRepository.remove(message);
      return message;
    } catch {
      return this.errorNotFound();
    }
  }
}
