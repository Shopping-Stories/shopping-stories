import { Field, InputType } from 'type-graphql';

@InputType()
class ParsedRegularEntrySearch {
    @Field({ nullable: true })
    entryDescription?: string;

    @Field({ nullable: true })
    tobaccoMarkName?: string;
}

@InputType()
class ParsedTobaccoEntrySearch {
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
class ParsedItemEntrySearch {
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
export class ParsedAdvancedSearchInput {
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

    @Field(() => ParsedItemEntrySearch, { nullable: true, defaultValue: null })
    itemEntry: ParsedItemEntrySearch | null;

    @Field(() => ParsedTobaccoEntrySearch, {
        nullable: true,
        defaultValue: null,
    })
    tobaccoEntry: ParsedTobaccoEntrySearch | null;

    @Field(() => ParsedRegularEntrySearch, {
        nullable: true,
        defaultValue: null,
    })
    regularEntry: ParsedRegularEntrySearch | null;
}
