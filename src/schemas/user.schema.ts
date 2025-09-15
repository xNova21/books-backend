import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserBook, UserBookSchema } from './userbook.schema';

@Schema({ timestamps: true, versionKey: false, collection: 'users' })
export class User extends Document {
  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  // 👇 Aquí va el schema, no un Object genérico
  @Prop({ type: [UserBookSchema], default: [] })
  books: UserBook[];
}

export const UserSchema = SchemaFactory.createForClass(User);
