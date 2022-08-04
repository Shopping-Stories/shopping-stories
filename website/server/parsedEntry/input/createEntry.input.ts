import { ObjectId } from 'mongoose';
import { Field, ID, Int, InputType } from 'type-graphql';

@InputType()
export class ParsedTobaccoMarkInput {
    @Field(() => ID, { description: 'words', nullable: true })
    markID: ObjectId;

    @Field({ description: '' })
    markName: string;
}

@InputType()
export class ParsedPoundsShillingsPenceInput {
    @Field({ description: 'Number of pounds', defaultValue: 0.0 })
    pounds: number;

    @Field({ description: 'Number of shillings', defaultValue: 0.0 })
    shilling: number;

    @Field({ description: 'Number of Pence', defaultValue: 0.0 })
    pence: number;
}

@InputType()
export class ParsedMoneyInput {
    @Field({ description: '', defaultValue: '' })
    quantity: string;

    @Field({ description: '' })
    commodity: string;

    @Field({ description: '', defaultValue: '' })
    colony: string;

    @Field(() => ParsedPoundsShillingsPenceInput, { description: '' })
    sterling: ParsedPoundsShillingsPenceInput;

    @Field(() => ParsedPoundsShillingsPenceInput, { description: '' })
    currency: ParsedPoundsShillingsPenceInput;
}
@InputType()
export class ParsedNoteInput {
    @Field({ description: '' })
    noteNum: number;

    @Field({ description: '' })
    totalWeight: number;

    @Field({ description: '' })
    barrelWeight: number;

    @Field({ description: '' })
    tobaccoWeight: number;
}

@InputType()
export class ParsedMetaInput {
    @Field(() => String, { description: 'Ledger containing this Entry' })
    ledger: string;

    @Field(() => String, { description: 'Reel of the Entry' })
    reel: string;

    @Field(() => String, { description: 'Store Owner' })
    owner: string;

    @Field(() => String, { description: 'Name of Store' })
    store: string;

    @Field(() => String, { description: 'Year the entry was made' })
    year: string;

    @Field(() => String, {
        description: 'Folio the entry is contained in',
    })
    folioPage: string;

    @Field(() => String, { description: 'ID of entry within Folio' })
    entryID: string;

    @Field(() => String, { description: 'comments' })
    comments: string;
}

@InputType()
export class ParsedMentionedItemsInput {
    @Field({ description: '' })
    quantity: number;

    @Field({ description: '' })
    qualifier: string;

    @Field({ description: '' })
    item: string;
}

@InputType()
export class ParsedItemOrServiceInput {
    @Field({ description: '' })
    quantity: number;

    @Field({ description: '' })
    qualifier: string;

    @Field(() => [String], { description: '' })
    variants: string[];

    @Field({ description: '' })
    item: string;

    @Field({ description: '', defaultValue: '' })
    category: string;

    @Field({ description: '', defaultValue: '' })
    subcategory: string;

    @Field(() => ParsedPoundsShillingsPenceInput, { description: '' })
    unitCost: ParsedPoundsShillingsPenceInput;

    @Field(() => ParsedPoundsShillingsPenceInput, { description: '' })
    itemCost: ParsedPoundsShillingsPenceInput;
}
@InputType()
export class ParsedItemEntryInput {
    @Field({ description: '' })
    perOrder: number;

    @Field({ description: '' })
    percentage: number;

    @Field(() => [ParsedItemOrServiceInput], {
        description: '',
        nullable: 'items',
    })
    itemsOrServices: ParsedItemOrServiceInput[];

    @Field(() => [ParsedMentionedItemsInput], { description: '' })
    itemsMentioned: ParsedMentionedItemsInput[];
}

@InputType()
export class ParsedTobaccoMoneyInput {
    @Field({ description: 'words' })
    moneyType: string;

    @Field({ description: 'words' })
    tobaccoAmount: number;

    @Field({ description: 'words' })
    rateForTobacco: ParsedPoundsShillingsPenceInput;

    @Field({ description: 'words' })
    casksInTransaction: number;

    @Field({ description: 'words' })
    tobaccoSold: ParsedPoundsShillingsPenceInput;

    @Field({ description: 'words' })
    casksSoldForEach: ParsedPoundsShillingsPenceInput;
}

@InputType()
export class ParsedTobaccoEntryInput {
    @Field({ description: 'words' })
    entry: string;

    @Field(() => [ParsedTobaccoMarkInput], { description: '' })
    marks: ParsedTobaccoMarkInput[];

    @Field(() => [ParsedNoteInput], { description: '' })
    notes: ParsedNoteInput[];

    @Field(() => [ParsedTobaccoMoneyInput], { description: '' })
    money: ParsedTobaccoMoneyInput[];

    @Field({ description: 'words' })
    tobaccoShaved: number;
}

@InputType()
export class ParsedRegularEntryInput {
    @Field({ description: 'words' })
    entry: string;

    @Field(() => [ParsedTobaccoMarkInput], { description: '' })
    tobaccoMarks: ParsedTobaccoMarkInput[];

    @Field(() => [ParsedMentionedItemsInput], { description: '' })
    itemsMentioned: ParsedMentionedItemsInput[];
}

@InputType()
export class ParsedPeoplePlacesInput {
    @Field({ description: 'Persons name' })
    name: string;

    @Field(() => ID, { description: 'words', nullable: true })
    id: ObjectId;
}
/*
export const EntryUnion = createUnionType({
	name: 'EntryUnion',
	types: () => [ItemEntry, TobaccoEntryObject],
	resolveType(value) {
		if (typeof value.Money !== undefined) {
			return ItemEntry;
		}
		return TobaccoEntryObject;
	},
});*/

@InputType()
export class ParsedDateInput {
    @Field(() => Int, { description: 'day of date' })
    day: number;

    @Field(() => Int, { description: 'month of date' })
    month: number;

    @Field(() => Int, { description: 'year of date' })
    year: number;

    @Field(() => Date, { description: 'complete date', nullable: true })
    fullDate?: Date;
}

@InputType()
export class ParsedAccountHolderInput {
    @Field(() => String, {
        description: "Prefix of account holder's name",
    })
    prefix: string;

    @Field(() => String, { description: 'First name of account holder' })
    accountFirstName: string;

    @Field(() => String, { description: 'Last name of account holder' })
    accountLastName: string;

    @Field(() => String, { description: 'Suffix of account holder' })
    suffix: string;

    @Field(() => String, { description: 'Profession of account holder' })
    profession: string;

    @Field(() => String, { description: 'Location?' })
    location: string;

    @Field(() => String, { description: 'Reference?' })
    reference: string;

    @Field(() => Number, { description: 'Debt or Credit transaction' })
    debitOrCredit: number;

    @Field(() => ID, {
        description:
            'ID of the accountholder to reference in peoples master list',
        nullable: true,
    })
    accountHolderID: ObjectId | null;
}

@InputType()
export class ParsedCreateEntryInput {
    @Field(() => ParsedAccountHolderInput, {
        description: 'Information on the account holder in the transaction',
    })
    accountHolder: ParsedAccountHolderInput;

    @Field(() => ParsedMetaInput, {
        description: 'Meta information of the entry',
    })
    meta: ParsedMetaInput;

    @Field(() => ParsedDateInput, { description: 'Date of entry' })
    dateInfo: ParsedDateInput;

    @Field(() => [String], { description: '' })
    folioRefs: [string];

    @Field(() => [String], { description: '' })
    ledgerRefs: [string];

    @Field(() => [ParsedItemEntryInput], { nullable: true })
    itemEntries?: ParsedItemEntryInput[] | null;

    @Field(() => ParsedTobaccoEntryInput, { nullable: true })
    tobaccoEntry?: ParsedTobaccoEntryInput | null;

    @Field(() => ParsedRegularEntryInput, { nullable: true })
    regularEntry?: ParsedRegularEntryInput | null;

    @Field(() => [ParsedPeoplePlacesInput], {
        description: 'People referenced in this entry',
    })
    people: ParsedPeoplePlacesInput[];

    @Field(() => [ParsedPeoplePlacesInput], {
        description: 'Places referenced in this entry',
    })
    places: ParsedPeoplePlacesInput[];

    @Field(() => String, { description: 'Type of Entry' })
    entry: string;

    @Field(() => ParsedMoneyInput, {
        description: 'general money information for the entry',
    })
    money: ParsedMoneyInput;

    @Field(() => String, {
        description: 'Name of uploaded document parsed from',
    })
    documentName: string;
}
