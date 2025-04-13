import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceptsAutomaticService {
    sum(n1: number = 50, n2: number = 50): string{
        const result = n1+n2 
        return `Value is: ${result} (AUTOMATIC)`
    }
}
