import { Module } from '@nestjs/common';
import { RecommendationService } from '@/modules/recommendation/recommendation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from '@/schemas/book.schema';
import { RecommendationController } from '@/modules/recommendation/recommendation.controller';
import { Category, CategorySchema } from '@/schemas/category.schema';
import { User, UserSchema } from '@/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Category.name, schema: CategorySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
