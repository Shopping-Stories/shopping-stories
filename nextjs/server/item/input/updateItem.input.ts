import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateItemInput extends Object {
    @Field({ nullable: true, description: 'Name of the item' })
    item?: string;

    @Field({ nullable: true, description: 'Description of the item' })
    variants?: string;
}
