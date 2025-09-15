import { Module } from '@nestjs/common';
import { BookModule } from '@/modules/book/book.module';
import { RecomendationModule } from '@/modules/recomendation/recomendation.module';
import { UserModule } from '@/modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    BookModule,
    RecomendationModule,
    UserModule,
  ],
})
export class AppModule {}
