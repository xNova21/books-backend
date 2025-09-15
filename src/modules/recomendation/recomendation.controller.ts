import { Body, Controller } from '@nestjs/common';
import { RecomendationService } from '@/modules/recomendation/recomendation.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('recomendation')
export class RecomendationController {
  constructor(private readonly recomendationService: RecomendationService) {}

  // escucha las peticiones de redis
  @MessagePattern('get_recomendations')
  async getRecomendations(data: { userId: string }): Promise<string> {
    return await this.recomendationService.getRecomendation(data.userId);
  }
}
