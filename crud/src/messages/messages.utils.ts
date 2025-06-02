import { Injectable } from "@nestjs/common";

@Injectable()
export class MessageUtils {
  reverseString(str: string) {
    return str.split('').reverse().join('');
  }
}

@Injectable()
export class MessageUtilsMock {
  reverseString(str: string) {
    return str
  }
}