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

    @prop({ default: '' })
    @Field({ description: 'Variations of given item', defaultValue: '' })
    description: string;

    @prop({ default: '' })
    @Field({ description: 'TODO: Fill this in', defaultValue: '' })
    image: string;

    @prop({ default: '' })
    @Field({ description: 'TODO: Fill this in', defaultValue: '' })
    netWeight: string;

    @prop({ default: '' })
    @Field({ description: 'TODO: Fill this in', defaultValue: '' })
    note: string;

    @prop({ default: '' })
    @Field({ description: 'TODO: Fill this in', defaultValue: '' })
    notes: string;

    @prop({ required: true })
    @Field({ description: 'TODO: Fill this in' })
    tobaccoMarkId: string;

    @prop({ required: true })
    @Field({ description: 'TODO: Fill this in' })
    warehouse: string;

    @prop({ default: '' })
    @Field({ description: 'TODO: Fill this in', defaultValue: '' })
    where: string;

    @prop({ default: '' })
    @Field({ description: 'TODO: Fill this in', defaultValue: '' })
    whoRepresents: string;

    @prop({ default: '' })
    @Field({ description: 'TODO: Fill this in', defaultValue: '' })
    whoUnder: string;
}

export const TobaccoMarkModel =
    mongoose.models.TobaccoMark || getModelForClass(TobaccoMark);
