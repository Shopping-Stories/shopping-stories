import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type itemDocument = Item & Document;

@ObjectType({ description: 'Item Object' })
@modelOptions({ schemaOptions: { timestamps: true, collection: "ItemMasterList" } })
export class Item {
	@Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	readonly _id?: ObjectId;

	@prop({ required: true })
	@Field({ description: 'Type of item' })
	Item: string;


	@prop({ required: true })
	@Field({ description: 'Variations of given item' })
	Variants: string;
}

export const ItemModel = mongoose.models.Item || getModelForClass(Item);
