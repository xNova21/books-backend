export class CreateBookDto {
  title: string;
  author: string;
  publishedYear: number;
  genre?: string[];
  summary?: string;
  rating?: number;
  coverImageUrl?: string;
  isbn: string;
  publisher?: string;
  pages?: number;
}
