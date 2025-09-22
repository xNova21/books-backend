import { Body, Controller } from '@nestjs/common';
import { RecommendationService } from '@/modules/recommendation/recommendation.service';
import { MessagePattern } from '@nestjs/microservices';
import { RecommendationsResponseDto } from './dto/recomendations.dto';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  // escucha las peticiones de redis
  @MessagePattern('get_recommendations')
  async getRecommendations(
    userId: string,
  ): Promise<RecommendationsResponseDto> {
    console.log('Controller: getRecommendations recibido', userId);
    return await this.recommendationService.getRecommendations(userId);
  }
}
