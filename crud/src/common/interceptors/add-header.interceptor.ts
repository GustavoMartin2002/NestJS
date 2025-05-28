import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AddHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('AddHeaderInterceptor executado.');

    const response = context.switchToHttp().getResponse();
    response.setHeader('MyHeader', 'value Header');

    return next.handle();
  }
}
