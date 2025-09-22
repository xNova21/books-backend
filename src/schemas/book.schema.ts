import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'books' })
export class Book {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: Number })
  publishedYear: number;

  @Prop({ type: [String] })
  genre: string[];

  @Prop({ type: String })
  summary: string;

  @Prop({ type: Number })
  rating: number;

  @Prop({ type: String })
  coverImageUrl: string;

  @Prop({ type: String, unique: true })
  isbn: string;

  @Prop({ type: String })
  publisher: string;

  @Prop({ type: Number })
  pages: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);
