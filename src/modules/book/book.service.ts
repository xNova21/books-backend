import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RecommendationsResponseDto } from '@/modules/recommendation/dto/recomendations.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '@/schemas/book.schema';
import { CreateBookDto } from './dto/createbook.dto';
@Injectable()
export class BookService {
  constructor(
    @Inject('RECOMMENDATION_SERVICE')
    private readonly client: ClientProxy,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const createdBook = new this.bookModel(createBookDto);
      return await createdBook.save();
    } catch (error: any) {
      throw new BadRequestException(
        'Error creating book: ' + (error?.message || error),
      );
    }
  }

  async findAll(page = 1, limit = 20): Promise<Book[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.bookModel.find().skip(skip).limit(limit).exec();
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Error fetching books: ' + (error?.message || error),
      );
    }
  }

  async findByGenre(genres: string[], page = 1, limit = 20): Promise<Book[]> {
    if (!Array.isArray(genres) || genres.length === 0) {
      throw new BadRequestException('Genres must be a non-empty array');
    }
    try {
      const skip = (page - 1) * limit;
      return await this.bookModel
        .find({ genres: { $all: genres } })
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Error fetching books by genre: ' + (error?.message || error),
      );
    }
  }

  async findByAuthor(author: string, page = 1, limit = 20): Promise<Book[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.bookModel
        .find({ author })
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Error fetching books by author: ' + (error?.message || error),
      );
    }
  }

  async findById(id: string): Promise<Book> {
    try {
      const book = await this.bookModel.findById(id).exec();
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return book;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Error fetching book by id: ' + (error?.message || error),
      );
    }
  }

  async getBookRecommendations(
    userId: string,
  ): Promise<RecommendationsResponseDto> {
    console.log('Fetching book recommendations for user:', userId);

    try {
      const recommendations: RecommendationsResponseDto = await lastValueFrom(
        this.client.send('get_recommendations', userId),
      );
      return recommendations;
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Error fetching recommendations: ' + (error?.message || error),
      );
    }
  }
}
