import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
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
	markName: string;
}

@ObjectType('PoundsShillingsPence')
export class PoundsShillingsPence {
	@prop()
	@Field({ description: 'Number of pounds', defaultValue: 0.0 })
	pounds: number;

	@prop()
	@Field({ description: 'Number of shillings', defaultValue: 0.0 })
	shilling: number;

	@prop()
	@Field({ description: 'Number of Pence', defaultValue: 0.0 })
	pence: number;
}

@ObjectType('MoneyObject')
export class MoneyObject {
	@prop()
	@Field({ description: '', defaultValue: '' })
	quantity: string;

	@prop()
	@Field({ description: '' })
	commodity: string;

	@prop()
	@Field({ description: '', defaultValue: '' })
	colony: string;

	@prop({ _id: false })
	@Field((_type) => PoundsShillingsPence, { description: '' })
	sterling: PoundsShillingsPence;

	@prop({ _id: false })
	@Field((_type) => PoundsShillingsPence, { description: '' })
	currency: PoundsShillingsPence;
}
@ObjectType('NoteObject')
export class NoteObject {
	@prop()
	@Field({ description: '' })
	noteNum: number;

	@prop()
	@Field({ description: '' })
	totalWeight: number;

	@prop()
	@Field({ description: '' })
	barrelWeight: number;

	@prop()
	@Field({ description: '' })
	tobaccoWeight: number;
}

@ObjectType('MetaObject')
export class MetaObject {
	@prop()
	@Field((_type) => String, { description: 'Ledger containing this Entry' })
	ledger: string;

	@prop()
	@Field((_type) => String, { description: 'Reel of the Entry' })
	reel: string;

	@prop()
	@Field((_type) => String, { description: 'Store Owner' })
	owner: string;

	@prop()
	@Field((_type) => String, { description: 'Name of Store' })
	store: string;

	@prop({ type: () => [Number] })
	@Field((_type) => String, { description: 'Year the entry was made' })
	year: string;

	@prop()
	@Field((_type) => String, { description: 'Folio the entry is contained in' })
	folioPage: string;

	@prop()
	@Field((_type) => String, { description: 'ID of entry within Folio' })
	entryID: string;

	@prop()
	@Field((_type) => String, { description: 'comments' })
	comments: string;
}

@ObjectType('MentionedItemsObject')
export class MentionedItemsObject {
	@prop()
	@Field({ description: '' })
	quantity: number;

	@prop()
	@Field({ description: '' })
	qualifier: string;

	@prop()
	@Field({ description: '' })
	item: string;
}

@ObjectType('ItemsOrServicesObject')
export class ItemOrServiceObject {
	@prop()
	@Field({ description: '' })
	quantity: number;

	@prop()
	@Field({ description: '' })
	qualifier: string;

	@prop({ type: () => [String] })
	@Field((_type) => [String], { description: '' })
	variants: string[];

	@prop()
	@Field({ description: '' })
	item: string;

	@prop()
	@Field({ description: '', defaultValue: '' })
	category: string;

	@prop()
	@Field({ description: '', defaultValue: '' })
	subcategory: string;

	@prop({ _id: false, type: () => PoundsShillingsPence })
	@Field((_type) => PoundsShillingsPence, { description: '' })
	unitCost: PoundsShillingsPence;

	@prop({ _id: false, type: () => PoundsShillingsPence })
	@Field((_type) => PoundsShillingsPence, { description: '' })
	itemCost: PoundsShillingsPence;
}
@ObjectType('ItemEntryObject')
export class ItemEntryObject {
	@prop()
	@Field({ description: '' })
	perOrder: number;

	@prop()
	@Field({ description: '' })
	percentage: number;

	@prop({ _id: false, type: () => [ItemOrServiceObject] })
	@Field((_type) => [ItemOrServiceObject], {
		description: '',
		nullable: 'items',
	})
	itemsOrServices: ItemOrServiceObject[];

	@prop({ _id: false, type: () => [MentionedItemsObject] })
	@Field((_type) => [MentionedItemsObject], { description: '' })
	itemsMentioned: MentionedItemsObject[];
}

@ObjectType('TobaccoMoneyObject')
export class TobaccoMoneyObject {
	@prop()
	@Field({ description: 'words' })
	moneyType: string;

	@prop()
	@Field({ description: 'words' })
	tobaccoAmount: number;

	@prop({ _id: false })
	@Field({ description: 'words' })
	rateForTobacco: PoundsShillingsPence;

	@prop()
	@Field({ description: 'words' })
	casksInTransaction: number;

	@prop({ _id: false })
	@Field({ description: 'words' })
	tobaccoSold: PoundsShillingsPence;

	@prop({ _id: false })
	@Field({ description: 'words' })
	casksSoldForEach: PoundsShillingsPence;
}

@ObjectType('TobaccoEntryObject')
export class TobaccoEntryObject {
	@prop()
	@Field({ description: 'words' })
	entry: string;

	@prop({ _id: false, type: () => [TobaccoMarkObject] })
	@Field((_type) => [TobaccoMarkObject], { description: '' })
	marks: TobaccoMarkObject[];

	@prop({ _id: false, type: () => [NoteObject] })
	@Field((_type) => [NoteObject], { description: '' })
	notes: NoteObject[];

	@prop({ _id: false, type: () => [TobaccoMoneyObject] })
	@Field((_type) => [TobaccoMoneyObject], { description: '' })
	money: TobaccoMoneyObject[];

	@prop()
	@Field({ description: 'words' })
	tobaccoShaved: number;
}

@ObjectType('RegularEntryObject')
export class RegularEntryObject {
	@prop()
	@Field({ description: 'words' })
	entry: string;

	@prop({ _id: false, type: () => [TobaccoMarkObject] })
	@Field((_type) => [TobaccoMarkObject], { description: '' })
	tobaccoMarks: TobaccoMarkObject[];

	@prop({ _id: false, type: () => [MentionedItemsObject] })
	@Field((_type) => [MentionedItemsObject], { description: '' })
	itemsMentioned: MentionedItemsObject[];
}

@ObjectType('PeoplePlacesObject')
export class PeoplePlacesObject {
	@prop()
	@Field({ description: 'Persons name' })
	name: string;

	@prop()
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

@ObjectType('DateObject', { description: 'Single Date' })
export class DateObject {
	@prop()
	@Field((_type) => Int, { description: 'day of date' })
	day: number;

	@prop()
	@Field((_type) => Int, { description: 'month of date' })
	month: number;

	@prop()
	@Field((_type) => String, { description: 'year of date' })
	year: string;

	@prop()
	@Field((_type) => Date, { description: 'complete date', nullable: true })
	fullDate: Date;
}

@ObjectType('AccHolderObject', { description: '' })
export class AccHolderObject {
	@prop()
	@Field((_type) => String, { description: "Prefix of account holder's name" })
	prefix: string;

	@prop()
	@Field((_type) => String, { description: 'First name of account holder' })
	accountFirstName: string;

	@prop()
	@Field((_type) => String, { description: 'Last name of account holder' })
	accountLastName: string;

	@prop()
	@Field((_type) => String, { description: 'Suffix of account holder' })
	suffix: string;

	@prop()
	@Field((_type) => String, { description: 'Profession of account holder' })
	profession: string;

	@prop()
	@Field((_type) => String, { description: 'Location?' })
	location: string;

	@prop()
	@Field((_type) => String, { description: 'Reference?' })
	reference: string;

	@prop()
	@Field((_type) => Number, { description: 'Debt or Credit transaction' })
	debitOrCredit: number;

	@prop()
	@Field((_type) => ID, {
		description: 'ID of the accountholder to reference in peoples master list',
	})
	accountHolderID: ObjectId;
}

@ObjectType('Entry', { description: 'Single Entry' })
@modelOptions({
	schemaOptions: { timestamps: true },
})
export class Entry {
	@Field((_type) => ID, { description: 'String of MongoDB ObjectId' })
	public get id(): string {
		return `${this._id}`; // Converts type ObjectId of _id to String
	}

	_id: ObjectId;

	@prop({ _id: false, type: () => AccHolderObject, required: true })
	@Field((_type) => AccHolderObject, {
		description: 'Information on the account holder in the transaction',
	})
	accountHolder: AccHolderObject;

	@prop({ _id: false, type: () => MetaObject, required: true })
	@Field((_type) => MetaObject, {
		description: 'Meta information of the entry',
	})
	meta: MetaObject;

	@prop({ _id: false, type: () => DateObject, required: true })
	@Field((_type) => DateObject, { description: 'Date of entry' })
	dateInfo: DateObject;

	@prop()
	@Field((_type) => [String], { description: '' })
	folioRefs: string[];

	@prop()
	@Field((_type) => [String], { description: '' })
	ledgerRefs: string[];

	@prop({
		_id: false,
		name: 'ItemEntry',
		type: () => [ItemEntryObject],
		default: null,
	})
	@Field((_type) => [ItemEntryObject], { nullable: true })
	itemEntries?: ItemEntryObject[] | null;

	@prop({
		_id: false,
		name: 'TobaccoEntry',
		type: () => TobaccoEntryObject,
		default: null,
	})
	@Field((_type) => TobaccoEntryObject, { nullable: true })
	tobaccoEntry?: TobaccoEntryObject | null;

	@prop({
		_id: false,
		name: 'TobaccoEntry',
		type: () => RegularEntryObject,
		default: null,
	})
	@Field((_type) => RegularEntryObject, { nullable: true })
	regularEntry?: RegularEntryObject | null;

	@prop({ _id: false, type: () => [PeoplePlacesObject], required: true })
	@Field((_type) => [PeoplePlacesObject], {
		description: 'People referenced in this entry',
	})
	people: PeoplePlacesObject[];

	@prop({ _id: false, type: () => [PeoplePlacesObject], required: true })
	@Field((_type) => [PeoplePlacesObject], {
		description: 'Places referenced in this entry',
	})
	places: PeoplePlacesObject[];

	@prop({ required: true })
	@Field((_type) => String, { description: 'Type of Entry' })
	entry: string;

	@prop({ _id: false, required: true })
	@Field((_type) => MoneyObject, {
		description: 'general money information for the entry',
	})
	money: MoneyObject;
}
export const EntryModel = mongoose.models.Entry || getModelForClass(Entry);
