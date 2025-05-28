import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class AnotherMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('AnotherMiddleware ativo');
    // const authorization = req.headers?.authorization;

    // if (authorization) {
    //   req['user'] = {
    //     name: 'Gustavo',
    //     lastName: 'Lima Martin',
    //   };
    // }

    // res.setHeader('CABECALHO', 'Do Middleware');

    // return res.status(404).send({
    //   message: 'impossivel!!!',
    // });

    next();
    console.log('AnotherMiddleware desligado');
  }
}
