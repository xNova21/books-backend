import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';
import { CreateBookDto } from './dto/createbook.dto';
import { Book } from '@/schemas/book.schema';
import { RecommendationsResponseDto } from '../recommendation/dto/recomendations.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // Endpoint to create a new book
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(createBookDto);
  }

  // Endpoint to get a book by ID
  @Get('recommendation/:id')
  async getBookRecommendations(
    @Param('id') id: string,
  ): Promise<RecommendationsResponseDto> {
    return this.bookService.getBookRecommendations(id);
  }
}
