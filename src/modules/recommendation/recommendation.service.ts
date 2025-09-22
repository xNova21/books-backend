// recommendation.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/schemas/user.schema';
import { Book } from '@/schemas/book.schema';
import { RecommendationsResponseDto } from '@/modules/recommendation/dto/recomendations.dto';
import { Category } from '@/schemas/category.schema';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async getCategories(): Promise<void> {
    const books = this.bookModel.find().lean();
    const categorySet = new Set<string>();
    (await books).forEach((book) => {
      book.genre?.forEach((g) => categorySet.add(g));
    });

    const categories = Array.from(categorySet).map((name) => ({ name }));
    await this.categoryModel.deleteMany({});
    await this.categoryModel.insertMany(categories);
  }

  async getRecommendations(
    userId: string,
  ): Promise<RecommendationsResponseDto> {
    const response = { yourBooks: [], popular: [], category: {} };

    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'books.bookId', select: 'genre' })
      .exec();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    interface PopulatedBook {
      genre?: string[];
    }
    interface UserBook {
      bookId?: PopulatedBook | string;
    }

    const genreCount: Record<string, number> = {};
    (user.books as UserBook[]).forEach((ub) => {
      if (
        ub.bookId &&
        typeof ub.bookId === 'object' &&
        Array.isArray(ub.bookId.genre)
      ) {
        ub.bookId.genre?.forEach((g) => {
          genreCount[g] = (genreCount[g] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    console.log('Géneros más leídos:', topGenres);

    const popularBooks = await this.bookModel
      .find()
      .select('id title author rating genre isbn')
      .sort({ rating: -1 })
      .limit(10)
      .lean();
    response.popular = popularBooks;

    for (const genre of topGenres) {
      const categoryBooks = await this.bookModel
        .find({ genre })
        .select('id title author rating genre isbn')
        .sort({ rating: -1 })
        .limit(3)
        .lean();
      response.yourBooks.push(...categoryBooks);
    }

    // Deduplicate books by their _id
    response.yourBooks = response.yourBooks.filter(
      (book, index, self) =>
        self.findIndex((b) => String(b.isbn) === String(book.isbn)) === index,
    );

    const allGenres = await this.categoryModel.find().lean();
    console.log('All genres from DB:', allGenres);
    await Promise.all(
      allGenres.map(async (cat) => {
        const categoryBooks = await this.bookModel
          .find({ genre: { $in: [cat.name] } })
          .select('id title author rating genre isbn')
          .sort({ rating: -1 })
          .limit(5)
          .lean();
        response.category[cat.name] = categoryBooks;
      }),
    );

    return response;
  }
}
