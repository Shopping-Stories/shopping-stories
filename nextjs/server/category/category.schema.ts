import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type CategoriesDocument = Category & Document;

@ObjectType({ description: 'Category Object' })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Category {
    @Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
    public get id(): string {
        return `${this._id}`; // Converts type ObjectId of _id to String
    }

    readonly _id?: ObjectId;

    @prop({ required: true })
    @Field({ description: 'Category type' })
    category: string;

    @prop({ required: true })
    @Field({ description: 'Items in the category' })
    item: string;

    @prop({ required: true })
    @Field({ description: 'Subcategory?' })
    subcategory: string;
}

export const CategoryModel =
    mongoose.models.Category || getModelForClass(Category);
