import { getModelForClass, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';

export type EntryDocument = Entry & Document;

@ObjectType('TobaccoMarkObject')
export class TobaccoMarkObject {
	@prop()
	@Field((_type) => ID, { description: 'words' })
	markID: ObjectId;

	@prop()
	@Field({ description: '' })
	markString: string;
}

@ObjectType('PoundsShillingsPence')
export class PoundsShillingsPence {
	@prop()
	@Field({ description: 'Number of pounds' })
	Pounds: number;

	@prop()
	@Field({ description: 'Number of shillings' })
	Shilling: number;

	@prop()
	@Field({ description: 'Number of Pence' })
	Pence: number;
}

@ObjectType('MoneyObject')
export class MoneyObject {
	@prop()
	@Field({ description: '' })
	Quantity: string;

	@prop()
	@Field({ description: '' })
	Commodity: string;

	@prop()
	@Field({ description: '' })
	Colony: string;

	@prop()
	@Field((_type) => PoundsShillingsPence, { description: '' })
	Sterling: PoundsShillingsPence;

	@prop()
	@Field((_type) => PoundsShillingsPence, { description: '' })
	Currency: PoundsShillingsPence;
}
/*
@ObjectType('ItemEntry')
export class ItemEntry {
	@prop()
	@Field({ description: 'Quantity of item' })
	ItemQuantity: number;

	@prop()
	@Field({ description: 'Item descriptors' })
	Qualifier: string;

	@prop()
	@Field({ description: 'Item name' })
	Item: string;

	@prop()
	@Field({ description: 'Price per unit' })
	UnitPrice: string;

	@prop()
	@Field({ description: '' })
	TransactionCost: string;

	@prop({ type: () => MoneyObject })
	@Field((_type) => MoneyObject, { description: 'Money used in transaction' })
	Money: MoneyObject;
}*/

@ObjectType('NoteObject')
export class NoteObject {
	@prop()
	@Field({ description: '' })
	NoteNum: number;

	@prop()
	@Field({ description: '' })
	TotalWeight: number;

	@prop()
	@Field({ description: '' })
	BarrelWeight: number;

	@prop()
	@Field({ description: '' })
	TobaccoWeight: number;
}

@ObjectType('MetaObject')
export class MetaObject {
	@prop()
	@Field((_type) => String, { description: 'Ledger containing this Entry' })
	Ledger: string;

	@prop()
	@Field((_type) => Int, { description: 'Reel of the Entry' })
	Reel: number;

	@prop()
	@Field((_type) => String, { description: 'Store Owner' })
	Owner: string;

	@prop()
	@Field((_type) => String, { description: 'Name of Store' })
	Store: string;

	@prop({ type: () => [Number] })
	@Field((_type) => [Int], { description: 'Year the entry was made' })
	Year: number[];

	@prop()
	@Field((_type) => Int, { description: 'Folio the entry is contained in' })
	FolioPage: number;

	@prop()
	@Field((_type) => String, { description: 'ID of entry within Folio' })
	EntryID: string;
}

@ObjectType('MentionedItemsObject')
export class MentionedItemsObject {
	@prop()
	@Field({ description: '' })
	Quantity: number;

	@prop()
	@Field({ description: '' })
	Qualifier: string;

	@prop()
	@Field({ description: '' })
	Item: string;
}

@ObjectType('ItemsOrServicesObject')
export class ItemOrServiceObject {
	@prop()
	@Field({ description: '' })
	Quantity: number;

	@prop()
	@Field({ description: '' })
	Qualifier: string;

	@prop({ type: () => String })
	@Field((_type) => String, { description: '' })
	Variant: string[];

	@prop()
	@Field({ description: '' })
	Item: string;

	@prop()
	@Field({ description: '' })
	Category: string;

	@prop()
	@Field({ description: '' })
	Subcategory: string;

	@prop({ type: () => PoundsShillingsPence })
	@Field((_type) => PoundsShillingsPence, { description: '' })
	UnitCost: PoundsShillingsPence;

	@prop({ type: () => PoundsShillingsPence })
	@Field((_type) => PoundsShillingsPence, { description: '' })
	ItemCost: PoundsShillingsPence;
}
@ObjectType('ItemEntryObject')
export class ItemEntryObject {
	@prop()
	@Field({ description: '' })
	perOrder: number;

	@prop()
	@Field({ description: '' })
	percentage: number;

	@prop({ type: () => [ItemOrServiceObject] })
	@Field((_type) => [ItemOrServiceObject], { description: '' })
	itemsOrServices: ItemOrServiceObject[];

	@prop({ type: () => [MentionedItemsObject] })
	@Field((_type) => [MentionedItemsObject], { description: '' })
	itemsMentioned: MentionedItemsObject[];
}

@ObjectType('TobaccoRateObject')
export class TobaccoRateObject {
	@prop()
	@Field({ description: '' })
	MoneyType: string;

	@prop()
	@Field({ description: '' })
	TobaccoAmount: number;

	@prop({ type: () => PoundsShillingsPence })
	@Field((_type) => PoundsShillingsPence, { description: '' })
	RateForTobacco: PoundsShillingsPence;

	@prop()
	@Field({ description: '' })
	CaskInTransaction: number;

	@prop({ type: () => PoundsShillingsPence })
	@Field((_type) => PoundsShillingsPence, { description: '' })
	CasksSoldFor: PoundsShillingsPence;
}

@ObjectType('TobaccoMoneyObject')
export class TobaccoMoneyObject {
	@prop()
	@Field({ description: 'words' })
	moneyType: string;

	@prop()
	@Field({ description: 'words' })
	tobaccoAmount: number;

	@prop()
	@Field({ description: 'words' })
	rateForTobacco: PoundsShillingsPence;

	@prop()
	@Field({ description: 'words' })
	casksInTransaction: number;

	@prop()
	@Field({ description: 'words' })
	tobaccoSold: PoundsShillingsPence;

	@prop()
	@Field({ description: 'words' })
	casksSoldForEach: PoundsShillingsPence;
}

@ObjectType('TobaccoEntryObject')
export class TobaccoEntryObject {
	@prop()
	@Field({ description: 'words' })
	Entry: string;

	@prop({ type: () => [TobaccoMarkObject] })
	@Field((_type) => [TobaccoMarkObject], { description: '' })
	Mark: TobaccoMarkObject[];

	@prop({ type: () => [NoteObject] })
	@Field((_type) => [NoteObject], { description: '' })
	Notes: NoteObject[];

	@prop({ type: () => [TobaccoRateObject] })
	@Field((_type) => [TobaccoRateObject], { description: '' })
	Money: TobaccoMoneyObject[];

	@prop()
	@Field({ description: 'words' })
	tobaccoShaved: number;
}

@ObjectType('RegularEntryObject')
export class RegularEntryObject {
	@prop()
	@Field({ description: 'words' })
	Entry: string;

	@prop({ type: () => [TobaccoMarkObject] })
	@Field((_type) => [TobaccoMarkObject], { description: '' })
	TM: TobaccoMarkObject[];

	@prop({ type: () => [MentionedItemsObject] })
	@Field((_type) => [MentionedItemsObject], { description: '' })
	Items: MentionedItemsObject[];
}

@ObjectType('PeoplePlacesObject')
export class PeoplePlacesObject {
	@prop()
	@Field({ description: 'Persons name' })
	Name: string;

	@prop()
	@Field((_type) => ID, { description: 'words' })
	ID: ObjectId;
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

@ObjectType('DateObject', { description: 'Single Date' })
export class DateObject {
	@prop()
	@Field((_type) => Int, { description: 'day of date' })
	day: number;

	@prop()
	@Field((_type) => Int, { description: 'month of date' })
	month: number;

	@prop()
	@Field((_type) => Int, { description: 'year of date' })
	year: number;

	@prop()
	@Field((_type) => Date, { description: 'complete date' })
	date: Date;
}

@ObjectType('AccHolderObject', { description: '' })
export class AccHolderObject {
	@prop()
	@Field((_type) => String, { description: "Prefix of account holder's name" })
	Prefix: string;

	@prop()
	@Field((_type) => String, { description: 'First name of account holder' })
	AccountFirstName: string;

	@prop()
	@Field((_type) => String, { description: 'Last name of account holder' })
	AccountLastName: string;

	@prop()
	@Field((_type) => String, { description: 'Suffix of account holder' })
	Suffix: string;

	@prop()
	@Field((_type) => String, { description: 'Profession of account holder' })
	Profession: string;

	@prop()
	@Field((_type) => String, { description: 'Location?' })
	Location: string;

	@prop()
	@Field((_type) => String, { description: 'Reference?' })
	Reference: string;

	@prop()
	@Field((_type) => Number, { description: 'Debt or Credit transaction' })
	DrCr: number;

	@prop()
	@Field((_type) => ID, {
		description: 'ID of the accountholder to reference in peoples master list',
	})
	accHolderID: ObjectId;
}

@ObjectType('Entry', { description: 'Single Entry' })
export class Entry {
	@Field((_type) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	_id: ObjectId;

	@prop({ type: () => AccHolderObject, required: true })
	@Field((_type) => AccHolderObject, {
		description: 'Information on the account holder in the transaction',
	})
	AccHolder: AccHolderObject;

	@prop({ type: () => MetaObject, required: true })
	@Field((_type) => MetaObject, {
		description: 'Meta information of the entry',
	})
	Meta: MetaObject;

	@prop({ type: () => DateObject, required: true })
	@Field((_type) => DateObject, { description: 'Date of entry' })
	Date: DateObject;

	@prop({ name: 'ItemEntry', type: () => [ItemEntryObject], default: null })
	@Field((_type) => [ItemEntryObject], { nullable: true })
	itemEntry?: ItemEntryObject[] | null;

	@prop({ name: 'TobaccoEntry', type: () => TobaccoEntryObject, default: null })
	@Field((_type) => TobaccoEntryObject, { nullable: true })
	tobaccoEntry?: TobaccoEntryObject | null;

	@prop({ name: 'TobaccoEntry', type: () => RegularEntryObject, default: null })
	@Field((_type) => RegularEntryObject, { nullable: true })
	regEntry?: RegularEntryObject | null;

	@prop({ type: () => [PeoplePlacesObject], required: true })
	@Field((_type) => [PeoplePlacesObject], {
		description: 'People referenced in this entry',
	})
	People: PeoplePlacesObject[];

	@prop({ type: () => [PeoplePlacesObject], required: true })
	@Field((_type) => [PeoplePlacesObject], {
		description: 'Places referenced in this entry',
	})
	Places: PeoplePlacesObject[];

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Reference to another Folio page' })
	FolioReference: number;

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Type of Entry' })
	EntryType: number;

	@prop({ required: true })
	@Field((_type) => MoneyObject, {
		description: 'general money information for the entry',
	})
	Money: MoneyObject;

	@prop({ required: true })
	@Field((_type) => Int, {
		description: 'Indicates if item would survive till today',
	})
	ArchMat: number;

	@prop({ required: true })
	@Field((_type) => Int, {
		description: 'Indicates if someone or someplace is mentioned in the entry',
	})
	GenMat: number;

	@prop({ required: true })
	@Field((_type) => String, { description: 'comments on the entry' })
	Final: string;
}

export const EntryModel = mongoose.models.Entry || getModelForClass(Entry);
