import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

export type ItemDocument = Item & Document;

// function createEdgeNGrams(str: any) {
// 	if (str && str.length > 3) {
// 		const minGram = 3;
// 		const maxGram = str.length;

// 		return str
// 			.split(' ')
// 			.reduce((ngrams: any, token: any) => {
// 				if (token.length > minGram) {
// 					for (let i = minGram; i <= maxGram && i <= token.length; ++i) {
// 						ngrams = [...ngrams, token.substr(0, i)];
// 					}
// 				} else {
// 					ngrams = [...ngrams, token];
// 				}
// 				return ngrams;
// 			}, [])
// 			.join(' ');
// 	}

// 	return str;
// }

// @pre<Item>('save', function (next: any) {
// 	(this as any).ngram = createEdgeNGrams(this.item);
// 	console.log(this.ngram, 'logger');
// 	return next();
// })
// @pre<Item>(
// 	'updateOne',
// 	function (next: any) {
// 		(this as any).ngram = createEdgeNGrams(this.item);
// 		console.log(this.ngram, 'logger');
// 		return next();
// 	},
// 	{ query: false, document: true },
// )
@ObjectType({ description: 'Item Object' })
@modelOptions({
    schemaOptions: { timestamps: true },
})
export class Item {
    @Field((_returns) => ID, { description: 'String of MongoDB ObjectId' })
    public get id(): string {
        return `${this._id}`; // Converts type ObjectId of _id to String
    }

    readonly _id?: ObjectId;

    @prop({ required: true })
    @Field({ description: 'Type of item' })
    item: string;

    @prop({ required: true })
    @Field({ description: 'Variations of given item' })
    variants: string;

    // @prop()
    // ngram: string;
}

export const ItemModel = mongoose.models.Item || getModelForClass(Item);
