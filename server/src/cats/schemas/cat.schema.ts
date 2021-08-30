import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CatDocument = Cat & Document;

@Schema()
@ObjectType('Cat')
export class Cat {
	@Prop({ required: true })
	@Field()
	name: string;

	@Prop({ required: true })
	@Field(type => Int)
	age: number;

	@Field()
	@Prop({ required: true })
	breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
