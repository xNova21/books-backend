import { Injectable } from '@nestjs/common';

@Injectable()
export class RecomendationService {
  async getRecomendation(userId: string): Promise<string> {

    // TODO: implementar logica de recomendacion
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula una operacion asincrona
    return `Recomendation for user ${userId}`;
  }
}
