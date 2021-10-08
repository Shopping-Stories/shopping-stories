import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type peopleDocument = Person & Document;

@ObjectType({ description: 'People Object' })
@modelOptions({
	schemaOptions: { timestamps: true, collection: 'PersonMasterList' },
})
export class Person {
	@Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	readonly _id?: ObjectId;

	@prop({ required: true })
	@Field({ description: 'Variations of given item' })
	Account: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Enslaved: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	FirstName: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Gender: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	LastName: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Location: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Prefix: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Profession: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Profession_Category: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Reference: string;

	@prop({ required: true })
	@Field({ description: 'Variations of given item' })
	Store: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Suffix: string;

	@prop()
	@Field({ description: 'Variations of given item' })
	Variations: string;
}

export const PersonModel = mongoose.models.Person || getModelForClass(Person);
