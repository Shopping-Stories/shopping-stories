import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateCatDto {
	@Field()
	name!: string;
	@Field()
	age!: number;
	@Field()
	breed!: string;
}
