import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type CatDocument = Cat & Document;

@Schema()
@ObjectType('Cat', { description: 'Cat Object' })
export class Cat {
	@Field({ description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	_id: ObjectId;

	@Prop({ required: true })
	@Field({ description: 'Name of the Cat' })
	name: string;

	@Prop({ required: true })
	@Field((type) => Int, { description: 'Age of the Cat' })
	age: number;

	@Prop({ required: true })
	@Field({ description: 'Breed of the Cat' })
	breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
