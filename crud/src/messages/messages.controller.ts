import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseMessageDto } from './dto/response-message.dto';

// CRUD
// Create -> POST -> create message
// Read -> GET -> read all messages
// Read -> GET -> read one message
// Update -> PATCH / PUT -> update message
// Delete -> DELETE -> delete message

// PATCH -> update data in parts
// PUT   -> update all data

// DTO - Data Transfer Object
// DTO -> simple object -> nestjs: data validation / data tranform
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  // find all messages
  // @HttpCode(200)
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all messages' })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 1,
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
    description: 'Messages found',
    type: [ResponseMessageDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Messages not found',
    example: new NotFoundException(),
  })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.messageService.findAll(paginationDto);
  }

  // find one message
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find one message by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Message ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Message found',
    type: ResponseMessageDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    example: new NotFoundException(),
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.findOne(id);
  }

  // create message
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({
    status: 201,
    description: 'Message created',
    type: ResponseMessageDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    example: new BadRequestException(),
  })
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.create(createMessageDto, tokenPayload);
  }

  // update message
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a message by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Message ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Message updated',
    type: ResponseMessageDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: new ForbiddenException(),
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    example: new NotFoundException(),
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.update(id, updateMessageDto, tokenPayload);
  }

  // delete message
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Message ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Message deleted',
    type: ResponseMessageDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: new ForbiddenException(),
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
    example: new NotFoundException(),
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.remove(id, tokenPayload);
  }
}
