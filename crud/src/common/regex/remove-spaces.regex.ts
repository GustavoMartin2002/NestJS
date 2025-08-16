import { Injectable } from '@nestjs/common';
import { RegexProtocol } from './regex.protocol';

@Injectable()
export class RemoveSpacesRegex extends RegexProtocol {
  execute(str: string): string {
    return str.replace(/\s+/g, '');
  }
}
