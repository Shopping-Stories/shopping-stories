import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatDocument = Cat & Document;

@Schema()
export class Cat {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	age: number;

	@Prop({ required: true })
	breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
