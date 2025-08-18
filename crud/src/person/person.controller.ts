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
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponsePersonDto } from './dto/response-person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  // @UseInterceptors(AddHeaderInterceptor)
  // @UseInterceptors(TimingConnectionInterceptor)
  // @UseInterceptors(ErrorHandlingInterceptor)
  // @UseInterceptors(SimpleCacheInterceptor)
  // @UseInterceptors(ChangeDataInterceptor)
  // @UseInterceptors(AuthTokenInterceptor)
  // @UseGuards(IsAdminGuard)
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all persons' })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 0,
    description: 'Pagination offset',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Pagination limit',
  })
  @ApiResponse({
    status: 200,
    description: 'Persons found successfully',
    type: [ResponsePersonDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Persons not found',
    example: new NotFoundException(),
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    // console.log(req['user']);
    // throw new BadRequestException('MENSAGEM')
    // console.log(url)
    // console.log(method);
    return this.personService.findAll(paginationDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find a person by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Person ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Person found successfully',
    type: ResponsePersonDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Person not found',
    example: new NotFoundException(),
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new person' })
  @ApiResponse({
    status: 201,
    description: 'Person created successfully',
    type: ResponsePersonDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: new BadRequestException(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - E-mail already registered',
    example: new ConflictException(),
  })
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a person by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Person ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Person updated successfully',
    type: ResponsePersonDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: new ForbiddenException(),
  })
  @ApiResponse({
    status: 404,
    description: 'Person not found',
    example: new NotFoundException(),
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonDto: UpdatePersonDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.personService.update(id, updatePersonDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a person by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Person ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Person deleted successfully',
    type: ResponsePersonDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: new ForbiddenException(),
  })
  @ApiResponse({
    status: 404,
    description: 'Person not found',
    example: new NotFoundException(),
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.personService.remove(id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Profile picture uploaded successfully',
    type: ResponsePersonDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: new BadRequestException(),
  })
  @ApiResponse({
    status: 404,
    description: 'Person not found',
    example: new NotFoundException(),
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  async uploadPicture(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /^image\/(jpeg|jpg|png)$/ })
        .addMaxSizeValidator({ maxSize: 10 * (1024 * 1024) })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.personService.uploadPicture(file, tokenPayload);
  }
}
