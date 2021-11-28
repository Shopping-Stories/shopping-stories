import { ObjectId } from 'mongoose';
import { Field, ID, Int, InputType } from 'type-graphql';

@InputType()
export class UpdateTobaccoMark {
    @Field(() => ID, { nullable: true, description: 'words' })
    markID?: ObjectId;

    @Field({ nullable: true, description: '' })
    markName?: string;
}

@InputType()
export class UpdatePoundsShillingsPence {
    @Field({ description: 'Number of pounds', nullable: true })
    pounds?: number;

    @Field({ description: 'Number of shillings', nullable: true })
    shilling?: number;

    @Field({ description: 'Number of Pence', nullable: true })
    pence?: number;
}

@InputType()
export class UpdateMoney {
    @Field({ description: '', nullable: true })
    quantity?: string;

    @Field({ description: '', nullable: true })
    commodity?: string;

    @Field({ description: '', nullable: true })
    colony?: string;

    @Field(() => UpdatePoundsShillingsPence, {
        description: '',
        nullable: true,
    })
    sterling?: UpdatePoundsShillingsPence;

    @Field(() => UpdatePoundsShillingsPence, {
        description: '',
        nullable: true,
    })
    currency?: UpdatePoundsShillingsPence;
}
@InputType()
export class UpdateNote {
    @Field({ description: '', nullable: true })
    noteNum?: number;

    @Field({ description: '', nullable: true })
    totalWeight?: number;

    @Field({ description: '', nullable: true })
    barrelWeight?: number;

    @Field({ description: '', nullable: true })
    tobaccoWeight?: number;
}

@InputType()
export class UpdateMeta {
    @Field(() => String, {
        description: 'Ledger containing this Entry',
        nullable: true,
    })
    ledger?: string;

    @Field(() => String, {
        description: 'Reel of the Entry',
        nullable: true,
    })
    reel?: string;

    @Field(() => String, { description: 'Store Owner', nullable: true })
    owner?: string;

    @Field(() => String, { description: 'Name of Store', nullable: true })
    store?: string;

    @Field(() => String, {
        description: 'Year the entry was made',
        nullable: true,
    })
    year?: string;

    @Field(() => String, {
        description: 'Folio the entry is contained in',
        nullable: true,
    })
    folioPage?: string;

    @Field(() => String, {
        description: 'ID of entry within Folio',
        nullable: true,
    })
    entryID?: string;

    @Field(() => String, { description: 'comments', nullable: true })
    comments?: string;
}

@InputType()
export class UpdateMentionedItems {
    @Field({ description: '', nullable: true })
    quantity?: number;

    @Field({ description: '', nullable: true })
    qualifier?: string;

    @Field({ description: '', nullable: true })
    item?: string;
}

@InputType()
export class UpdateItemOrService {
    @Field({ description: '', nullable: true })
    quantity?: number;

    @Field({ description: '', nullable: true })
    qualifier?: string;

    @Field(() => [String], { description: '', nullable: true })
    variants?: string[];

    @Field({ description: '', nullable: true })
    item?: string;

    @Field({ description: '', defaultValue: '', nullable: true })
    category?: string;

    @Field({ description: '', defaultValue: '', nullable: true })
    subcategory?: string;

    @Field(() => UpdatePoundsShillingsPence, {
        description: '',
        nullable: true,
    })
    unitCost?: UpdatePoundsShillingsPence;

    @Field(() => UpdatePoundsShillingsPence, {
        description: '',
        nullable: true,
    })
    itemCost?: UpdatePoundsShillingsPence;
}
@InputType()
export class UpdateItemEntry {
    @Field({ description: '', nullable: true })
    perOrder?: number;

    @Field({ description: '', nullable: true })
    percentage?: number;

    @Field(() => [UpdateItemOrService], {
        description: '',
        nullable: 'items',
    })
    itemsOrServices: UpdateItemOrService[];

    @Field(() => [UpdateMentionedItems], {
        description: '',
        nullable: true,
    })
    itemsMentioned?: UpdateMentionedItems[];
}

@InputType()
export class UpdateTobaccoMoney {
    @Field({ description: 'words', nullable: true })
    moneyType?: string;

    @Field({ description: 'words', nullable: true })
    tobaccoAmount?: number;

    @Field({ description: 'words', nullable: true })
    rateForTobacco?: UpdatePoundsShillingsPence;

    @Field({ description: 'words', nullable: true })
    casksInTransaction?: number;

    @Field({ description: 'words', nullable: true })
    tobaccoSold?: UpdatePoundsShillingsPence;

    @Field({ description: 'words', nullable: true })
    casksSoldForEach?: UpdatePoundsShillingsPence;
}

@InputType()
export class UpdateTobaccoEntry {
    @Field({ description: 'words', nullable: true })
    entry?: string;

    @Field(() => [UpdateTobaccoMark], { description: '', nullable: true })
    marks?: UpdateTobaccoMark[];

    @Field(() => [UpdateNote], { description: '', nullable: true })
    notes?: UpdateNote[];

    @Field(() => [UpdateTobaccoMoney], { description: '', nullable: true })
    money?: UpdateTobaccoMoney[];

    @Field({ description: 'words', nullable: true })
    tobaccoShaved?: number;
}

@InputType()
export class UpdateRegularEntry {
    @Field({ description: 'words', nullable: true })
    entry?: string;

    @Field(() => [UpdateTobaccoMark], { description: '', nullable: true })
    tobaccoMarks?: UpdateTobaccoMark[];

    @Field(() => [UpdateMentionedItems], {
        description: '',
        nullable: true,
    })
    itemsMentioned?: UpdateMentionedItems[];
}

@InputType()
export class UpdatePeoplePlaces {
    @Field({ description: 'Persons name', nullable: true })
    name?: string;

    @Field(() => ID, { description: 'words', nullable: true })
    id?: ObjectId;
}

@InputType()
export class UpdateDate {
    @Field(() => Int, { description: 'day of date', nullable: true })
    day?: number;

    @Field(() => Int, { description: 'month of date', nullable: true })
    month?: number;

    @Field(() => Int, { description: 'year of date', nullable: true })
    year?: number;

    @Field(() => Date, { description: 'complete date', nullable: true })
    fullDate?: Date;
}

@InputType()
export class UpdateAccountHolder {
    @Field(() => String, {
        description: "Prefix of account holder's name",
        nullable: true,
    })
    prefix?: string;

    @Field(() => String, {
        description: 'First name of account holder',
        nullable: true,
    })
    accountFirstName?: string;

    @Field(() => String, {
        description: 'Last name of account holder',
        nullable: true,
    })
    accountLastName?: string;

    @Field(() => String, {
        description: 'Suffix of account holder',
        nullable: true,
    })
    suffix?: string;

    @Field(() => String, {
        description: 'Profession of account holder',
        nullable: true,
    })
    profession?: string;

    @Field(() => String, { description: 'Location?', nullable: true })
    location?: string;

    @Field(() => String, { description: 'Reference?', nullable: true })
    reference?: string;

    @Field(() => Number, {
        description: 'Debt or Credit transaction',
        nullable: true,
    })
    debitOrCredit?: number;

    @Field(() => ID, {
        description:
            'ID of the accountholder to reference in peoples master list',
        nullable: true,
    })
    accountHolderID?: ObjectId;
}

@InputType()
export class UpdateEntryInput {
    @Field(() => UpdateAccountHolder, {
        description: 'Information on the account holder in the transaction',
        nullable: true,
    })
    accountHolder?: UpdateAccountHolder;

    @Field(() => UpdateMeta, {
        description: 'Meta information of the entry',
        nullable: true,
    })
    meta?: UpdateMeta;

    @Field(() => UpdateDate, {
        description: 'Date of entry',
        nullable: true,
    })
    dateInfo?: UpdateDate;

    @Field(() => [String], { description: '', nullable: true })
    folioRefs?: [string];

    @Field(() => [String], { description: '', nullable: true })
    ledgerRefs?: [string];

    @Field(() => [UpdateItemEntry], { nullable: true })
    itemEntries?: UpdateItemEntry[] | null;

    @Field(() => UpdateTobaccoEntry, { nullable: true })
    tobaccoEntry?: UpdateTobaccoEntry | null;

    @Field(() => UpdateRegularEntry, { nullable: true })
    regularEntry?: UpdateRegularEntry | null;

    @Field(() => [UpdatePeoplePlaces], {
        description: 'People referenced in this entry',
        nullable: true,
    })
    people?: UpdatePeoplePlaces[];

    @Field(() => [UpdatePeoplePlaces], {
        description: 'Places referenced in this entry',
        nullable: true,
    })
    places?: UpdatePeoplePlaces[];

    @Field(() => String, { description: 'Type of Entry', nullable: true })
    entry?: string;

    @Field(() => UpdateMoney, {
        description: 'general money information for the entry',
        nullable: true,
    })
    money?: UpdateMoney;
}
