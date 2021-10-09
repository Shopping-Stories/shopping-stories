import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateGlossaryItemInput extends Object {
	@Field({ nullable: true, description: 'Name of glossary item' })
	name?: string;

	@Field({ nullable: true, description: 'Filename of image in S3 bucket' })
	imageKey?: string;

	@Field({ nullable: true, description: 'Description of item' })
	description?: string;

	@Field({ nullable: true, description: 'Category item is in' })
	category?: string;

	@Field({ nullable: true, description: 'Sub-category item is in' })
	subCategory?: string;

	@Field({ nullable: true, description: 'Original price of item' })
	originalPrice?: number;

	@Field((_type) => [String], {
		nullable: true,
		description: 'Other items related to this one',
	})
	relatedItems?: string[];

	@Field((_type) => [String], {
		nullable: true,
		description: 'Purchases related to this item',
	})
	relatedPurchases?: string[];
}
