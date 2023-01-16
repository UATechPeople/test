import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';
import { IsEmail, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  @Length(1, 64)
  password: string;

  @Prop({ unique: true, required: true })
  @Transform(({ value }) => value.toLowerCase())
  @IsEmail()
  username: string;

  @Prop({ default: now() })
  createdAt?: Date;

  @Prop({ default: now() })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
