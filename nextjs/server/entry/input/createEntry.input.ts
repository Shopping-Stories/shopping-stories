import { ObjectId } from 'mongoose';
import { Field, ID, Int, InputType } from 'type-graphql';

@InputType()
export class TobaccoMarkInput {
    @Field(() => ID, { description: 'words', nullable : true })
    markID: ObjectId;

    @Field({ description: '' })
    markName: string;
}

@InputType()
export class PoundsShillingsPenceInput {
    @Field({ description: 'Number of pounds', defaultValue: 0.0 })
    pounds: number;

    @Field({ description: 'Number of shillings', defaultValue: 0.0 })
    shilling: number;

    @Field({ description: 'Number of Pence', defaultValue: 0.0 })
    pence: number;
}

@InputType()
export class MoneyInput {
    @Field({ description: '', defaultValue: '' })
    quantity: string;

    @Field({ description: '' })
    commodity: string;

    @Field({ description: '', defaultValue: '' })
    colony: string;

    @Field(() => PoundsShillingsPenceInput, { description: '' })
    sterling: PoundsShillingsPenceInput;

    @Field(() => PoundsShillingsPenceInput, { description: '' })
    currency: PoundsShillingsPenceInput;
}
@InputType()
export class NoteInput {
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
export class MetaInput {
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
export class MentionedItemsInput {
    @Field({ description: '' })
    quantity: number;

    @Field({ description: '' })
    qualifier: string;

    @Field({ description: '' })
    item: string;
}

@InputType()
export class ItemOrServiceInput {
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

    @Field(() => PoundsShillingsPenceInput, { description: '' })
    unitCost: PoundsShillingsPenceInput;

    @Field(() => PoundsShillingsPenceInput, { description: '' })
    itemCost: PoundsShillingsPenceInput;
}
@InputType()
export class ItemEntryInput {
    @Field({ description: '' })
    perOrder: number;

    @Field({ description: '' })
    percentage: number;

    @Field(() => [ItemOrServiceInput], {
        description: '',
        nullable: 'items',
    })
    itemsOrServices: ItemOrServiceInput[];

    @Field(() => [MentionedItemsInput], { description: '' })
    itemsMentioned: MentionedItemsInput[];
}

@InputType()
export class TobaccoMoneyInput {
    @Field({ description: 'words' })
    moneyType: string;

    @Field({ description: 'words' })
    tobaccoAmount: number;

    @Field({ description: 'words' })
    rateForTobacco: PoundsShillingsPenceInput;

    @Field({ description: 'words' })
    casksInTransaction: number;

    @Field({ description: 'words' })
    tobaccoSold: PoundsShillingsPenceInput;

    @Field({ description: 'words' })
    casksSoldForEach: PoundsShillingsPenceInput;
}

@InputType()
export class TobaccoEntryInput {
    @Field({ description: 'words' })
    entry: string;

    @Field(() => [TobaccoMarkInput], { description: '' })
    marks: TobaccoMarkInput[];

    @Field(() => [NoteInput], { description: '' })
    notes: NoteInput[];

    @Field(() => [TobaccoMoneyInput], { description: '' })
    money: TobaccoMoneyInput[];

    @Field({ description: 'words' })
    tobaccoShaved: number;
}

@InputType()
export class RegularEntryInput {
    @Field({ description: 'words' })
    entry: string;

    @Field(() => [TobaccoMarkInput], { description: '' })
    tobaccoMarks: TobaccoMarkInput[];

    @Field(() => [MentionedItemsInput], { description: '' })
    itemsMentioned: MentionedItemsInput[];
}

@InputType()
export class PeoplePlacesInput {
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
export class DateInput {
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
export class AccountHolderInput {
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
        nullable: true
    })
    accountHolderID: ObjectId | null;
}

@InputType()
export class CreateEntryInput {
    @Field(() => AccountHolderInput, {
        description: 'Information on the account holder in the transaction',
    })
    accountHolder: AccountHolderInput;

    @Field(() => MetaInput, {
        description: 'Meta information of the entry',
    })
    meta: MetaInput;

    @Field(() => DateInput, { description: 'Date of entry' })
    dateInfo: DateInput;

    @Field(() => [String], { description: '' })
    folioRefs: [string];

    @Field(() => [String], { description: '' })
    ledgerRefs: [string];

    @Field(() => [ItemEntryInput], { nullable: true })
    itemEntries?: ItemEntryInput[] | null;

    @Field(() => TobaccoEntryInput, { nullable: true })
    tobaccoEntry?: TobaccoEntryInput | null;

    @Field(() => RegularEntryInput, { nullable: true })
    regularEntry?: RegularEntryInput | null;

    @Field(() => [PeoplePlacesInput], {
        description: 'People referenced in this entry',
    })
    people: PeoplePlacesInput[];

    @Field(() => [PeoplePlacesInput], {
        description: 'Places referenced in this entry',
    })
    places: PeoplePlacesInput[];

    @Field(() => String, { description: 'Type of Entry' })
    entry: string;

    @Field(() => MoneyInput, {
        description: 'general money information for the entry',
    })
    money: MoneyInput;
}
