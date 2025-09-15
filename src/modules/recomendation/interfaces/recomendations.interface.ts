export interface Book {
  id: string;
  title: string;
  author: string;
  score?: number;
  category?: string;
}

export interface RecommendationsResponse {
  yourBooks: Book[];

  otherUsers: Book[];

  category: {
    [categoryName: string]: Book[];
  };

  popular?: Book[];
}
