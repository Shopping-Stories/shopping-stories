import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type TobaccoMarkDocument = TobaccoMark & Document;

@ObjectType({ description: 'TobaccoMark Object' })
@modelOptions({
	schemaOptions: { timestamps: true, collection: 'tobaccoMarks' },
})
export class TobaccoMark {
	@Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	readonly _id?: ObjectId;

	@prop()
	@Field({ description: 'Variations of given item' })
	description: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	image: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	netWeight: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	note: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	notes: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	tobaccoMarkId: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	warehouse: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	where: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	whoRepresents: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	whoUnder: string;
}

export const TobaccoMarkModel =
	mongoose.models.TobaccoMark || getModelForClass(TobaccoMark);
