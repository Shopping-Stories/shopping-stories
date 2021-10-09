import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';

export type GlossaryItemDocument = GlossaryItem & Document;

@ObjectType({ description: 'Glossary Item Object' })
@modelOptions({
	schemaOptions: { timestamps: true, collection: 'glossaryItems' },
})
export class GlossaryItem {
	@Field((_returns) => ID, { description: 'String of MongoDB _id' })
	public get id(): string {
		return this._id;
	}

	@prop({ required: true, default: uuidv4 })
	_id: string;

	@prop({ required: true })
	@Field({ description: 'Name of glossary item' })
	name: string;

	@prop({ required: true })
	@Field({ description: 'Filename of image in S3 bucket' })
	imageKey: string;

	@prop({ required: true })
	@Field({ description: 'Description of item' })
	description: string;

	@prop({ required: true })
	@Field({ description: 'Category item is in' })
	category: string;

	@prop({ required: true })
	@Field({ description: 'Sub-category item is in' })
	subCategory: string;

	@prop({ required: true })
	@Field({ description: 'Original price of item' })
	originalPrice: number;

	@prop({ type: () => [String], required: true })
	@Field((_type) => [String], {
		description: 'Other items related to this one',
	})
	relatedItems: string[];

	@prop({ type: () => [String], required: true })
	@Field((_type) => [String], { description: 'Purchases related to this item' })
	relatedPurchases: string[];
}

export const GlossaryItemModel =
	mongoose.models.GlossaryItem || getModelForClass(GlossaryItem);
