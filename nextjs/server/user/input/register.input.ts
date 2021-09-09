import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
	@Field()
	email: string;

	@Field()
	name: string;

	@Field()
	password: string;

	@Field()
	given_name: string;

	@Field()
	family_name: string;
}
