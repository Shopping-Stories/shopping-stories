import { Field, InputType } from 'type-graphql';

@InputType()
class RegularEntrySearch {
    @Field({ nullable: true })
    entryDescription?: string;

    @Field({ nullable: true })
    tobaccoMarkName?: string;
}

@InputType()
class TobaccoEntrySearch {
    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    tobaccoMarkName?: string;

    @Field({ nullable: true })
    noteNumber?: number;

    @Field({ nullable: true })
    moneyType?: string;
}

@InputType()
class ItemEntrySearch {
    @Field({ nullable: true })
    perOrder?: number;

    @Field({ nullable: true })
    items?: string;

    @Field({ nullable: true })
    category?: string;

    @Field({ nullable: true })
    subcategory?: string;

    @Field({ nullable: true })
    variant?: string;
}

@InputType()
export class AdvancedSearchInput {
    @Field({ nullable: true })
    reel?: string;

    @Field({ nullable: true })
    storeOwner?: string;

    @Field({ nullable: true })
    folioYear?: string;

    @Field({ nullable: true })
    folioPage?: string;

    @Field({ nullable: true })
    entryID?: string;

    @Field({ nullable: true })
    accountHolderName?: string;

    @Field({ nullable: true })
    date?: Date;

    @Field({ nullable: true })
    date2?: Date;

    @Field({ nullable: true })
    people?: string;

    @Field({ nullable: true })
    places?: string;

    @Field({ nullable: true })
    commodity?: string;

    @Field({ nullable: true })
    colony?: string;

    @Field(() => ItemEntrySearch, { nullable: true, defaultValue: null })
    itemEntry: ItemEntrySearch | null;

    @Field(() => TobaccoEntrySearch, { nullable: true, defaultValue: null })
    tobaccoEntry: TobaccoEntrySearch | null;

    @Field(() => RegularEntrySearch, { nullable: true, defaultValue: null })
    regularEntry: RegularEntrySearch | null;
}
