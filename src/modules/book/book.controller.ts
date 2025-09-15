import { Controller } from '@nestjs/common';
import { BookService } from '@/modules/book/book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // Aquí podrías definir métodos para manejar las solicitudes relacionadas con libros
}
