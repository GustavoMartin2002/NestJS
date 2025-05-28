import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('IsAdminGuard Ativo');
    const request = context.switchToHttp().getRequest();
    const role = request['user']?.role;

    // access routes (true or false)
    return role === 'admin';
  }
}
