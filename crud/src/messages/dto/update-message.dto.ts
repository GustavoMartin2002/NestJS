import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly text: string; // this input is not optional

  @IsBoolean()
  readonly read?: boolean;
}
