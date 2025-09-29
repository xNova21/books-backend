import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
// Extiende el tipo Request para incluir userId
interface AuthenticatedRequest extends ExpressRequest {
  userId?: string;
}
import { BookService } from '@/modules/book/book.service';
import { CreateBookDto } from './dto/createbook.dto';
import { Book } from '@/schemas/book.schema';
import { RecommendationsResponseDto } from '../recommendation/dto/recomendations.dto';
import { AuthGuard } from '@/midleware/auth.guard';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // Endpoint to create a new book
  @Post()
  async createBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.createBook(createBookDto);
  }

  // Endpoint to get a book by ID
  @UseGuards(AuthGuard)
  @Get('recommendation')
  async getBookRecommendations(
    @Req() req: AuthenticatedRequest,
  ): Promise<RecommendationsResponseDto> {
    return this.bookService.getBookRecommendations(req.userId);
  }
}
