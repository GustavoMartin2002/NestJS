import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";
import { Repository } from "typeorm";
import { Person } from "src/person/entities/person.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if(!token) throw new UnauthorizedException('Usuário não logado!');

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );

      const person = await this.personRepository.findOneBy({
        id: payload.sub,
        active: true,
      });

      if(!person) throw new UnauthorizedException('Usuário não autorizado!');

      payload['person'] = person;

      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') return;

    return authorization.split(' ')[1];
  }
}