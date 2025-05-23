import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  // error function
  errorNotFound() {
    throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
  }

  async create(createPersonDto: CreatePersonDto) {
    try {
      const personData = {
        name: createPersonDto.name,
        email: createPersonDto.email,
        passwordHash: createPersonDto.password,
      };
      const newPerson = this.personRepository.create(personData);
      await this.personRepository.save(newPerson);
      return newPerson;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já está cadastrado.');
      } else {
        return this.errorNotFound();
      }
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto ?? {};
      const person = await this.personRepository.find({
        take: limit,
        skip: offset,
        order: {
          id: 'asc',
        },
      });

      if (!person) return new NotFoundException('Pessoa não encontrada.');

      return person;
    } catch {
      return this.errorNotFound();
    }
  }

  async findOne(id: number) {
    try {
      const person = await this.personRepository.findOneBy({
        id,
      });

      if (!person) return new NotFoundException('Pessoa não encontrada.');

      return person;
    } catch {
      return this.errorNotFound();
    }
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    try {
      const personData = {
        name: updatePersonDto?.name,
        passwordHash: updatePersonDto.password,
      };

      const person = await this.personRepository.preload({
        id,
        ...personData,
      });

      if (!person) return new NotFoundException('Pessoa não encontrada.');

      await this.personRepository.save(person);
      return person;
    } catch {
      return this.errorNotFound();
    }
  }

  async remove(id: number) {
    try {
      const person = await this.personRepository.findOneBy({
        id,
      });

      if (!person) return new NotFoundException('Pessoa não encontrada.');

      await this.personRepository.remove(person);

      return person;
    } catch {
      return this.errorNotFound();
    }
  }
}
