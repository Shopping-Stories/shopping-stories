import { ObjectId } from 'mongoose';
import { Field, ID, Int, InputType } from 'type-graphql';

@InputType()
export class TobaccoMarkInput {
    @Field((_type) => ID, { description: 'words' })
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

    @Field((_type) => PoundsShillingsPenceInput, { description: '' })
    sterling: PoundsShillingsPenceInput;

    @Field((_type) => PoundsShillingsPenceInput, { description: '' })
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
    @Field((_type) => String, { description: 'Ledger containing this Entry' })
    ledger: string;

    @Field((_type) => String, { description: 'Reel of the Entry' })
    reel: string;

    @Field((_type) => String, { description: 'Store Owner' })
    owner: string;

    @Field((_type) => String, { description: 'Name of Store' })
    store: string;

    @Field((_type) => String, { description: 'Year the entry was made' })
    year: string;

    @Field((_type) => String, {
        description: 'Folio the entry is contained in',
    })
    folioPage: string;

    @Field((_type) => String, { description: 'ID of entry within Folio' })
    entryID: string;

    @Field((_type) => String, { description: 'comments' })
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

    @Field((_type) => [String], { description: '' })
    variants: string[];

    @Field({ description: '' })
    item: string;

    @Field({ description: '', defaultValue: '' })
    category: string;

    @Field({ description: '', defaultValue: '' })
    subcategory: string;

    @Field((_type) => PoundsShillingsPenceInput, { description: '' })
    unitCost: PoundsShillingsPenceInput;

    @Field((_type) => PoundsShillingsPenceInput, { description: '' })
    itemCost: PoundsShillingsPenceInput;
}
@InputType()
export class ItemEntryInput {
    @Field({ description: '' })
    perOrder: number;

    @Field({ description: '' })
    percentage: number;

    @Field((_type) => [ItemOrServiceInput], {
        description: '',
        nullable: 'items',
    })
    itemsOrServices: ItemOrServiceInput[];

    @Field((_type) => [MentionedItemsInput], { description: '' })
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

    @Field((_type) => [TobaccoMarkInput], { description: '' })
    marks: TobaccoMarkInput[];

    @Field((_type) => [NoteInput], { description: '' })
    notes: NoteInput[];

    @Field((_type) => [TobaccoMoneyInput], { description: '' })
    money: TobaccoMoneyInput[];

    @Field({ description: 'words' })
    tobaccoShaved: number;
}

@InputType()
export class RegularEntryInput {
    @Field({ description: 'words' })
    entry: string;

    @Field((_type) => [TobaccoMarkInput], { description: '' })
    tobaccoMarks: TobaccoMarkInput[];

    @Field((_type) => [MentionedItemsInput], { description: '' })
    itemsMentioned: MentionedItemsInput[];
}

@InputType()
export class PeoplePlacesInput {
    @Field({ description: 'Persons name' })
    name: string;

    @Field((_type) => ID, { description: 'words', nullable: true })
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
    @Field((_type) => Int, { description: 'day of date' })
    day: number;

    @Field((_type) => Int, { description: 'month of date' })
    month: number;

    @Field((_type) => String, { description: 'year of date' })
    year: string;

    @Field((_type) => Date, { description: 'complete date', nullable: true })
    fullDate: Date;
}

@InputType()
export class AccountHolderInput {
    @Field((_type) => String, {
        description: "Prefix of account holder's name",
    })
    prefix: string;

    @Field((_type) => String, { description: 'First name of account holder' })
    accountFirstName: string;

    @Field((_type) => String, { description: 'Last name of account holder' })
    accountLastName: string;

    @Field((_type) => String, { description: 'Suffix of account holder' })
    suffix: string;

    @Field((_type) => String, { description: 'Profession of account holder' })
    profession: string;

    @Field((_type) => String, { description: 'Location?' })
    location: string;

    @Field((_type) => String, { description: 'Reference?' })
    reference: string;

    @Field((_type) => Number, { description: 'Debt or Credit transaction' })
    debitOrCredit: number;

    @Field((_type) => ID, {
        description:
            'ID of the accountholder to reference in peoples master list',
    })
    accountHolderID: ObjectId;
}

@InputType()
export class CreateEntryInput {
    @Field((_type) => AccountHolderInput, {
        description: 'Information on the account holder in the transaction',
    })
    accountHolder: AccountHolderInput;

    @Field((_type) => MetaInput, {
        description: 'Meta information of the entry',
    })
    meta: MetaInput;

    @Field((_type) => DateInput, { description: 'Date of entry' })
    dateInfo: DateInput;

    @Field((_type) => [String], { description: '' })
    folioRefs: [string];

    @Field((_type) => [String], { description: '' })
    ledgerRefs: [string];

    @Field((_type) => [ItemEntryInput], { nullable: true })
    itemEntries?: ItemEntryInput[] | null;

    @Field((_type) => TobaccoEntryInput, { nullable: true })
    tobaccoEntry?: TobaccoEntryInput | null;

    @Field((_type) => RegularEntryInput, { nullable: true })
    regularEntry?: RegularEntryInput | null;

    @Field((_type) => [PeoplePlacesInput], {
        description: 'People referenced in this entry',
    })
    people: PeoplePlacesInput[];

    @Field((_type) => [PeoplePlacesInput], {
        description: 'Places referenced in this entry',
    })
    places: PeoplePlacesInput[];

    @Field((_type) => String, { description: 'Type of Entry' })
    entry: string;

    @Field((_type) => MoneyInput, {
        description: 'general money information for the entry',
    })
    money: MoneyInput;
}
