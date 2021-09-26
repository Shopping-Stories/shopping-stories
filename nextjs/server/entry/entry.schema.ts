import { getModelForClass, prop } from '@typegoose/typegoose';
import { createUnionType, Field, ID, Int, ObjectType } from 'type-graphql';
import mongoose, { Document, ObjectId } from 'mongoose';

export type EntryDocument = Entry & Document;

@ObjectType('MoneyObject')
export class MoneyObject {
	@prop()
	@Field({ description: 'Number of pounds' })
	L: number;

	@prop()
	@Field({ description: 'Number of shillings' })
	S: number;

	@prop()
	@Field({ description: 'Number of Pence' })
	D: number;
}

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
}

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

@ObjectType('TobaccoRateObject')
export class TobaccoRateObject {
	@prop()
	@Field({ description: '' })
	MoneyType: string;

	@prop()
	@Field({ description: '' })
	TobaccoAmount: number;

	@prop({ type: () => MoneyObject })
	@Field((_type) => MoneyObject, { description: '' })
	RateForTobacco: MoneyObject;

	@prop()
	@Field({ description: '' })
	CaskInTransaction: number;

	@prop({ type: () => MoneyObject })
	@Field({ description: '' })
	CasksSoldFor: MoneyObject;
}

@ObjectType('TobaccoEntryObject')
export class TobaccoEntryObject {
	@prop()
	@Field({ description: 'words' })
	Entry: string;

	@prop()
	@Field({
		description: 'Signifies which person is represented in the exchange',
	})
	Mark: string;

	@prop({ type: () => [NoteObject] })
	@Field((_type) => [NoteObject], { description: '' })
	Notes: NoteObject[];

	@prop({ type: () => [TobaccoRateObject] })
	@Field((_type) => [TobaccoRateObject], { description: '' })
	Money: TobaccoRateObject[];
}

export const EntryUnion = createUnionType({
	name: 'EntryUnion',
	types: () => [ItemEntry, TobaccoEntryObject],
	resolveType(value) {
		if (typeof value.Money !== undefined) {
			return ItemEntry;
		}
		return TobaccoEntryObject;
	},
});

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

@ObjectType('Entry', { description: 'Single Entry' })
export class Entry {
	@Field((_type) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	_id: ObjectId;

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Reel of the Entry' })
	Reel: number;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Store Owner' })
	Owner: string;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Name of Store' })
	Store: string;

	@prop({ type: () => [Number], required: true })
	@Field((_type) => [Int], { description: 'Year the entry was made' })
	Year: number[];

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Folio the entry is contained in' })
	FolioPage: number;

	@prop({ required: true })
	@Field((_type) => String, { description: 'ID of entry within Folio' })
	EntryID: string;

	@prop({ required: true })
	@Field((_type) => String, { description: "Prefix of account holder's name" })
	Prefix: string;

	@prop({ required: true })
	@Field((_type) => String, { description: 'First name of account holder' })
	AccountFirstName: string;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Last name of account holder' })
	AccountLastName: string;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Suffix of account holder' })
	Suffix: string;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Profession of account holder' })
	Profession: string;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Location?' })
	Location: string;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Reference?' })
	Reference: string;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Debt or Credit transaction' })
	DrCr: string;

	@prop({ type: () => DateObject, required: true })
	@Field((_type) => DateObject, { description: 'Date of entry' })
	Date: DateObject;

	@prop({ name: 'ItemEntry', type: () => [ItemEntry], default: null })
	@Field((_type) => [ItemEntry], { nullable: true })
	ItemEntry?: ItemEntry[] | null;

	@prop({ name: 'TobaccoEntry', type: () => TobaccoEntryObject, default: null })
	@Field((_type) => TobaccoEntryObject, { nullable: true })
	TobaccoEntry?: TobaccoEntryObject | null;

	@prop({ type: () => [String], required: true })
	@Field((_type) => [String], {
		description: 'People referenced in this entry',
	})
	People: string[];

	@prop({ type: () => [String], required: true })
	@Field((_type) => [String], {
		description: 'Places referenced in this entry',
	})
	Places: string[];

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Reference to another Folio page' })
	FolioReference: number;

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Type of Entry' })
	EntryType: number;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Ledger containing this Entry' })
	Ledger: string;

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Quantity of commodity purchased' })
	Quantity: number;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Commodity being purchased' })
	Commodity: string;

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Sterling pounds used in transaction' })
	L1: number;

	@prop({ required: true })
	@Field((_type) => Int, {
		description: 'Sterling shillings used in transaction',
	})
	S1: number;

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Sterling pence used in transaction' })
	D1: number;

	@prop({ required: true })
	@Field((_type) => String, { description: 'Type of Colonial currency' })
	Colony: string;

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Colonial pounds used in transaction' })
	L2: number;

	@prop({ required: true })
	@Field((_type) => Int, {
		description: 'Colonial shillings used in transaction',
	})
	S2: number;

	@prop({ required: true })
	@Field((_type) => Int, { description: 'Colonial pence used in transaction' })
	D2: number;

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
