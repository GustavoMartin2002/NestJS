import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  // @UseInterceptors(AddHeaderInterceptor)
  // @UseInterceptors(TimingConnectionInterceptor)
  // @UseInterceptors(ErrorHandlingInterceptor)
  // @UseInterceptors(SimpleCacheInterceptor)
  // @UseInterceptors(ChangeDataInterceptor)
  // @UseInterceptors(AuthTokenInterceptor)
  // @UseGuards(IsAdminGuard)
  @UseGuards(AuthTokenGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    // console.log(req['user']);
    // throw new BadRequestException('MENSAGEM')
    // console.log(url)
    // console.log(method);
    return this.personService.findAll(paginationDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.personService.update(id, updatePersonDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.personService.remove(id, tokenPayload);
  }
}
