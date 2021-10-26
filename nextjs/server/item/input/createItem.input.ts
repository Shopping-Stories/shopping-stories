import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateItemInput {
	@Field({ description: 'Name of item' })
	item: string;

	@Field({ description: 'Description of the item' })
	variants: string;
}
