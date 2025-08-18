import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseTokensDto } from './dto/response-tokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 201,
    description: 'User logged in successfully',
    type: ResponseTokensDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: new UnauthorizedException(),
  })
  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh user tokens' })
  @ApiResponse({
    status: 201,
    description: 'Tokens refreshed successfully',
    type: ResponseTokensDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    example: new UnauthorizedException(),
  })
  @Post('refresh')
  refreshTokens(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshToken);
  }
}
