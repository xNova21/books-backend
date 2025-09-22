import { Prop, Schema } from '@nestjs/mongoose';

import { SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'categories' })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
