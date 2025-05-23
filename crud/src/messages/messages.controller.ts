import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
  @Get('')
  findAll(@Query() paginationDto?: PaginationDto) {
    return this.messageService.findAll(paginationDto);
  }

  // find one message
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.finOne(id);
  }

  // create message
  @Post('')
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  // update message
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messageService.update(id, updateMessageDto);
  }

  // delete message
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.remove(id);
  }
}
