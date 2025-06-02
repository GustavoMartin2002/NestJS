import { Injectable } from "@nestjs/common";
import { RegexProtocol } from "./regex.protocol";

@Injectable()
export class OnlyLowercaseLettersRegex extends RegexProtocol {
  execute(str: string): string {
    return str.replace(/[^a-z]/g, '');
  }
}