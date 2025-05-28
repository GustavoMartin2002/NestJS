import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware ativo');
    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        name: 'Gustavo',
        lastName: 'Lima Martin',
        role: 'admin',
      };
    }

    // res.setHeader('CABECALHO', 'Do Middleware');

    // return res.status(404).send({
    //   message: 'impossivel!!!',
    // });

    next(); // next middleware
    console.log('SimpleMiddleware desligado');

    return res.on('finish', () => {
      console.log('SimpleMiddleware: Conexão Finalizada!');
    });
  }
}
