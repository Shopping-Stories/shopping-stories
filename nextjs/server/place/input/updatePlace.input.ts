import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdatePlaceInput {
	@Field({ nullable: true, description: 'Type of item' })
	location?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	alias?: string;

	@Field({ nullable: true, description: 'Variations of given item' })
	descriptor?: string;
}
