import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'books' })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  publishedYear: number;

  @Prop()
  genre: string[];

  @Prop()
  summary: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}
