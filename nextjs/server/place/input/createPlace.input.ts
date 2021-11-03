import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePlaceInput {
    @Field({ description: 'Type of item' })
    location: string;

    @Field({ description: 'Variations of given item' })
    alias: string;

    @Field({ description: 'Variations of given item' })
    descriptor: string;
}
