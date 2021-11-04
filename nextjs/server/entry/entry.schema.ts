import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';

export type EntryDocument = Entry & Document;

@ObjectType('TobaccoMarkObject')
export class TobaccoMarkObject {
    @prop()
    @Field(() => ID, { description: 'words' })
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
    @Field(() => PoundsShillingsPence, { description: '' })
    sterling: PoundsShillingsPence;

    @prop({ _id: false })
    @Field(() => PoundsShillingsPence, { description: '' })
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
    @Field(() => String, { description: 'Ledger containing this Entry' })
    ledger: string;

    @prop()
    @Field(() => String, { description: 'Reel of the Entry' })
    reel: string;

    @prop()
    @Field(() => String, { description: 'Store Owner' })
    owner: string;

    @prop()
    @Field(() => String, { description: 'Name of Store' })
    store: string;

    @prop({ type: () => [Number] })
    @Field(() => String, { description: 'Year the entry was made' })
    year: string;

    @prop()
    @Field(() => String, {
        description: 'Folio the entry is contained in',
    })
    folioPage: string;

    @prop()
    @Field(() => String, { description: 'ID of entry within Folio' })
    entryID: string;

    @prop()
    @Field(() => String, { description: 'comments' })
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
    @Field(() => [String], { description: '' })
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
    @Field(() => PoundsShillingsPence, { description: '' })
    unitCost: PoundsShillingsPence;

    @prop({ _id: false, type: () => PoundsShillingsPence })
    @Field(() => PoundsShillingsPence, { description: '' })
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
    @Field(() => [ItemOrServiceObject], {
        description: '',
        nullable: 'items',
    })
    itemsOrServices: ItemOrServiceObject[];

    @prop({ _id: false, type: () => [MentionedItemsObject] })
    @Field(() => [MentionedItemsObject], { description: '' })
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
    @Field(() => [TobaccoMarkObject], { description: '' })
    marks: TobaccoMarkObject[];

    @prop({ _id: false, type: () => [NoteObject] })
    @Field(() => [NoteObject], { description: '' })
    notes: NoteObject[];

    @prop({ _id: false, type: () => [TobaccoMoneyObject] })
    @Field(() => [TobaccoMoneyObject], { description: '' })
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
    @Field(() => [TobaccoMarkObject], { description: '' })
    tobaccoMarks: TobaccoMarkObject[];

    @prop({ _id: false, type: () => [MentionedItemsObject] })
    @Field(() => [MentionedItemsObject], { description: '' })
    itemsMentioned: MentionedItemsObject[];
}

@ObjectType('PeoplePlacesObject')
export class PeoplePlacesObject {
    @prop()
    @Field({ description: 'Persons name' })
    name: string;

    @prop()
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

@ObjectType('DateObject', { description: 'Single Date' })
export class DateObject {
    @prop()
    @Field(() => Int, { description: 'day of date' })
    day: number;

    @prop()
    @Field(() => Int, { description: 'month of date' })
    month: number;

    @prop()
    @Field(() => String, { description: 'year of date' })
    year: string;

    @prop()
    @Field(() => Date, { description: 'complete date', nullable: true })
    fullDate: Date;
}

@ObjectType('AccHolderObject', { description: '' })
export class AccHolderObject {
    @prop()
    @Field(() => String, {
        description: "Prefix of account holder's name",
    })
    prefix: string;

    @prop()
    @Field(() => String, { description: 'First name of account holder' })
    accountFirstName: string;

    @prop()
    @Field(() => String, { description: 'Last name of account holder' })
    accountLastName: string;

    @prop()
    @Field(() => String, { description: 'Suffix of account holder' })
    suffix: string;

    @prop()
    @Field(() => String, { description: 'Profession of account holder' })
    profession: string;

    @prop()
    @Field(() => String, { description: 'Location?' })
    location: string;

    @prop()
    @Field(() => String, { description: 'Reference?' })
    reference: string;

    @prop()
    @Field(() => Number, { description: 'Debt or Credit transaction' })
    debitOrCredit: number;

    @prop()
    @Field(() => ID, {
        description:
            'ID of the accountholder to reference in peoples master list',
    })
    accountHolderID: ObjectId;
}

@ObjectType('Entry', { description: 'Single Entry' })
@modelOptions({
    schemaOptions: { timestamps: true },
})
export class Entry {
    @Field(() => ID, { description: 'String of MongoDB ObjectId' })
    public get id(): string {
        return `${this._id}`; // Converts type ObjectId of _id to String
    }

    _id: ObjectId;

    @prop({ _id: false, type: () => AccHolderObject, required: true })
    @Field(() => AccHolderObject, {
        description: 'Information on the account holder in the transaction',
    })
    accountHolder: AccHolderObject;

    @prop({ _id: false, type: () => MetaObject, required: true })
    @Field(() => MetaObject, {
        description: 'Meta information of the entry',
    })
    meta: MetaObject;

    @prop({ _id: false, type: () => DateObject, required: true })
    @Field(() => DateObject, { description: 'Date of entry' })
    dateInfo: DateObject;

    @prop({ type: () => [String] })
    @Field(() => [String], { description: '' })
    folioRefs: string[];

    @prop({ type: () => [String] })
    @Field(() => [String], { description: '' })
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
    @Field(() => TobaccoEntryObject, { nullable: true })
    tobaccoEntry?: TobaccoEntryObject | null;

    @prop({
        _id: false,
        name: 'TobaccoEntry',
        type: () => RegularEntryObject,
        default: null,
    })
    @Field(() => RegularEntryObject, { nullable: true })
    regularEntry?: RegularEntryObject | null;

    @prop({ _id: false, type: () => [PeoplePlacesObject], required: true })
    @Field(() => [PeoplePlacesObject], {
        description: 'People referenced in this entry',
    })
    people: PeoplePlacesObject[];

    @prop({ _id: false, type: () => [PeoplePlacesObject], required: true })
    @Field(() => [PeoplePlacesObject], {
        description: 'Places referenced in this entry',
    })
    places: PeoplePlacesObject[];

    @prop({ required: true })
    @Field(() => String, { description: 'Type of Entry' })
    entry: string;

    @prop({ _id: false, required: true })
    @Field(() => MoneyObject, {
        description: 'general money information for the entry',
    })
    money: MoneyObject;
}
export const EntryModel = mongoose.models.Entry || getModelForClass(Entry);
