import {
  Body,
  Controller,
  Delete,
  Get,
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
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { RoutePolicies } from 'src/auth/enum/route-policies.enum';

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
  constructor(
    private readonly messageService: MessagesService,
  ) {}

  // find all messages
  // @HttpCode(200)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.messageService.findAll(paginationDto);
  }

  // find one message
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.findOne(id);
  }

  // create message
  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.create(createMessageDto, tokenPayload);
  }

  // update message
  @UseGuards(AuthTokenGuard)
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
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.messageService.remove(id, tokenPayload);
  }
}
