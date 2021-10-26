import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type PlaceDocument = Place & Document;

@ObjectType({ description: 'Place Object' })
@modelOptions({
	schemaOptions: { timestamps: true },
})
export class Place {
	@Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	readonly _id?: ObjectId;

	@prop({ required: true })
	@Field({ description: 'Type of item' })
	location: string;

	@prop({ required: true })
	@Field({ description: 'Variations of given item' })
	alias: string;

	@prop({ required: true })
	@Field({ description: 'Variations of given item' })
	descriptor: string;
}

export const PlaceModel = mongoose.models.Place || getModelForClass(Place);
