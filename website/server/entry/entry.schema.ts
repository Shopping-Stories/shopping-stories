import {
    getModelForClass,
    index,
    modelOptions,
    prop,
} from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';

export type EntryDocument = Entry & Document;

@ObjectType()
export class TobaccoMarkObject {
    @prop()
    @Field(() => ID, { description: 'words' })
    markID: ObjectId;

    @prop()
    @Field({ description: '' })
    markName: string;
}

@ObjectType()
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

@ObjectType()
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
@ObjectType()
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

@ObjectType()
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

    @prop({ type: () => String })
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

@ObjectType()
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

@ObjectType()
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
@ObjectType()
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

@ObjectType()
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

@ObjectType()
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

@ObjectType()
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

@ObjectType()
export class PersonObject {
    @prop()
    @Field({ description: 'Persons name' })
    name: string;

    @prop()
    @Field(() => ID, {
        description: 'ID of this person in the people collection',
        nullable: true,
    })
    id: ObjectId;
}
@ObjectType()
export class PlaceObject {
    @prop()
    @Field({ description: 'Place name' })
    name: string;

    @prop()
    @Field(() => ID, {
        description: 'ID of that place in places collection',
        nullable: true,
    })
    id: ObjectId;
}

@ObjectType()
export class DateObject {
    @prop()
    @Field(() => Int, { description: 'day of date' })
    day: number;

    @prop()
    @Field(() => Int, { description: 'month of date' })
    month: number;

    @prop()
    @Field(() => Int, { description: 'year of date' })
    year: number;

    @prop({ nullable: true })
    @Field(() => Date, { description: 'complete date', nullable: true })
    fullDate: Date;
}

@ObjectType()
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
    @Field(() => String, {
        description:
            'ID of the accountholder to reference in peoples master list',
        defaultValue: null,
    })
    accountHolderID: ObjectId | null;
}

@ObjectType('Entry', { description: 'Single Entry' })
@modelOptions({
    schemaOptions: { timestamps: true },
})
@index(
    {
        'accountHolder.accountFirstName': 'text',
        'accountHolder.accountLastName': 'text',
        'itemEntry.itemsMentioned.item': 'text',
        'itemEntry.itemsOrServices.item': 'text',
        'people.name': 'text',
        'places.name': 'text',
        'regularEntry.entry': 'text',
        'regularEntry.itemsMentioned.item': 'text',
        'tobaccoEntry.entry': 'text',
    },
    // @ts-ignore
    { name: 'search_index' },
)
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

    @prop({ _id: false, type: () => [PersonObject], required: true })
    @Field(() => [PersonObject], {
        description: 'People referenced in this entry',
    })
    people: PersonObject[];

    @prop({ _id: false, type: () => [PlaceObject], required: true })
    @Field(() => [PlaceObject], {
        description: 'Places referenced in this entry',
    })
    places: PlaceObject[];

    @prop({ default: '' })
    @Field(() => String, { description: 'Type of Entry' })
    entry: string;

    @prop({ _id: false, required: true })
    @Field(() => MoneyObject, {
        description: 'general money information for the entry',
    })
    money: MoneyObject;
}
export const EntryModel = mongoose.models.Entry || getModelForClass(Entry);
