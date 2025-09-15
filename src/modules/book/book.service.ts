import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RecommendationsResponse } from '../recomendation/interfaces/recomendations.interface';
@Injectable()
export class BookService {
  constructor(
    @Inject('RECOMMENDATION_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async getBookRecommendations(
    userId: string,
  ): Promise<RecommendationsResponse> {
    const recommendations: RecommendationsResponse = await lastValueFrom(
      this.client.send('get_recommendations', userId),
    );

    // retornamos directamente al usuario HTTP
    return recommendations;
  }
}
