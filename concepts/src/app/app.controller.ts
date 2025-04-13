import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('home') // /home
export class AppController {
  // injection dependencies
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome(): string {
    return 'Home Page';
  }

  // solicitation method -> READ
  @Get('hello') // /home/hello
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('example')
  getExample(): string {
    return 'Example this route';
  }
}
