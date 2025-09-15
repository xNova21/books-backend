import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'users' })
export class User {
  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: [Object] })
  books: {
    bookId: string;
    status: 'reading' | 'completed' | 'want to read' | 'dropped';
    addedAt: Date;
    updatedAt: Date;
    rate: number;
    review: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
