import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateGlossaryItemInput {
    @Field({ nullable: true, description: 'Name of glossary item' })
    name?: string;

    @Field({ nullable: true, description: 'Description of item' })
    description?: string;

    @Field({ nullable: true, description: "Item's origin" })
    origin?: string;

    @Field({ nullable: true, description: "Item's use" })
    use?: string;

    @Field({ nullable: true, description: 'Category item is in' })
    category?: string;

    @Field({ nullable: true, description: 'Sub-category item is in' })
    subcategory?: string;

    @Field(() => [String], { nullable: true, description: 'Qualifiers' })
    qualifiers?: string[];

    @Field({
        nullable: true, description: 'description of the cultural context surrounding the item',
    })
    culturalContext?: string;

    @Field({
        nullable: true, description: "citations form information used in this item's details",
    })
    citations?: string;

    @Field(() => [UpdateImageObject], {
        nullable: true, description: 'images of item',
    })
    images?: UpdateImageObject[];

    @Field(() => [UpdatePurchaseObject], {
        nullable: true, description: 'Example of what a purchase of this item looks like',
    })
    examplePurchases?: UpdatePurchaseObject[];

    // ledgerImage: string;
}

@InputType({ description: 'Example purchases' })
class UpdatePurchaseObject {
    @Field({ nullable: true })
    folio?: string;

    @Field({ nullable: true })
    folioItem?: string;

    @Field({ nullable: true, description: 'quantity of item purchased' })
    quantityPurchased?: number;

    @Field({ nullable: true, description: 'account used for purchase' })
    accountHolder?: string;

    @Field({ nullable: true, description: 'customer purchasing the item' })
    customer?: string;

    @Field({ nullable: true, description: 'date the item was purchased on' })
    purchaseDate?: Date;

    @Field({ nullable: true, description: 'pounds used in the transaction' })
    pounds?: number;

    @Field({ nullable: true, description: 'shillings used in the transaction' })
    shilling?: number;

    @Field({ nullable: true, description: 'pence used in the transaction ' })
    pence?: number;
}
@InputType({ description: 'Image Information' })
class UpdateImageObject {
    @Field({
        nullable: true, description: 'string of filename of thumbnail image in the S3 Bucket',
    })
    thumbnailImage?: string;

    @Field({ nullable: true, description: 'name of the image' })
    name?: string;

    @Field({ nullable: true, description: '' })
    material?: string;

    @Field(() => Int, { nullable: true, description: 'width of the image' })
    width?: number;

    @Field(() => Int, { nullable: true, description: 'height of the image' })
    height?: number;

    @Field({ nullable: true, description: 'date of the image' })
    date?: string;

    @Field({ nullable: true, description: 'image caption' })
    caption?: string;

    @Field({
        nullable: true, description: 'citation about the collection the image is in',
    })
    collectionCitation?: string;

    @Field({ nullable: true, description: 'key to image in S3 Bucket' })
    url?: string;

    @Field({ nullable: true, description: 'license the image is under' })
    license?: string;
}
