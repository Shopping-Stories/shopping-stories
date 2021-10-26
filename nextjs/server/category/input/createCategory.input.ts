import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateCategoryInput {
	@Field({ description: 'Category type' })
	category: string;

	@Field({ description: 'Items in the category' })
	item: string;

	@Field({ description: 'Subcategory?' })
	subcategory: string;
}