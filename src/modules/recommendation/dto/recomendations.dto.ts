export class BookDto {
  id: string;
  title: string;
  author: string;
  score?: number;
  category?: string;
}

export class RecommendationsResponseDto {
  yourBooks: BookDto[];

  category: {
    [categoryName: string]: BookDto[];
  };

  popular?: BookDto[];
}
