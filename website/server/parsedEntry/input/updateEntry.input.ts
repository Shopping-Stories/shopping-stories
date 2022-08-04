import { ObjectId } from 'mongoose';
import { Field, ID, Int, InputType } from 'type-graphql';

@InputType()
export class ParsedUpdateTobaccoMark {
    @Field(() => ID, { nullable: true, description: 'words' })
    markID?: ObjectId;

    @Field({ nullable: true, description: '' })
    markName?: string;
}

@InputType()
export class ParsedUpdatePoundsShillingsPence {
    @Field({ description: 'Number of pounds', nullable: true })
    pounds?: number;

    @Field({ description: 'Number of shillings', nullable: true })
    shilling?: number;

    @Field({ description: 'Number of Pence', nullable: true })
    pence?: number;
}

@InputType()
export class ParsedUpdateMoney {
    @Field({ description: '', nullable: true })
    quantity?: string;

    @Field({ description: '', nullable: true })
    commodity?: string;

    @Field({ description: '', nullable: true })
    colony?: string;

    @Field(() => ParsedUpdatePoundsShillingsPence, {
        description: '',
        nullable: true,
    })
    sterling?: ParsedUpdatePoundsShillingsPence;

    @Field(() => ParsedUpdatePoundsShillingsPence, {
        description: '',
        nullable: true,
    })
    currency?: ParsedUpdatePoundsShillingsPence;
}
@InputType()
export class ParsedUpdateNote {
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
export class ParsedUpdateMeta {
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
export class ParsedUpdateMentionedItems {
    @Field({ description: '', nullable: true })
    quantity?: number;

    @Field({ description: '', nullable: true })
    qualifier?: string;

    @Field({ description: '', nullable: true })
    item?: string;
}

@InputType()
export class ParsedUpdateItemOrService {
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

    @Field(() => ParsedUpdatePoundsShillingsPence, {
        description: '',
        nullable: true,
    })
    unitCost?: ParsedUpdatePoundsShillingsPence;

    @Field(() => ParsedUpdatePoundsShillingsPence, {
        description: '',
        nullable: true,
    })
    itemCost?: ParsedUpdatePoundsShillingsPence;
}
@InputType()
export class ParsedUpdateItemEntry {
    @Field({ description: '', nullable: true })
    perOrder?: number;

    @Field({ description: '', nullable: true })
    percentage?: number;

    @Field(() => [ParsedUpdateItemOrService], {
        description: '',
        nullable: 'items',
    })
    itemsOrServices: ParsedUpdateItemOrService[];

    @Field(() => [ParsedUpdateMentionedItems], {
        description: '',
        nullable: true,
    })
    itemsMentioned?: ParsedUpdateMentionedItems[];
}

@InputType()
export class ParsedUpdateTobaccoMoney {
    @Field({ description: 'words', nullable: true })
    moneyType?: string;

    @Field({ description: 'words', nullable: true })
    tobaccoAmount?: number;

    @Field({ description: 'words', nullable: true })
    rateForTobacco?: ParsedUpdatePoundsShillingsPence;

    @Field({ description: 'words', nullable: true })
    casksInTransaction?: number;

    @Field({ description: 'words', nullable: true })
    tobaccoSold?: ParsedUpdatePoundsShillingsPence;

    @Field({ description: 'words', nullable: true })
    casksSoldForEach?: ParsedUpdatePoundsShillingsPence;
}

@InputType()
export class ParsedUpdateTobaccoEntry {
    @Field({ description: 'words', nullable: true })
    entry?: string;

    @Field(() => [ParsedUpdateTobaccoMark], { description: '', nullable: true })
    marks?: ParsedUpdateTobaccoMark[];

    @Field(() => [ParsedUpdateNote], { description: '', nullable: true })
    notes?: ParsedUpdateNote[];

    @Field(() => [ParsedUpdateTobaccoMoney], {
        description: '',
        nullable: true,
    })
    money?: ParsedUpdateTobaccoMoney[];

    @Field({ description: 'words', nullable: true })
    tobaccoShaved?: number;
}

@InputType()
export class ParsedUpdateRegularEntry {
    @Field({ description: 'words', nullable: true })
    entry?: string;

    @Field(() => [ParsedUpdateTobaccoMark], { description: '', nullable: true })
    tobaccoMarks?: ParsedUpdateTobaccoMark[];

    @Field(() => [ParsedUpdateMentionedItems], {
        description: '',
        nullable: true,
    })
    itemsMentioned?: ParsedUpdateMentionedItems[];
}

@InputType()
export class ParsedUpdatePeoplePlaces {
    @Field({ description: 'Persons name', nullable: true })
    name?: string;

    @Field(() => ID, { description: 'words', nullable: true })
    id?: ObjectId;
}

@InputType()
export class ParsedUpdateDate {
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
export class ParsedUpdateAccountHolder {
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
export class ParsedUpdateEntryInput {
    @Field(() => ParsedUpdateAccountHolder, {
        description: 'Information on the account holder in the transaction',
        nullable: true,
    })
    accountHolder?: ParsedUpdateAccountHolder;

    @Field(() => ParsedUpdateMeta, {
        description: 'Meta information of the entry',
        nullable: true,
    })
    meta?: ParsedUpdateMeta;

    @Field(() => ParsedUpdateDate, {
        description: 'Date of entry',
        nullable: true,
    })
    dateInfo?: ParsedUpdateDate;

    @Field(() => [String], { description: '', nullable: true })
    folioRefs?: [string];

    @Field(() => [String], { description: '', nullable: true })
    ledgerRefs?: [string];

    @Field(() => [ParsedUpdateItemEntry], { nullable: true })
    itemEntries?: ParsedUpdateItemEntry[] | null;

    @Field(() => ParsedUpdateTobaccoEntry, { nullable: true })
    tobaccoEntry?: ParsedUpdateTobaccoEntry | null;

    @Field(() => ParsedUpdateRegularEntry, { nullable: true })
    regularEntry?: ParsedUpdateRegularEntry | null;

    @Field(() => [ParsedUpdatePeoplePlaces], {
        description: 'People referenced in this entry',
        nullable: true,
    })
    people?: ParsedUpdatePeoplePlaces[];

    @Field(() => [ParsedUpdatePeoplePlaces], {
        description: 'Places referenced in this entry',
        nullable: true,
    })
    places?: ParsedUpdatePeoplePlaces[];

    @Field(() => String, { description: 'Type of Entry', nullable: true })
    entry?: string;

    @Field(() => ParsedUpdateMoney, {
        description: 'general money information for the entry',
        nullable: true,
    })
    money?: ParsedUpdateMoney;

    @Field(() => String, {
        description: 'Name of uploaded document parsed from',
    })
    documentName: string;
}
