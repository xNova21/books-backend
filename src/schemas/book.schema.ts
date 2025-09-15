import { Prop, Schema } from '@nestjs/mongoose';

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

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}
