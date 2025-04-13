import { Injectable } from "@nestjs/common";

Injectable()
export class ConceptsManualService {
    sum(n1: number, n2: number): string {
        const result = n1+n2
        return `Value is: ${result} (MANUAL)`
    }
}