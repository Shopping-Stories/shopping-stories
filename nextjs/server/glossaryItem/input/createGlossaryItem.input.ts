import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateGlossaryItemInput {
    @Field({ description: 'Name of glossary item' })
    name: string;

    @Field({ description: 'Filename of image in S3 bucket' })
    imageKey: string;

    @Field({ description: 'Description of item' })
    description: string;

    @Field({ description: 'Category item is in' })
    category: string;

    @Field({ description: 'Sub-category item is in' })
    subCategory: string;

    @Field({ description: 'Original price of item' })
    originalPrice: number;

    @Field((_type) => [String], {
        description: 'Other items related to this one',
    })
    relatedItems: string[];

    @Field((_type) => [String], {
        description: 'Purchases related to this item',
    })
    relatedPurchases: string[];
}
