import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateTobaccoMarkInput {
    @Field({ nullable: true, description: 'TODO: Fill this in' })
    description?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    image?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    netWeight?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    note?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    notes?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    tobaccoMarkId?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    warehouse?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    where?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    whoRepresents?: string;

    @Field({ nullable: true, description: 'TODO: Fill this in' })
    whoUnder?: string;
}
