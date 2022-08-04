import {
    getModelForClass,
    index,
    modelOptions,
    prop,
} from '@typegoose/typegoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Field, ID, Int, ObjectType } from 'type-graphql';

export type ParsedEntryDocument = ParsedEntry & Document;

@ObjectType()
export class ParsedTobaccoMarkObject {
    @prop()
    @Field(() => ID, { description: 'words' })
    markID: ObjectId;

    @prop()
    @Field({ description: '' })
    markName: string;
}

@ObjectType()
export class ParsedPoundsShillingsPence {
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
export class ParsedMoneyObject {
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
    @Field(() => ParsedPoundsShillingsPence, { description: '' })
    sterling: ParsedPoundsShillingsPence;

    @prop({ _id: false })
    @Field(() => ParsedPoundsShillingsPence, { description: '' })
    currency: ParsedPoundsShillingsPence;
}
@ObjectType()
export class ParsedNoteObject {
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
export class ParsedMetaObject {
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
export class ParsedMentionedItemsObject {
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
export class ParsedItemOrServiceObject {
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

    @prop({ _id: false, type: () => ParsedPoundsShillingsPence })
    @Field(() => ParsedPoundsShillingsPence, { description: '' })
    unitCost: ParsedPoundsShillingsPence;

    @prop({ _id: false, type: () => ParsedPoundsShillingsPence })
    @Field(() => ParsedPoundsShillingsPence, { description: '' })
    itemCost: ParsedPoundsShillingsPence;
}
@ObjectType()
export class ParsedItemEntryObject {
    @prop()
    @Field({ description: '' })
    perOrder: number;

    @prop()
    @Field({ description: '' })
    percentage: number;

    @prop({ _id: false, type: () => [ParsedItemOrServiceObject] })
    @Field(() => [ParsedItemOrServiceObject], {
        description: '',
        nullable: 'items',
    })
    itemsOrServices: ParsedItemOrServiceObject[];

    @prop({ _id: false, type: () => [ParsedMentionedItemsObject] })
    @Field(() => [ParsedMentionedItemsObject], { description: '' })
    itemsMentioned: ParsedMentionedItemsObject[];
}

@ObjectType()
export class ParsedTobaccoMoneyObject {
    @prop()
    @Field({ description: 'words' })
    moneyType: string;

    @prop()
    @Field({ description: 'words' })
    tobaccoAmount: number;

    @prop({ _id: false })
    @Field({ description: 'words' })
    rateForTobacco: ParsedPoundsShillingsPence;

    @prop()
    @Field({ description: 'words' })
    casksInTransaction: number;

    @prop({ _id: false })
    @Field({ description: 'words' })
    tobaccoSold: ParsedPoundsShillingsPence;

    @prop({ _id: false })
    @Field({ description: 'words' })
    casksSoldForEach: ParsedPoundsShillingsPence;
}

@ObjectType()
export class ParsedTobaccoEntryObject {
    @prop()
    @Field({ description: 'words' })
    entry: string;

    @prop({ _id: false, type: () => [ParsedTobaccoMarkObject] })
    @Field(() => [ParsedTobaccoMarkObject], { description: '' })
    marks: ParsedTobaccoMarkObject[];

    @prop({ _id: false, type: () => [ParsedNoteObject] })
    @Field(() => [ParsedNoteObject], { description: '' })
    notes: ParsedNoteObject[];

    @prop({ _id: false, type: () => [ParsedTobaccoMoneyObject] })
    @Field(() => [ParsedTobaccoMoneyObject], { description: '' })
    money: ParsedTobaccoMoneyObject[];

    @prop()
    @Field({ description: 'words' })
    tobaccoShaved: number;
}

@ObjectType()
export class ParsedRegularEntryObject {
    @prop()
    @Field({ description: 'words' })
    entry: string;

    @prop({ _id: false, type: () => [ParsedTobaccoMarkObject] })
    @Field(() => [ParsedTobaccoMarkObject], { description: '' })
    tobaccoMarks: ParsedTobaccoMarkObject[];

    @prop({ _id: false, type: () => [ParsedMentionedItemsObject] })
    @Field(() => [ParsedMentionedItemsObject], { description: '' })
    itemsMentioned: ParsedMentionedItemsObject[];
}

@ObjectType()
export class ParsedPersonObject {
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
export class ParsedPlaceObject {
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
export class ParsedDateObject {
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
export class ParsedAccHolderObject {
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

@ObjectType('ParsedEntry', { description: 'Single Parsed Entry' })
@modelOptions({
    schemaOptions: { timestamps: true, collection: 'parsedEntries' },
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
export class ParsedEntry {
    @Field(() => ID, { description: 'String of MongoDB ObjectId' })
    public get id(): string {
        return `${this._id}`; // Converts type ObjectId of _id to String
    }

    _id: ObjectId;

    @prop({ _id: false, type: () => ParsedAccHolderObject, required: true })
    @Field(() => ParsedAccHolderObject, {
        description: 'Information on the account holder in the transaction',
    })
    accountHolder: ParsedAccHolderObject;

    @prop({ _id: false, type: () => ParsedMetaObject, required: true })
    @Field(() => ParsedMetaObject, {
        description: 'Meta information of the entry',
    })
    meta: ParsedMetaObject;

    @prop({ _id: false, type: () => ParsedDateObject, required: true })
    @Field(() => ParsedDateObject, { description: 'Date of entry' })
    dateInfo: ParsedDateObject;

    @prop({ type: () => [String] })
    @Field(() => [String], { description: '' })
    folioRefs: string[];

    @prop({ type: () => [String] })
    @Field(() => [String], { description: '' })
    ledgerRefs: string[];

    @prop({
        _id: false,
        name: 'ItemEntry',
        type: () => [ParsedItemEntryObject],
        default: null,
    })
    @Field((_type) => [ParsedItemEntryObject], { nullable: true })
    itemEntries?: ParsedItemEntryObject[] | null;

    @prop({
        _id: false,
        name: 'TobaccoEntry',
        type: () => ParsedTobaccoEntryObject,
        default: null,
    })
    @Field(() => ParsedTobaccoEntryObject, { nullable: true })
    tobaccoEntry?: ParsedTobaccoEntryObject | null;

    @prop({
        _id: false,
        name: 'TobaccoEntry',
        type: () => ParsedRegularEntryObject,
        default: null,
    })
    @Field(() => ParsedRegularEntryObject, { nullable: true })
    regularEntry?: ParsedRegularEntryObject | null;

    @prop({ _id: false, type: () => [ParsedPersonObject], required: true })
    @Field(() => [ParsedPersonObject], {
        description: 'People referenced in this entry',
    })
    people: ParsedPersonObject[];

    @prop({ _id: false, type: () => [ParsedPlaceObject], required: true })
    @Field(() => [ParsedPlaceObject], {
        description: 'Places referenced in this entry',
    })
    places: ParsedPlaceObject[];

    @prop({ default: '' })
    @Field(() => String, { description: 'Type of Entry' })
    entry: string;

    @prop({ _id: false, required: true })
    @Field(() => ParsedMoneyObject, {
        description: 'general money information for the entry',
    })
    money: ParsedMoneyObject;

    @prop({ default: '' })
    @Field(() => String, {
        description: 'Name of uploaded document parsed from',
    })
    documentName: string;
}
export const ParsedEntryModel =
    mongoose.models.ParsedEntry || getModelForClass(ParsedEntry);
