import { Field, InputType } from 'type-graphql';

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

    @Field(() => String, { nullable: true, description: 'Qualifiers' })
    qualifiers?: string;

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
}

@InputType({ description: 'Example purchases' })
export class UpdatePurchaseObject {
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
        nullable: true, description: 'string of filename of image in the S3 Bucket',
    })
    imageKey?: string;

    @Field({ nullable: true, description: 'name of the image' })
    name?: string;

    @Field({ nullable: true, description: '' })
    material?: string;

    @Field({ description: 'dimensions of the item in the image' })
    dimensions?: string;

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
