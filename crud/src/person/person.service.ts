import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { HashingServiceProtocol } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  async create(createPersonDto: CreatePersonDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPersonDto.password,
      );

      const personData = {
        name: createPersonDto.name,
        email: createPersonDto.email,
        passwordHash,
      };

      const newPerson = this.personRepository.create(personData);
      await this.personRepository.save(newPerson);

      return newPerson;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já está cadastrado.');
      }

      throw error;
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto ?? {};
    const person = await this.personRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: 'asc',
      },
    });

    if (!person) throw new NotFoundException('Pessoas não encontradas.');

    return person;
  }

  async findOne(id: number) {
    const person = await this.personRepository.findOneBy({
      id,
    });

    if (!person) throw new NotFoundException('Pessoa não encontrada.');

    return person;
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
    tokenPayload: TokenPayloadDto,
  ) {
    const personData = {
      name: updatePersonDto?.name,
    };

    if (updatePersonDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePersonDto.password,
      );
      personData['passwordHash'] = passwordHash;
    }

    const person = await this.personRepository.preload({
      id,
      ...personData,
    });

    if (!person) throw new NotFoundException('Pessoa não encontrada.');
    if (person.id !== tokenPayload.sub)
      throw new ForbiddenException('Você não tem autorização para atualizar.');

    await this.personRepository.save(person);
    return person;
  }

  async remove(id: number, tokenPayload: TokenPayloadDto) {
    const person = await this.findOne(id);

    if (!person) throw new NotFoundException('Pessoa não encontrada.');
    if (person.id !== tokenPayload.sub)
      throw new ForbiddenException('Você não tem autorização para atualizar.');

    await this.personRepository.remove(person);
    return person;
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    if (file.size < 1024)
      throw new BadRequestException('Arquivo muito pequeno!');

    const person = await this.findOne(tokenPayload.sub);
    if (!person) throw new NotFoundException('Falha ao encontrar usuário.');

    const fileExtension = path
      .extname(file.originalname)
      .toLowerCase()
      .substring(1);
    const fileName = `${tokenPayload.sub}.${fileExtension}`;
    const fileFullPath = path.resolve(process.cwd(), 'pictures', fileName);

    await fs.writeFile(fileFullPath, file.buffer);

    person.picture = fileName;
    await this.personRepository.save(person);

    return person;
  }
}
