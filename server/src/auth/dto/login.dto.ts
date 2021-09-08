import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class LoginDto {
	@Field()
	username: string;

	@Field()
	password: string;
}

@ObjectType()
export class AccessToken {
	@Field()
	accessToken: string;
}
