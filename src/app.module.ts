import { Module } from '@nestjs/common';
import { BookModule } from '@/modules/book/book.module';
import { RecommendationModule } from '@/modules/recommendation/recommendation.module';
import { UserModule } from '@/modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    BookModule,
    RecommendationModule,
    UserModule,
    SeedModule,
  ],
})
export class AppModule {}
