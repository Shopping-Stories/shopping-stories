import { Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class FindAllLimitAndSkip {
    @Min(0)
    @Field({ description: 'Offset of items to skip', defaultValue: 0 })
    skip: number;

    @Max(50)
    @Min(1)
    @Field({
        description:
            'number of items to return, number must be in the range 1 <= limit <= 50',
        defaultValue: 10,
    })
    limit: number;
}
