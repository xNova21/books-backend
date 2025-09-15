import { Module } from '@nestjs/common';
import { RecomendationController } from '@/modules/recomendation/recomendation.controller';
import { RecomendationService } from '@/modules/recomendation/recomendation.service';

@Module({
  imports: [],
  controllers: [RecomendationController],
  providers: [RecomendationService],
})
export class RecomendationModule {}
