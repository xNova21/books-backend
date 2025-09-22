import { Module } from '@nestjs/common';
import { BookController } from '@/modules/book/book.controller';
import { BookService } from '@/modules/book/book.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Book, BookSchema } from '@/schemas/book.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RECOMMENDATION_SERVICE',
        transport: Transport.REDIS,
        options: { host: 'localhost', port: 6379 },
      },
    ]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
