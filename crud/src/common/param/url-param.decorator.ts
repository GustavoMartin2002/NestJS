import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UrlParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request = context.getRequest();
    return request.url;
  },
);
