import {
    getModelForClass,
    index,
    modelOptions,
    prop,
} from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type DocumentInfoType = DocumentInfo & Document;

@ObjectType({ description: 'Category Object' })
@modelOptions({ schemaOptions: { timestamps: true, collection: 'documents' } })
// @ts-ignore
@index({ name: 'text', fileKey: 'text' }, { name: 'search_index' })
export class DocumentInfo {
    @Field(() => ID, { description: 'String of MongoDB ObjectId' })
    public get id(): string {
        return `${this._id}`; // Converts type ObjectId of _id to String
    }

    readonly _id?: ObjectId;

    @prop({ required: true })
    @Field({ description: 'Name of document' })
    name: string;

    @prop({ required: true })
    @Field({ description: 'Key of file in S3 bucket' })
    fileKey: string;

    @prop({ required: true })
    @Field({ description: 'Description of document' })
    description: string;
}

export const DocumentInfoModel =
    mongoose.models.DocumentInfo || getModelForClass(DocumentInfo);
