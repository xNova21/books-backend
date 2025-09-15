import { Module } from '@nestjs/common';
import { BookModule } from '@/modules/book/book.module';
import { RecomendationModule } from '@/modules/recomendation/recomendation.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [BookModule, RecomendationModule, UserModule],
})
export class AppModule {}
