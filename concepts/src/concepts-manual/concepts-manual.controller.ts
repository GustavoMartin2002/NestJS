import { ConceptsManualService } from './concepts-manual.service';
import { Controller, Get } from '@nestjs/common';

@Controller('concepts-manual')
export class ConceptsManualController {
  constructor(private readonly conceptsManualService: ConceptsManualService) {}

  @Get()
  homeConcepts(): string {
    return 'Home Concepts Manual';
  }

  @Get('sum')
  sumManual(): string {
    return this.conceptsManualService.sum(50, 50)
  }

}
