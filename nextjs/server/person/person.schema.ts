import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type PersonDocument = Person & Document;

@ObjectType({ description: 'People Object' })
@modelOptions({
	schemaOptions: { timestamps: true },
})
export class Person {
	@Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	readonly _id?: ObjectId;

	@prop({ required: true })
	@Field({ description: 'Variations of given item' })
	account: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	enslaved: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	firstName: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	lastName: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	gender: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	location: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	prefix: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	profession: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	professionCategory: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	reference: string;

	@prop({ nullable: true, required: true })
	@Field({ description: 'Variations of given item' })
	store: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	suffix: string;

	@prop()
	@Field({ nullable: true, description: 'Variations of given item' })
	variations: string;
}

export const PersonModel = mongoose.models.Person || getModelForClass(Person);
