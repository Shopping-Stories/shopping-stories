import { Field, InputType, ObjectType } from 'type-graphql';

@ObjectType()
export class AccessToken {
    @Field()
    accessToken: string;
}

@InputType()
export class LoginInput {
    @Field()
    username: string;

    @Field()
    password: string;
}
