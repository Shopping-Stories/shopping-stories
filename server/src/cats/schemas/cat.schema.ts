import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type CatDocument = Cat & Document;

@Schema()
@ObjectType('Cat')
export class Cat {
	@Field()
	id: string;

	_id: ObjectId;

	@Prop({ required: true })
	@Field()
	name: string;

	@Prop({ required: true })
	@Field((type) => Int)
	age: number;

	@Prop({ required: true })
	@Field()
	breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
