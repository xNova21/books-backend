import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false }) // <- esto asegura que NO se crea otra colección
export class UserBook {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  bookId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['reading', 'completed', 'want to read', 'dropped'],
    required: true,
  })
  status: 'reading' | 'completed' | 'want to read' | 'dropped';

  @Prop({ type: Date, default: Date.now })
  addedAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Number, min: 0, max: 5 })
  rate: number;

  @Prop()
  review: string;

  @Prop({ type: Boolean, default: false })
  favorite: boolean;
}

export const UserBookSchema = SchemaFactory.createForClass(UserBook);
