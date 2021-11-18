import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateGlossaryItemInput {
    @Field({ description: 'Name of glossary item' })
    name: string;

    @Field({ description: 'Description of item' })
    description: string;

    @Field({ description: "Item's origin" })
    origin: string;

    @Field({ description: "Item's use" })
    use: string;

    @Field({ description: 'Category item is in' })
    category: string;

    @Field({ description: 'Sub-category item is in' })
    subcategory: string;

    @Field(() => String, { description: 'Qualifiers' })
    qualifiers: string;

    @Field({
        description: 'description of the cultural context surrounding the item',
    })
    culturalContext: string;

    @Field({
        description: "citations form information used in this item's details",
    })
    citations: string;

    @Field(() => [CreateImageObject], {
        description: 'images of item',
    })
    images: CreateImageObject[];

    @Field(() => [CreatePurchaseObject], {
        description: 'Example of what a purchase of this item looks like',
    })
    examplePurchases: CreatePurchaseObject[];

    // ledgerImage: string;
}

@InputType({ description: 'Example purchases' })
class CreatePurchaseObject {
    @Field()
    folio: string;

    @Field()
    folioItem: string;

    @Field({ description: 'quantity of item purchased' })
    quantityPurchased: number;

    @Field({ description: 'account used for purchase' })
    accountHolder: string;

    @Field({ description: 'customer purchasing the item' })
    customer: string;

    @Field({ description: 'date the item was purchased on' })
    purchaseDate: Date;

    @Field({ description: 'pounds used in the transaction' })
    pounds: number;

    @Field({ description: 'shillings used in the transaction' })
    shilling: number;

    @Field({ description: 'pence used in the transaction ' })
    pence: number;
}
@InputType({ description: 'Image Information' })
class CreateImageObject {
    @Field({
        description: 'string of filename of thumbnail image in the S3 Bucket',
    })
    thumbnailImage: string;

    @Field({ description: 'name of the image' })
    name: string;

    @Field({ description: '' })
    material: string;

    @Field(() => Int, { description: 'width of the image' })
    width: number;

    @Field(() => Int, { description: 'height of the image' })
    height: number;

    @Field({ description: 'date of the image' })
    date: string;

    @Field({ description: 'image caption' })
    caption: string;

    @Field({
        description: 'citation about the collection the image is in',
    })
    collectionCitation: string;

    @Field({ description: 'key to image in S3 Bucket' })
    url: string;

    @Field({ description: 'license the image is under' })
    license: string;
}
