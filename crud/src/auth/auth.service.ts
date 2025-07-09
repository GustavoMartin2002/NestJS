import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { Person } from 'src/person/entities/person.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly hashingService: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const person = await this.personRepository.findOneBy({
      email: loginDto.email,
      active: true,
    });

    if (!person) throw new UnauthorizedException('Email inválido!');
    
    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      person.passwordHash,
    );

    if (!passwordIsValid) throw new UnauthorizedException('Senha inválida!');

    return this.createTokens(person);
  }

  private async createTokens(person: Person) {
    const accessTokenPromise = await this.signJwtAsync(
      person.id, 
      this.jwtConfiguration.jwtTtl, 
      { email: person.email },
    );

    const refreshTokenPromise = await this.signJwtAsync(
      person.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise
    ]);
    
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      )

      const person = await this.personRepository.findOneBy({
        id: sub,
        active: true,
      });

      if(!person) throw new Error('Usuário não autorizado.')

      return this.createTokens(person);
    } catch(error) {
      throw new UnauthorizedException(error.message);
    }
  }

  private async signJwtAsync<T>(sub:number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      }
    );
  }
}
