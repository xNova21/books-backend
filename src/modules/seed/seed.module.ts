import { Module, OnModuleInit } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from '@/schemas/user.schema';
import { Book, BookSchema } from '@/schemas/book.schema';
import { Category, CategorySchema } from '@/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
})
export class SeedModule implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async onModuleInit() {
    // Evitar duplicados si ya hay datos
    const count = await this.userModel.countDocuments();
    if (count > 0) {
      console.log('Seed: ya existen usuarios, no se insertan datos');
      // buscar si existe el user de test y si existe lo borra para no romper los tests
      await this.userModel.deleteMany({
        email: { $in: ['testuser@example.com', 'newemail@example.com'] },
      });
      return;
    }

    console.log('Seed: creando datos de prueba...');

    // Crear libros de ejemplo
    const books = await this.bookModel.insertMany([
      {
        title: 'El Señor de los Anillos',
        author: 'J.R.R. Tolkien',
        publishedYear: 1954,
        genre: ['Fantasy'],
        summary: 'Una aventura épica en la Tierra Media.',
        rating: 5,
        coverImageUrl: 'https://example.com/lotr.jpg',
        isbn: '9780261102385',
        publisher: 'Allen & Unwin',
        pages: 1178,
      },
      {
        title: '1984',
        author: 'George Orwell',
        publishedYear: 1949,
        genre: ['Dystopia', 'Political Fiction'],
        summary: 'Una sociedad vigilada bajo un régimen totalitario.',
        rating: 4,
        coverImageUrl: 'https://example.com/1984.jpg',
        isbn: '9780451524935',
        publisher: 'Secker & Warburg',
        pages: 328,
      },
      // agrega mas libros
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        publishedYear: 1960,
        genre: ['Fiction', 'Classic'],
        summary: 'Una novela sobre la injusticia racial en el sur de EE. UU.',
        rating: 5,
        coverImageUrl: 'https://example.com/mockingbird.jpg',
        isbn: '9780061120084',
        publisher: 'J.B. Lippincott & Co.',
        pages: 281,
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        publishedYear: 1813,
        genre: ['Fiction', 'Romance'],
        summary:
          'Una novela sobre las costumbres y el matrimonio en la Inglaterra del siglo XIX.',
        rating: 5,
        coverImageUrl: 'https://example.com/pride-and-prejudice.jpg',
        isbn: '9780141040349',
        publisher: 'T. Egerton',
        pages: 432,
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        publishedYear: 1925,
        genre: ['Fiction', 'Classic'],
        summary: 'Una crítica a la sociedad estadounidense en los años 20.',
        rating: 5,
        coverImageUrl: 'https://example.com/gatsby.jpg',
        isbn: '9780743273565',
        publisher: "Charles Scribner's Sons",
        pages: 180,
      },
    ]);

    // Crear usuario con libros en su lista
    await this.userModel.create({
      username: 'demoUser',
      email: 'demo@example.com',
      password: 'hashedpassword', // en real debería ir hasheado
      books: [
        {
          bookId: books[0]._id,
          status: 'reading',
          rate: 5,
          review: 'Un clásico imprescindible.',
          favorite: true,
        },
        {
          bookId: books[1]._id,
          status: 'want to read',
          rate: null,
          review: '',
          favorite: false,
        },
      ],
    });

    // que cree el array de generos unicos en la coleccion genres
    const uniqueGenres = Array.from(
      new Set(books.flatMap((book) => book.genre)),
    );
    await this.categoryModel.insertMany(uniqueGenres.map((name) => ({ name })));

    console.log('Seed: datos insertados con éxito');
  }
}
