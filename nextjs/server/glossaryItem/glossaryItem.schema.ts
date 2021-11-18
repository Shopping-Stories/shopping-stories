import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document } from 'mongoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';

export type GlossaryItemDocument = GlossaryItem & Document;

@ObjectType({ description: 'Glossary Item Object' })
@modelOptions({
    schemaOptions: { timestamps: true, collection: 'glossaryItems' },
})
export class GlossaryItem {
    @Field(() => ID, { description: 'Glossary Item ID' })
    public get id(): string {
        return this._id;
    }

    @prop({ required: true, default: uuidv4 })
    _id: string;

    @prop({ required: true })
    @Field({ description: 'Name of glossary item' })
    name: string;

    @prop({ required: true })
    @Field({ description: 'Description of item' })
    description: string;

    @prop({ required: true })
    @Field({ description: "Item's origin" })
    origin: string;

    @prop({ required: true })
    @Field({ description: "Item's use" })
    use: string;

    @prop({ required: true })
    @Field({ description: 'Category item is in' })
    category: string;

    @prop({ required: true })
    @Field({ description: 'Sub-category item is in' })
    subcategory: string;

    @prop({ required: true })
    @Field(() => String, { description: 'Qualifiers' })
    qualifiers: string;

    @prop({ required: true })
    @Field({
        description: 'description of the cultural context surrounding the item',
    })
    culturalContext: string;

    @prop({ required: true })
    @Field({
        description: "citations form information used in this item's details",
    })
    citations: string;

    @prop({ _id: false, type: () => [ImageObject], required: true })
    @Field(() => [ImageObject], {
        description: 'images of item',
    })
    images: ImageObject[];

    @prop({ _id: false, type: () => [PurchaseObject], required: true })
    @Field(() => [PurchaseObject], {
        description: 'Example of what a purchase of this item looks like',
    })
    examplePurchases: PurchaseObject[];

    // ledgerImage: string;
}

@ObjectType({ description: 'Example purchases' })
class PurchaseObject {
    @prop()
    @Field()
    folio: string;

    @prop()
    @Field()
    folioItem: string;

    @prop()
    @Field({ description: 'quantity of item purchased' })
    quantityPurchased: number;

    @prop()
    @Field({ description: 'account used for purchase' })
    accountHolder: string;

    @prop()
    @Field({ description: 'customer purchasing the item' })
    customer: string;

    @prop()
    @Field({ description: 'date the item was purchased on' })
    purchaseDate: Date;

    @prop()
    @Field({ description: 'pounds used in the transaction' })
    pounds: number;

    @prop()
    @Field({ description: 'shillings used in the transaction' })
    shilling: number;

    @prop()
    @Field({ description: 'pence used in the transaction ' })
    pence: number;
}
@ObjectType({ description: 'Image Information' })
class ImageObject {
    @prop()
    @Field({
        description: 'string of filename of thumbnail image in the S3 Bucket',
    })
    thumbnailImage: string;

    @prop()
    @Field({ description: 'name of the image' })
    name: string;

    @prop()
    @Field({ description: '' })
    material: string;

    @prop()
    @Field(() => Int, { description: 'width of the image' })
    width: number;

    @prop()
    @Field(() => Int, { description: 'height of the image' })
    height: number;

    @prop()
    @Field({ description: 'date of the image' })
    date: string;

    @prop()
    @Field({ description: 'image caption' })
    caption: string;

    @prop()
    @Field({
        description: 'citation about the collection the image is in',
    })
    collectionCitation: string;

    @prop()
    @Field({ description: 'key to image in S3 Bucket' })
    url: string;

    @prop()
    @Field({ description: 'license the image is under' })
    license: string;
}

export const GlossaryItemModel =
    mongoose.models.GlossaryItem || getModelForClass(GlossaryItem);
