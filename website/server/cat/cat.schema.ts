import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type CatDocument = Cat & Document;

@ObjectType({ description: 'Cat Object' })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Cat {
    @Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
    public get id(): string {
        return `${this._id}`; // Converts type ObjectId of _id to String
    }

    readonly _id?: ObjectId;

    @prop({ required: true })
    @Field({ description: 'Name of the Cat' })
    name?: string;

    @prop({ required: true })
    @Field({ description: 'Age of the Cat' })
    age?: number;

    @prop({ required: true })
    @Field({ description: 'Breed of the Cat' })
    breed?: string;
}

export const CatModel = mongoose.models.Cat || getModelForClass(Cat);
