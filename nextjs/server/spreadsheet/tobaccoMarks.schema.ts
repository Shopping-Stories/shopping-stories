import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type tobaccoMarkDocument = TobaccoMark & Document;

@ObjectType({ description: 'People Object' })
@modelOptions({
	schemaOptions: { timestamps: true, collection: 'TobaccoMarks' },
})
export class TobaccoMark {
	@Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	readonly _id?: ObjectId;

	@prop()
	@Field({ description: 'Variations of given item' })
	Description: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	Image: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	NetWeight: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	Note: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	Notes: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	TM_ID: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	Warehouse: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	Where: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	WhoRepresents: string;

	@prop({ required: true })
	@Field({ description: 'TODO: Fill this in' })
	WhoUnder: string;
}

export const TobaccoMarkModel =
	mongoose.models.TobaccoMark || getModelForClass(TobaccoMark);
