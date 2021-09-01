import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterDto {
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
