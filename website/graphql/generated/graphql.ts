import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
    JSONObject: any;
};

export type AccHolderObject = {
    __typename?: 'AccHolderObject';
    /** First name of account holder */
    accountFirstName: Scalars['String'];
    /** ID of the accountholder to reference in peoples master list */
    accountHolderID?: Maybe<Scalars['String']>;
    /** Last name of account holder */
    accountLastName: Scalars['String'];
    /** Debt or Credit transaction */
    debitOrCredit: Scalars['Float'];
    /** Location? */
    location: Scalars['String'];
    populate?: Maybe<Person>;
    /** Prefix of account holder's name */
    prefix: Scalars['String'];
    /** Profession of account holder */
    profession: Scalars['String'];
    /** Reference? */
    reference: Scalars['String'];
    /** Suffix of account holder */
    suffix: Scalars['String'];
};

export type AccountHolderInput = {
    /** First name of account holder */
    accountFirstName: Scalars['String'];
    /** ID of the accountholder to reference in peoples master list */
    accountHolderID?: InputMaybe<Scalars['ID']>;
    /** Last name of account holder */
    accountLastName: Scalars['String'];
    /** Debt or Credit transaction */
    debitOrCredit: Scalars['Float'];
    /** Location? */
    location: Scalars['String'];
    /** Prefix of account holder's name */
    prefix: Scalars['String'];
    /** Profession of account holder */
    profession: Scalars['String'];
    /** Reference? */
    reference: Scalars['String'];
    /** Suffix of account holder */
    suffix: Scalars['String'];
};

export type AdvancedSearchInput = {
    accountHolderName?: InputMaybe<Scalars['String']>;
    colony?: InputMaybe<Scalars['String']>;
    commodity?: InputMaybe<Scalars['String']>;
    date?: InputMaybe<Scalars['DateTime']>;
    date2?: InputMaybe<Scalars['DateTime']>;
    entryID?: InputMaybe<Scalars['String']>;
    folioPage?: InputMaybe<Scalars['String']>;
    folioYear?: InputMaybe<Scalars['String']>;
    itemEntry?: InputMaybe<ItemEntrySearch>;
    people?: InputMaybe<Scalars['String']>;
    places?: InputMaybe<Scalars['String']>;
    reel?: InputMaybe<Scalars['String']>;
    regularEntry?: InputMaybe<RegularEntrySearch>;
    storeOwner?: InputMaybe<Scalars['String']>;
    tobaccoEntry?: InputMaybe<TobaccoEntrySearch>;
};

/** Cat Object */
export type Cat = {
    __typename?: 'Cat';
    /** Age of the Cat */
    age: Scalars['Float'];
    /** Breed of the Cat */
    breed: Scalars['String'];
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    /** Name of the Cat */
    name: Scalars['String'];
};

/** Category Object */
export type Category = {
    __typename?: 'Category';
    /** Category type */
    category: Scalars['String'];
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    /** Items in the category */
    item: Scalars['String'];
    /** Subcategory? */
    subcategory: Scalars['String'];
};

export type CreateCatDto = {
    age: Scalars['Float'];
    breed: Scalars['String'];
    name: Scalars['String'];
};

export type CreateCategoryInput = {
    /** Category type */
    category: Scalars['String'];
    /** Items in the category */
    item: Scalars['String'];
    /** Subcategory? */
    subcategory: Scalars['String'];
};

export type CreateDocumentInput = {
    /** Description of document */
    description: Scalars['String'];
    /** Key of file in S3 bucket */
    fileKey: Scalars['String'];
    /** Name of document */
    name: Scalars['String'];
};

export type CreateEntryInput = {
    /** Information on the account holder in the transaction */
    accountHolder: AccountHolderInput;
    /** Date of entry */
    dateInfo: DateInput;
    /** Type of Entry */
    entry: Scalars['String'];
    folioRefs: Array<Scalars['String']>;
    itemEntries?: InputMaybe<Array<ItemEntryInput>>;
    ledgerRefs: Array<Scalars['String']>;
    /** Meta information of the entry */
    meta: MetaInput;
    /** general money information for the entry */
    money: MoneyInput;
    /** People referenced in this entry */
    people: Array<PeoplePlacesInput>;
    /** Places referenced in this entry */
    places: Array<PeoplePlacesInput>;
    regularEntry?: InputMaybe<RegularEntryInput>;
    tobaccoEntry?: InputMaybe<TobaccoEntryInput>;
};

export type CreateGlossaryItemInput = {
    /** Category item is in */
    category: Scalars['String'];
    /** citations form information used in this item's details */
    citations: Scalars['String'];
    /** description of the cultural context surrounding the item */
    culturalContext: Scalars['String'];
    /** Description of item */
    description: Scalars['String'];
    /** images of item */
    images: Array<CreateImageObject>;
    /** Name of glossary item */
    name: Scalars['String'];
    /** Item's origin */
    origin: Scalars['String'];
    /** Qualifiers */
    qualifiers: Scalars['String'];
    /** Sub-category item is in */
    subcategory: Scalars['String'];
    /** Item's use */
    use: Scalars['String'];
};

/** Image Information */
export type CreateImageObject = {
    /** image caption */
    caption: Scalars['String'];
    /** citation about the collection the image is in */
    collectionCitation: Scalars['String'];
    /** date of the image */
    date: Scalars['String'];
    /** dimensions of the item in the image */
    dimensions: Scalars['String'];
    /** string of filename of image in the S3 Bucket */
    imageKey: Scalars['String'];
    /** license the image is under */
    license: Scalars['String'];
    material: Scalars['String'];
    /** name of the image */
    name: Scalars['String'];
    /** key to image in S3 Bucket */
    url: Scalars['String'];
};

export type CreateItemInput = {
    /** Name of item */
    item: Scalars['String'];
    /** Description of the item */
    variants: Scalars['String'];
};

export type CreatePersonInput = {
    /** Variations of given item */
    account?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    enslaved?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    firstName?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    gender?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    lastName?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    location?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    prefix?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    profession?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    professionCategory?: InputMaybe<Scalars['String']>;
    professionQualifier?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    reference?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    store?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    suffix?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    variations?: InputMaybe<Scalars['String']>;
};

export type CreatePlaceInput = {
    /** Variations of given item */
    alias: Scalars['String'];
    /** Variations of given item */
    descriptor: Scalars['String'];
    /** Type of item */
    location: Scalars['String'];
};

export type CreateTobaccoMarkInput = {
    /** TODO: Fill this in */
    description: Scalars['String'];
    /** TODO: Fill this in */
    image: Scalars['String'];
    /** TODO: Fill this in */
    netWeight: Scalars['String'];
    /** TODO: Fill this in */
    note: Scalars['String'];
    /** TODO: Fill this in */
    notes: Scalars['String'];
    /** TODO: Fill this in */
    tobaccoMarkId: Scalars['String'];
    /** TODO: Fill this in */
    warehouse: Scalars['String'];
    /** TODO: Fill this in */
    where: Scalars['String'];
    /** TODO: Fill this in */
    whoRepresents: Scalars['String'];
    /** TODO: Fill this in */
    whoUnder: Scalars['String'];
};

export type DateInput = {
    /** day of date */
    day: Scalars['Int'];
    /** complete date */
    fullDate?: InputMaybe<Scalars['DateTime']>;
    /** month of date */
    month: Scalars['Int'];
    /** year of date */
    year: Scalars['Int'];
};

export type DateObject = {
    __typename?: 'DateObject';
    /** day of date */
    day: Scalars['Int'];
    /** complete date */
    fullDate?: Maybe<Scalars['DateTime']>;
    /** month of date */
    month: Scalars['Int'];
    /** year of date */
    year: Scalars['Int'];
};

/** Category Object */
export type DocumentInfo = {
    __typename?: 'DocumentInfo';
    /** Description of document */
    description: Scalars['String'];
    /** Key of file in S3 bucket */
    fileKey: Scalars['String'];
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    /** Name of document */
    name: Scalars['String'];
};

/** Single Entry */
export type Entry = {
    __typename?: 'Entry';
    /** Information on the account holder in the transaction */
    accountHolder: AccHolderObject;
    /** Date of entry */
    dateInfo: DateObject;
    /** Type of Entry */
    entry: Scalars['String'];
    folioRefs: Array<Scalars['String']>;
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    itemEntries?: Maybe<Array<ItemEntryObject>>;
    ledgerRefs: Array<Scalars['String']>;
    /** Meta information of the entry */
    meta: MetaObject;
    /** general money information for the entry */
    money: MoneyObject;
    /** People referenced in this entry */
    people: Array<PersonObject>;
    /** Places referenced in this entry */
    places: Array<PlaceObject>;
    regularEntry?: Maybe<RegularEntryObject>;
    tobaccoEntry?: Maybe<TobaccoEntryObject>;
};

export type FindAllLimitAndSkip = {
    /** number of items to return, number must be in the range 1 <= limit <= 50 */
    limit?: InputMaybe<Scalars['Float']>;
    /** Offset of items to skip */
    skip?: InputMaybe<Scalars['Float']>;
};

/** Glossary Item Object */
export type GlossaryItem = {
    __typename?: 'GlossaryItem';
    /** Category item is in */
    category: Scalars['String'];
    /** citations form information used in this item's details */
    citations: Scalars['String'];
    /** description of the cultural context surrounding the item */
    culturalContext: Scalars['String'];
    /** Description of item */
    description: Scalars['String'];
    /** Glossary Item ID */
    id: Scalars['ID'];
    /** images of item */
    images: Array<ImageObject>;
    /** Name of glossary item */
    name: Scalars['String'];
    /** Item's origin */
    origin: Scalars['String'];
    /** Qualifiers */
    qualifiers: Scalars['String'];
    /** Sub-category item is in */
    subcategory: Scalars['String'];
    /** Item's use */
    use: Scalars['String'];
};

/** Image Information */
export type ImageObject = {
    __typename?: 'ImageObject';
    /** image caption */
    caption: Scalars['String'];
    /** citation about the collection the image is in */
    collectionCitation: Scalars['String'];
    /** date of the image */
    date: Scalars['String'];
    /** dimensions of the item in the image */
    dimensions: Scalars['String'];
    /** string of filename of image in the S3 Bucket */
    imageKey: Scalars['String'];
    /** license the image is under */
    license: Scalars['String'];
    material: Scalars['String'];
    /** name of the image */
    name: Scalars['String'];
    /** key to image in S3 Bucket */
    url: Scalars['String'];
};

/** Item Object */
export type Item = {
    __typename?: 'Item';
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    /** Type of item */
    item: Scalars['String'];
    /** Variations of given item */
    variants: Scalars['String'];
};

export type ItemEntryInput = {
    itemsMentioned: Array<MentionedItemsInput>;
    itemsOrServices: Array<InputMaybe<ItemOrServiceInput>>;
    perOrder: Scalars['Float'];
    percentage: Scalars['Float'];
};

export type ItemEntryObject = {
    __typename?: 'ItemEntryObject';
    itemsMentioned: Array<MentionedItemsObject>;
    itemsOrServices: Array<Maybe<ItemOrServiceObject>>;
    perOrder: Scalars['Float'];
    percentage: Scalars['Float'];
};

export type ItemEntrySearch = {
    category?: InputMaybe<Scalars['String']>;
    items?: InputMaybe<Scalars['String']>;
    perOrder?: InputMaybe<Scalars['Float']>;
    subcategory?: InputMaybe<Scalars['String']>;
    variant?: InputMaybe<Scalars['String']>;
};

export type ItemOrServiceInput = {
    category?: InputMaybe<Scalars['String']>;
    item: Scalars['String'];
    itemCost: PoundsShillingsPenceInput;
    qualifier: Scalars['String'];
    quantity: Scalars['Float'];
    subcategory?: InputMaybe<Scalars['String']>;
    unitCost: PoundsShillingsPenceInput;
    variants: Array<Scalars['String']>;
};

export type ItemOrServiceObject = {
    __typename?: 'ItemOrServiceObject';
    category?: Maybe<Scalars['String']>;
    item: Scalars['String'];
    itemCost: PoundsShillingsPence;
    qualifier: Scalars['String'];
    quantity: Scalars['Float'];
    subcategory?: Maybe<Scalars['String']>;
    unitCost: PoundsShillingsPence;
    variants: Array<Scalars['String']>;
};

export type MentionedItemsInput = {
    item: Scalars['String'];
    qualifier: Scalars['String'];
    quantity: Scalars['Float'];
};

export type MentionedItemsObject = {
    __typename?: 'MentionedItemsObject';
    item: Scalars['String'];
    qualifier: Scalars['String'];
    quantity: Scalars['Float'];
};

export type MetaInput = {
    /** comments */
    comments: Scalars['String'];
    /** ID of entry within Folio */
    entryID: Scalars['String'];
    /** Folio the entry is contained in */
    folioPage: Scalars['String'];
    /** Ledger containing this Entry */
    ledger: Scalars['String'];
    /** Store Owner */
    owner: Scalars['String'];
    /** Reel of the Entry */
    reel: Scalars['String'];
    /** Name of Store */
    store: Scalars['String'];
    /** Year the entry was made */
    year: Scalars['String'];
};

export type MetaObject = {
    __typename?: 'MetaObject';
    /** comments */
    comments: Scalars['String'];
    /** ID of entry within Folio */
    entryID: Scalars['String'];
    /** Folio the entry is contained in */
    folioPage: Scalars['String'];
    /** Ledger containing this Entry */
    ledger: Scalars['String'];
    /** Store Owner */
    owner: Scalars['String'];
    /** Reel of the Entry */
    reel: Scalars['String'];
    /** Name of Store */
    store: Scalars['String'];
    /** Year the entry was made */
    year: Scalars['String'];
};

export type MoneyInput = {
    colony?: InputMaybe<Scalars['String']>;
    commodity: Scalars['String'];
    currency: PoundsShillingsPenceInput;
    quantity?: InputMaybe<Scalars['String']>;
    sterling: PoundsShillingsPenceInput;
};

export type MoneyObject = {
    __typename?: 'MoneyObject';
    colony?: Maybe<Scalars['String']>;
    commodity: Scalars['String'];
    currency: PoundsShillingsPence;
    quantity?: Maybe<Scalars['String']>;
    sterling: PoundsShillingsPence;
};

export type Mutation = {
    __typename?: 'Mutation';
    addUserToGroup?: Maybe<Scalars['JSONObject']>;
    confirmUserSignUp?: Maybe<Scalars['JSONObject']>;
    createCat: Cat;
    createCategory: Category;
    createDocument: DocumentInfo;
    createEntries: Array<Entry>;
    createEntry: Entry;
    createGlossaryItem: GlossaryItem;
    createItem: Item;
    createParsedEntries: Array<ParsedEntry>;
    createParsedEntry: ParsedEntry;
    createPerson: Person;
    createPlace: Place;
    createTobaccoMark: TobaccoMark;
    deleteCategory?: Maybe<Category>;
    deleteDocument?: Maybe<DocumentInfo>;
    deleteEntry?: Maybe<Entry>;
    deleteGlossaryItem?: Maybe<GlossaryItem>;
    deleteItem?: Maybe<Item>;
    deleteParsedEntry?: Maybe<ParsedEntry>;
    deletePerson?: Maybe<Person>;
    deletePlace?: Maybe<Place>;
    deleteTobaccoMark?: Maybe<TobaccoMark>;
    disableUser?: Maybe<Scalars['JSONObject']>;
    enableUser?: Maybe<Scalars['JSONObject']>;
    importSpreadsheet?: Maybe<Array<Scalars['JSONObject']>>;
    removeUserFromGroup?: Maybe<Scalars['JSONObject']>;
    signUserOut?: Maybe<Scalars['JSONObject']>;
    updateCategory?: Maybe<Category>;
    updateDocument?: Maybe<DocumentInfo>;
    updateEntry?: Maybe<Entry>;
    updateGlossaryItem?: Maybe<GlossaryItem>;
    updateItem?: Maybe<Item>;
    updateParsedEntry?: Maybe<ParsedEntry>;
    updatePerson?: Maybe<Person>;
    updatePlace?: Maybe<Place>;
    updateTobaccoMark?: Maybe<TobaccoMark>;
};

export type MutationAddUserToGroupArgs = {
    groupname: Scalars['String'];
    username: Scalars['String'];
};

export type MutationConfirmUserSignUpArgs = {
    username: Scalars['String'];
};

export type MutationCreateCatArgs = {
    newCat: CreateCatDto;
};

export type MutationCreateCategoryArgs = {
    category: CreateCategoryInput;
};

export type MutationCreateDocumentArgs = {
    newDocument: CreateDocumentInput;
};

export type MutationCreateEntriesArgs = {
    entries: Array<InputMaybe<CreateEntryInput>>;
};

export type MutationCreateEntryArgs = {
    createEntryInput: CreateEntryInput;
};

export type MutationCreateGlossaryItemArgs = {
    newGlossaryItem: CreateGlossaryItemInput;
};

export type MutationCreateItemArgs = {
    item: CreateItemInput;
};

export type MutationCreateParsedEntriesArgs = {
    entries: Array<InputMaybe<ParsedCreateEntryInput>>;
};

export type MutationCreateParsedEntryArgs = {
    createEntryInput: ParsedCreateEntryInput;
};

export type MutationCreatePersonArgs = {
    person: CreatePersonInput;
};

export type MutationCreatePlaceArgs = {
    place: CreatePlaceInput;
};

export type MutationCreateTobaccoMarkArgs = {
    tobaccoMark: CreateTobaccoMarkInput;
};

export type MutationDeleteCategoryArgs = {
    id: Scalars['String'];
};

export type MutationDeleteDocumentArgs = {
    id: Scalars['String'];
};

export type MutationDeleteEntryArgs = {
    id: Scalars['String'];
};

export type MutationDeleteGlossaryItemArgs = {
    id: Scalars['String'];
};

export type MutationDeleteItemArgs = {
    id: Scalars['String'];
};

export type MutationDeleteParsedEntryArgs = {
    id: Scalars['String'];
};

export type MutationDeletePersonArgs = {
    id: Scalars['String'];
};

export type MutationDeletePlaceArgs = {
    id: Scalars['String'];
};

export type MutationDeleteTobaccoMarkArgs = {
    id: Scalars['String'];
};

export type MutationDisableUserArgs = {
    username: Scalars['String'];
};

export type MutationEnableUserArgs = {
    username: Scalars['String'];
};

export type MutationImportSpreadsheetArgs = {
    spreadsheetObj: ParseObject;
};

export type MutationRemoveUserFromGroupArgs = {
    groupname: Scalars['String'];
    username: Scalars['String'];
};

export type MutationSignUserOutArgs = {
    username: Scalars['String'];
};

export type MutationUpdateCategoryArgs = {
    id: Scalars['String'];
    updatedFields: UpdateCategoryInput;
};

export type MutationUpdateDocumentArgs = {
    id: Scalars['String'];
    updatedFields: UpdateDocumentInput;
};

export type MutationUpdateEntryArgs = {
    id: Scalars['String'];
    updatedFields: UpdateEntryInput;
};

export type MutationUpdateGlossaryItemArgs = {
    id: Scalars['String'];
    updatedFields: UpdateGlossaryItemInput;
};

export type MutationUpdateItemArgs = {
    id: Scalars['String'];
    updatedFields: UpdateItemInput;
};

export type MutationUpdateParsedEntryArgs = {
    id: Scalars['String'];
    updatedFields: ParsedUpdateEntryInput;
};

export type MutationUpdatePersonArgs = {
    id: Scalars['String'];
    updatedFields: UpdatePersonInput;
};

export type MutationUpdatePlaceArgs = {
    id: Scalars['String'];
    updatedFields: UpdatePlaceInput;
};

export type MutationUpdateTobaccoMarkArgs = {
    id: Scalars['String'];
    updatedFields: UpdateTobaccoMarkInput;
};

export type NoteInput = {
    barrelWeight: Scalars['Float'];
    noteNum: Scalars['Float'];
    tobaccoWeight: Scalars['Float'];
    totalWeight: Scalars['Float'];
};

export type NoteObject = {
    __typename?: 'NoteObject';
    barrelWeight: Scalars['Float'];
    noteNum: Scalars['Float'];
    tobaccoWeight: Scalars['Float'];
    totalWeight: Scalars['Float'];
};

export type ParseObject = {
    entries: Scalars['JSONObject'];
    ledgerName: Scalars['String'];
};

export type ParsedAccHolderObject = {
    __typename?: 'ParsedAccHolderObject';
    /** First name of account holder */
    accountFirstName: Scalars['String'];
    /** ID of the accountholder to reference in peoples master list */
    accountHolderID?: Maybe<Scalars['String']>;
    /** Last name of account holder */
    accountLastName: Scalars['String'];
    /** Debt or Credit transaction */
    debitOrCredit: Scalars['Float'];
    /** Location? */
    location: Scalars['String'];
    populate?: Maybe<Person>;
    /** Prefix of account holder's name */
    prefix: Scalars['String'];
    /** Profession of account holder */
    profession: Scalars['String'];
    /** Reference? */
    reference: Scalars['String'];
    /** Suffix of account holder */
    suffix: Scalars['String'];
};

export type ParsedAccountHolderInput = {
    /** First name of account holder */
    accountFirstName: Scalars['String'];
    /** ID of the accountholder to reference in peoples master list */
    accountHolderID?: InputMaybe<Scalars['ID']>;
    /** Last name of account holder */
    accountLastName: Scalars['String'];
    /** Debt or Credit transaction */
    debitOrCredit: Scalars['Float'];
    /** Location? */
    location: Scalars['String'];
    /** Prefix of account holder's name */
    prefix: Scalars['String'];
    /** Profession of account holder */
    profession: Scalars['String'];
    /** Reference? */
    reference: Scalars['String'];
    /** Suffix of account holder */
    suffix: Scalars['String'];
};

export type ParsedAdvancedSearchInput = {
    accountHolderName?: InputMaybe<Scalars['String']>;
    colony?: InputMaybe<Scalars['String']>;
    commodity?: InputMaybe<Scalars['String']>;
    date?: InputMaybe<Scalars['DateTime']>;
    date2?: InputMaybe<Scalars['DateTime']>;
    entryID?: InputMaybe<Scalars['String']>;
    folioPage?: InputMaybe<Scalars['String']>;
    folioYear?: InputMaybe<Scalars['String']>;
    itemEntry?: InputMaybe<ParsedItemEntrySearch>;
    people?: InputMaybe<Scalars['String']>;
    places?: InputMaybe<Scalars['String']>;
    reel?: InputMaybe<Scalars['String']>;
    regularEntry?: InputMaybe<ParsedRegularEntrySearch>;
    storeOwner?: InputMaybe<Scalars['String']>;
    tobaccoEntry?: InputMaybe<ParsedTobaccoEntrySearch>;
};

export type ParsedCreateEntryInput = {
    /** Information on the account holder in the transaction */
    accountHolder: ParsedAccountHolderInput;
    /** Date of entry */
    dateInfo: ParsedDateInput;
    /** Name of uploaded document parsed from */
    documentName: Scalars['String'];
    /** Type of Entry */
    entry: Scalars['String'];
    folioRefs: Array<Scalars['String']>;
    itemEntries?: InputMaybe<Array<ParsedItemEntryInput>>;
    ledgerRefs: Array<Scalars['String']>;
    /** Meta information of the entry */
    meta: ParsedMetaInput;
    /** general money information for the entry */
    money: ParsedMoneyInput;
    /** People referenced in this entry */
    people: Array<ParsedPeoplePlacesInput>;
    /** Places referenced in this entry */
    places: Array<ParsedPeoplePlacesInput>;
    regularEntry?: InputMaybe<ParsedRegularEntryInput>;
    tobaccoEntry?: InputMaybe<ParsedTobaccoEntryInput>;
};

export type ParsedDateInput = {
    /** day of date */
    day: Scalars['Int'];
    /** complete date */
    fullDate?: InputMaybe<Scalars['DateTime']>;
    /** month of date */
    month: Scalars['Int'];
    /** year of date */
    year: Scalars['Int'];
};

export type ParsedDateObject = {
    __typename?: 'ParsedDateObject';
    /** day of date */
    day: Scalars['Int'];
    /** complete date */
    fullDate?: Maybe<Scalars['DateTime']>;
    /** month of date */
    month: Scalars['Int'];
    /** year of date */
    year: Scalars['Int'];
};

/** Single Parsed Entry */
export type ParsedEntry = {
    __typename?: 'ParsedEntry';
    /** Information on the account holder in the transaction */
    accountHolder: ParsedAccHolderObject;
    /** Date of entry */
    dateInfo: ParsedDateObject;
    /** Name of uploaded document parsed from */
    documentName: Scalars['String'];
    /** Type of Entry */
    entry: Scalars['String'];
    folioRefs: Array<Scalars['String']>;
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    itemEntries?: Maybe<Array<ParsedItemEntryObject>>;
    ledgerRefs: Array<Scalars['String']>;
    /** Meta information of the entry */
    meta: ParsedMetaObject;
    /** general money information for the entry */
    money: ParsedMoneyObject;
    /** People referenced in this entry */
    people: Array<ParsedPersonObject>;
    /** Places referenced in this entry */
    places: Array<ParsedPlaceObject>;
    regularEntry?: Maybe<ParsedRegularEntryObject>;
    tobaccoEntry?: Maybe<ParsedTobaccoEntryObject>;
};

export type ParsedItemEntryInput = {
    itemsMentioned: Array<ParsedMentionedItemsInput>;
    itemsOrServices: Array<InputMaybe<ParsedItemOrServiceInput>>;
    perOrder: Scalars['Float'];
    percentage: Scalars['Float'];
};

export type ParsedItemEntryObject = {
    __typename?: 'ParsedItemEntryObject';
    itemsMentioned: Array<ParsedMentionedItemsObject>;
    itemsOrServices: Array<Maybe<ParsedItemOrServiceObject>>;
    perOrder: Scalars['Float'];
    percentage: Scalars['Float'];
};

export type ParsedItemEntrySearch = {
    category?: InputMaybe<Scalars['String']>;
    items?: InputMaybe<Scalars['String']>;
    perOrder?: InputMaybe<Scalars['Float']>;
    subcategory?: InputMaybe<Scalars['String']>;
    variant?: InputMaybe<Scalars['String']>;
};

export type ParsedItemOrServiceInput = {
    category?: InputMaybe<Scalars['String']>;
    item: Scalars['String'];
    itemCost: ParsedPoundsShillingsPenceInput;
    qualifier: Scalars['String'];
    quantity: Scalars['Float'];
    subcategory?: InputMaybe<Scalars['String']>;
    unitCost: ParsedPoundsShillingsPenceInput;
    variants: Array<Scalars['String']>;
};

export type ParsedItemOrServiceObject = {
    __typename?: 'ParsedItemOrServiceObject';
    category?: Maybe<Scalars['String']>;
    item: Scalars['String'];
    itemCost: ParsedPoundsShillingsPence;
    qualifier: Scalars['String'];
    quantity: Scalars['Float'];
    subcategory?: Maybe<Scalars['String']>;
    unitCost: ParsedPoundsShillingsPence;
    variants: Array<Scalars['String']>;
};

export type ParsedMentionedItemsInput = {
    item: Scalars['String'];
    qualifier: Scalars['String'];
    quantity: Scalars['Float'];
};

export type ParsedMentionedItemsObject = {
    __typename?: 'ParsedMentionedItemsObject';
    item: Scalars['String'];
    qualifier: Scalars['String'];
    quantity: Scalars['Float'];
};

export type ParsedMetaInput = {
    /** comments */
    comments: Scalars['String'];
    /** ID of entry within Folio */
    entryID: Scalars['String'];
    /** Folio the entry is contained in */
    folioPage: Scalars['String'];
    /** Ledger containing this Entry */
    ledger: Scalars['String'];
    /** Store Owner */
    owner: Scalars['String'];
    /** Reel of the Entry */
    reel: Scalars['String'];
    /** Name of Store */
    store: Scalars['String'];
    /** Year the entry was made */
    year: Scalars['String'];
};

export type ParsedMetaObject = {
    __typename?: 'ParsedMetaObject';
    /** comments */
    comments: Scalars['String'];
    /** ID of entry within Folio */
    entryID: Scalars['String'];
    /** Folio the entry is contained in */
    folioPage: Scalars['String'];
    /** Ledger containing this Entry */
    ledger: Scalars['String'];
    /** Store Owner */
    owner: Scalars['String'];
    /** Reel of the Entry */
    reel: Scalars['String'];
    /** Name of Store */
    store: Scalars['String'];
    /** Year the entry was made */
    year: Scalars['String'];
};

export type ParsedMoneyInput = {
    colony?: InputMaybe<Scalars['String']>;
    commodity: Scalars['String'];
    currency: ParsedPoundsShillingsPenceInput;
    quantity?: InputMaybe<Scalars['String']>;
    sterling: ParsedPoundsShillingsPenceInput;
};

export type ParsedMoneyObject = {
    __typename?: 'ParsedMoneyObject';
    colony?: Maybe<Scalars['String']>;
    commodity: Scalars['String'];
    currency: ParsedPoundsShillingsPence;
    quantity?: Maybe<Scalars['String']>;
    sterling: ParsedPoundsShillingsPence;
};

export type ParsedNoteInput = {
    barrelWeight: Scalars['Float'];
    noteNum: Scalars['Float'];
    tobaccoWeight: Scalars['Float'];
    totalWeight: Scalars['Float'];
};

export type ParsedNoteObject = {
    __typename?: 'ParsedNoteObject';
    barrelWeight: Scalars['Float'];
    noteNum: Scalars['Float'];
    tobaccoWeight: Scalars['Float'];
    totalWeight: Scalars['Float'];
};

export type ParsedPeoplePlacesInput = {
    /** words */
    id?: InputMaybe<Scalars['ID']>;
    /** Persons name */
    name: Scalars['String'];
};

export type ParsedPersonObject = {
    __typename?: 'ParsedPersonObject';
    /** ID of this person in the people collection */
    id?: Maybe<Scalars['ID']>;
    /** Persons name */
    name: Scalars['String'];
    populate?: Maybe<Person>;
};

export type ParsedPlaceObject = {
    __typename?: 'ParsedPlaceObject';
    /** ID of that place in places collection */
    id?: Maybe<Scalars['ID']>;
    /** Place name */
    name: Scalars['String'];
    populate?: Maybe<Place>;
};

export type ParsedPoundsShillingsPence = {
    __typename?: 'ParsedPoundsShillingsPence';
    /** Number of Pence */
    pence?: Maybe<Scalars['Float']>;
    /** Number of pounds */
    pounds?: Maybe<Scalars['Float']>;
    /** Number of shillings */
    shilling?: Maybe<Scalars['Float']>;
};

export type ParsedPoundsShillingsPenceInput = {
    /** Number of Pence */
    pence?: InputMaybe<Scalars['Float']>;
    /** Number of pounds */
    pounds?: InputMaybe<Scalars['Float']>;
    /** Number of shillings */
    shilling?: InputMaybe<Scalars['Float']>;
};

export type ParsedRegularEntryInput = {
    /** words */
    entry: Scalars['String'];
    itemsMentioned: Array<ParsedMentionedItemsInput>;
    tobaccoMarks: Array<ParsedTobaccoMarkInput>;
};

export type ParsedRegularEntryObject = {
    __typename?: 'ParsedRegularEntryObject';
    /** words */
    entry: Scalars['String'];
    itemsMentioned: Array<ParsedMentionedItemsObject>;
    tobaccoMarks: Array<ParsedTobaccoMarkObject>;
};

export type ParsedRegularEntrySearch = {
    entryDescription?: InputMaybe<Scalars['String']>;
    tobaccoMarkName?: InputMaybe<Scalars['String']>;
};

export type ParsedTobaccoEntryInput = {
    /** words */
    entry: Scalars['String'];
    marks: Array<ParsedTobaccoMarkInput>;
    money: Array<ParsedTobaccoMoneyInput>;
    notes: Array<ParsedNoteInput>;
    /** words */
    tobaccoShaved: Scalars['Float'];
};

export type ParsedTobaccoEntryObject = {
    __typename?: 'ParsedTobaccoEntryObject';
    /** words */
    entry: Scalars['String'];
    marks: Array<ParsedTobaccoMarkObject>;
    money: Array<ParsedTobaccoMoneyObject>;
    notes: Array<ParsedNoteObject>;
    /** words */
    tobaccoShaved: Scalars['Float'];
};

export type ParsedTobaccoEntrySearch = {
    description?: InputMaybe<Scalars['String']>;
    moneyType?: InputMaybe<Scalars['String']>;
    noteNumber?: InputMaybe<Scalars['Float']>;
    tobaccoMarkName?: InputMaybe<Scalars['String']>;
};

export type ParsedTobaccoMarkInput = {
    /** words */
    markID?: InputMaybe<Scalars['ID']>;
    markName: Scalars['String'];
};

export type ParsedTobaccoMarkObject = {
    __typename?: 'ParsedTobaccoMarkObject';
    /** words */
    markID: Scalars['ID'];
    markName: Scalars['String'];
    populate?: Maybe<TobaccoMark>;
};

export type ParsedTobaccoMoneyInput = {
    /** words */
    casksInTransaction: Scalars['Float'];
    /** words */
    casksSoldForEach: ParsedPoundsShillingsPenceInput;
    /** words */
    moneyType: Scalars['String'];
    /** words */
    rateForTobacco: ParsedPoundsShillingsPenceInput;
    /** words */
    tobaccoAmount: Scalars['Float'];
    /** words */
    tobaccoSold: ParsedPoundsShillingsPenceInput;
};

export type ParsedTobaccoMoneyObject = {
    __typename?: 'ParsedTobaccoMoneyObject';
    /** words */
    casksInTransaction: Scalars['Float'];
    /** words */
    casksSoldForEach: ParsedPoundsShillingsPence;
    /** words */
    moneyType: Scalars['String'];
    /** words */
    rateForTobacco: ParsedPoundsShillingsPence;
    /** words */
    tobaccoAmount: Scalars['Float'];
    /** words */
    tobaccoSold: ParsedPoundsShillingsPence;
};

export type ParsedUpdateAccountHolder = {
    /** First name of account holder */
    accountFirstName?: InputMaybe<Scalars['String']>;
    /** ID of the accountholder to reference in peoples master list */
    accountHolderID?: InputMaybe<Scalars['ID']>;
    /** Last name of account holder */
    accountLastName?: InputMaybe<Scalars['String']>;
    /** Debt or Credit transaction */
    debitOrCredit?: InputMaybe<Scalars['Float']>;
    /** Location? */
    location?: InputMaybe<Scalars['String']>;
    /** Prefix of account holder's name */
    prefix?: InputMaybe<Scalars['String']>;
    /** Profession of account holder */
    profession?: InputMaybe<Scalars['String']>;
    /** Reference? */
    reference?: InputMaybe<Scalars['String']>;
    /** Suffix of account holder */
    suffix?: InputMaybe<Scalars['String']>;
};

export type ParsedUpdateDate = {
    /** day of date */
    day?: InputMaybe<Scalars['Int']>;
    /** complete date */
    fullDate?: InputMaybe<Scalars['DateTime']>;
    /** month of date */
    month?: InputMaybe<Scalars['Int']>;
    /** year of date */
    year?: InputMaybe<Scalars['Int']>;
};

export type ParsedUpdateEntryInput = {
    /** Information on the account holder in the transaction */
    accountHolder?: InputMaybe<ParsedUpdateAccountHolder>;
    /** Date of entry */
    dateInfo?: InputMaybe<ParsedUpdateDate>;
    /** Name of uploaded document parsed from */
    documentName: Scalars['String'];
    /** Type of Entry */
    entry?: InputMaybe<Scalars['String']>;
    folioRefs?: InputMaybe<Array<Scalars['String']>>;
    itemEntries?: InputMaybe<Array<ParsedUpdateItemEntry>>;
    ledgerRefs?: InputMaybe<Array<Scalars['String']>>;
    /** Meta information of the entry */
    meta?: InputMaybe<ParsedUpdateMeta>;
    /** general money information for the entry */
    money?: InputMaybe<ParsedUpdateMoney>;
    /** People referenced in this entry */
    people?: InputMaybe<Array<ParsedUpdatePeoplePlaces>>;
    /** Places referenced in this entry */
    places?: InputMaybe<Array<ParsedUpdatePeoplePlaces>>;
    regularEntry?: InputMaybe<ParsedUpdateRegularEntry>;
    tobaccoEntry?: InputMaybe<ParsedUpdateTobaccoEntry>;
};

export type ParsedUpdateItemEntry = {
    itemsMentioned?: InputMaybe<Array<ParsedUpdateMentionedItems>>;
    itemsOrServices: Array<InputMaybe<ParsedUpdateItemOrService>>;
    perOrder?: InputMaybe<Scalars['Float']>;
    percentage?: InputMaybe<Scalars['Float']>;
};

export type ParsedUpdateItemOrService = {
    category?: InputMaybe<Scalars['String']>;
    item?: InputMaybe<Scalars['String']>;
    itemCost?: InputMaybe<ParsedUpdatePoundsShillingsPence>;
    qualifier?: InputMaybe<Scalars['String']>;
    quantity?: InputMaybe<Scalars['Float']>;
    subcategory?: InputMaybe<Scalars['String']>;
    unitCost?: InputMaybe<ParsedUpdatePoundsShillingsPence>;
    variants?: InputMaybe<Array<Scalars['String']>>;
};

export type ParsedUpdateMentionedItems = {
    item?: InputMaybe<Scalars['String']>;
    qualifier?: InputMaybe<Scalars['String']>;
    quantity?: InputMaybe<Scalars['Float']>;
};

export type ParsedUpdateMeta = {
    /** comments */
    comments?: InputMaybe<Scalars['String']>;
    /** ID of entry within Folio */
    entryID?: InputMaybe<Scalars['String']>;
    /** Folio the entry is contained in */
    folioPage?: InputMaybe<Scalars['String']>;
    /** Ledger containing this Entry */
    ledger?: InputMaybe<Scalars['String']>;
    /** Store Owner */
    owner?: InputMaybe<Scalars['String']>;
    /** Reel of the Entry */
    reel?: InputMaybe<Scalars['String']>;
    /** Name of Store */
    store?: InputMaybe<Scalars['String']>;
    /** Year the entry was made */
    year?: InputMaybe<Scalars['String']>;
};

export type ParsedUpdateMoney = {
    colony?: InputMaybe<Scalars['String']>;
    commodity?: InputMaybe<Scalars['String']>;
    currency?: InputMaybe<ParsedUpdatePoundsShillingsPence>;
    quantity?: InputMaybe<Scalars['String']>;
    sterling?: InputMaybe<ParsedUpdatePoundsShillingsPence>;
};

export type ParsedUpdateNote = {
    barrelWeight?: InputMaybe<Scalars['Float']>;
    noteNum?: InputMaybe<Scalars['Float']>;
    tobaccoWeight?: InputMaybe<Scalars['Float']>;
    totalWeight?: InputMaybe<Scalars['Float']>;
};

export type ParsedUpdatePeoplePlaces = {
    /** words */
    id?: InputMaybe<Scalars['ID']>;
    /** Persons name */
    name?: InputMaybe<Scalars['String']>;
};

export type ParsedUpdatePoundsShillingsPence = {
    /** Number of Pence */
    pence?: InputMaybe<Scalars['Float']>;
    /** Number of pounds */
    pounds?: InputMaybe<Scalars['Float']>;
    /** Number of shillings */
    shilling?: InputMaybe<Scalars['Float']>;
};

export type ParsedUpdateRegularEntry = {
    /** words */
    entry?: InputMaybe<Scalars['String']>;
    itemsMentioned?: InputMaybe<Array<ParsedUpdateMentionedItems>>;
    tobaccoMarks?: InputMaybe<Array<ParsedUpdateTobaccoMark>>;
};

export type ParsedUpdateTobaccoEntry = {
    /** words */
    entry?: InputMaybe<Scalars['String']>;
    marks?: InputMaybe<Array<ParsedUpdateTobaccoMark>>;
    money?: InputMaybe<Array<ParsedUpdateTobaccoMoney>>;
    notes?: InputMaybe<Array<ParsedUpdateNote>>;
    /** words */
    tobaccoShaved?: InputMaybe<Scalars['Float']>;
};

export type ParsedUpdateTobaccoMark = {
    /** words */
    markID?: InputMaybe<Scalars['ID']>;
    markName?: InputMaybe<Scalars['String']>;
};

export type ParsedUpdateTobaccoMoney = {
    /** words */
    casksInTransaction?: InputMaybe<Scalars['Float']>;
    /** words */
    casksSoldForEach?: InputMaybe<ParsedUpdatePoundsShillingsPence>;
    /** words */
    moneyType?: InputMaybe<Scalars['String']>;
    /** words */
    rateForTobacco?: InputMaybe<ParsedUpdatePoundsShillingsPence>;
    /** words */
    tobaccoAmount?: InputMaybe<Scalars['Float']>;
    /** words */
    tobaccoSold?: InputMaybe<ParsedUpdatePoundsShillingsPence>;
};

export type PeoplePlacesInput = {
    /** words */
    id?: InputMaybe<Scalars['ID']>;
    /** Persons name */
    name: Scalars['String'];
};

/** People Object */
export type Person = {
    __typename?: 'Person';
    /** Variations of given item */
    account?: Maybe<Scalars['String']>;
    /** Variations of given item */
    enslaved?: Maybe<Scalars['String']>;
    /** Variations of given item */
    firstName?: Maybe<Scalars['String']>;
    fullName: Scalars['String'];
    /** Variations of given item */
    gender?: Maybe<Scalars['String']>;
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    /** Variations of given item */
    lastName?: Maybe<Scalars['String']>;
    /** Variations of given item */
    location?: Maybe<Scalars['String']>;
    /** Variations of given item */
    prefix?: Maybe<Scalars['String']>;
    /** Variations of given item */
    profession?: Maybe<Scalars['String']>;
    /** Variations of given item */
    professionCategory?: Maybe<Scalars['String']>;
    professionQualifier?: Maybe<Scalars['String']>;
    /** Variations of given item */
    reference?: Maybe<Scalars['String']>;
    /** Variations of given item */
    store?: Maybe<Scalars['String']>;
    /** Variations of given item */
    suffix?: Maybe<Scalars['String']>;
    /** Variations of given item */
    variations?: Maybe<Scalars['String']>;
};

export type PersonObject = {
    __typename?: 'PersonObject';
    /** ID of this person in the people collection */
    id?: Maybe<Scalars['ID']>;
    /** Persons name */
    name: Scalars['String'];
    populate?: Maybe<Person>;
};

/** Place Object */
export type Place = {
    __typename?: 'Place';
    /** Variations of given item */
    alias?: Maybe<Scalars['String']>;
    /** Variations of given item */
    descriptor?: Maybe<Scalars['String']>;
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    /** Type of item */
    location?: Maybe<Scalars['String']>;
};

export type PlaceObject = {
    __typename?: 'PlaceObject';
    /** ID of that place in places collection */
    id?: Maybe<Scalars['ID']>;
    /** Place name */
    name: Scalars['String'];
    populate?: Maybe<Place>;
};

export type PoundsShillingsPence = {
    __typename?: 'PoundsShillingsPence';
    /** Number of Pence */
    pence?: Maybe<Scalars['Float']>;
    /** Number of pounds */
    pounds?: Maybe<Scalars['Float']>;
    /** Number of shillings */
    shilling?: Maybe<Scalars['Float']>;
};

export type PoundsShillingsPenceInput = {
    /** Number of Pence */
    pence?: InputMaybe<Scalars['Float']>;
    /** Number of pounds */
    pounds?: InputMaybe<Scalars['Float']>;
    /** Number of shillings */
    shilling?: InputMaybe<Scalars['Float']>;
};

export type Query = {
    __typename?: 'Query';
    /** Search all Entries in the database */
    advancedCountEntries?: Maybe<Scalars['Float']>;
    /** Search all Entries in the database */
    advancedCountParsedEntries?: Maybe<Scalars['Float']>;
    /** Search all Entries in the database */
    advancedFindEntries?: Maybe<Array<Entry>>;
    /** Search all Entries in the database */
    advancedFindParsedEntries?: Maybe<Array<ParsedEntry>>;
    countCategories: Scalars['Float'];
    countDocuments: Scalars['Float'];
    countEntries: Scalars['Float'];
    countGlossaryItems: Scalars['Float'];
    countItems: Scalars['Float'];
    countParsedEntries: Scalars['Float'];
    countPeople: Scalars['Float'];
    countPlaces: Scalars['Float'];
    countTobaccoMarks: Scalars['Float'];
    findCat?: Maybe<Cat>;
    findCategories?: Maybe<Array<Category>>;
    findCats?: Maybe<Array<Cat>>;
    findCatsAuth?: Maybe<Array<Cat>>;
    findDocument?: Maybe<DocumentInfo>;
    findDocuments?: Maybe<Array<DocumentInfo>>;
    /** Search all Entries in the database */
    findEntries?: Maybe<Array<Entry>>;
    /** Find an entry by id */
    findEntry?: Maybe<Entry>;
    findGlossaryItem?: Maybe<GlossaryItem>;
    findGlossaryItems?: Maybe<Array<GlossaryItem>>;
    findItems?: Maybe<Array<Item>>;
    findOneCategory?: Maybe<Category>;
    findOneItem?: Maybe<Item>;
    findOnePerson?: Maybe<Person>;
    findOnePlace?: Maybe<Place>;
    findOneTobaccoMark?: Maybe<TobaccoMark>;
    /** Search all Entries in the database */
    findParsedEntries?: Maybe<Array<ParsedEntry>>;
    /** Find an entry by id */
    findParsedEntry?: Maybe<ParsedEntry>;
    findPeople?: Maybe<Array<Person>>;
    findPlaces?: Maybe<Array<Place>>;
    findTobaccoMarks?: Maybe<Array<TobaccoMark>>;
    getUser?: Maybe<Scalars['JSONObject']>;
    /** Return the greeting "hello" */
    hello: Scalars['String'];
    listGroups?: Maybe<Scalars['JSONObject']>;
    listGroupsForUser?: Maybe<Scalars['JSONObject']>;
    listUsers?: Maybe<Scalars['JSONObject']>;
    listUsersInGroup?: Maybe<Scalars['JSONObject']>;
};

export type QueryAdvancedCountEntriesArgs = {
    search?: InputMaybe<AdvancedSearchInput>;
};

export type QueryAdvancedCountParsedEntriesArgs = {
    search?: InputMaybe<ParsedAdvancedSearchInput>;
};

export type QueryAdvancedFindEntriesArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<AdvancedSearchInput>;
};

export type QueryAdvancedFindParsedEntriesArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<ParsedAdvancedSearchInput>;
};

export type QueryCountCategoriesArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryCountDocumentsArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryCountEntriesArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryCountGlossaryItemsArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryCountItemsArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryCountParsedEntriesArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryCountPeopleArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryCountPlacesArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryCountTobaccoMarksArgs = {
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindCatArgs = {
    id: Scalars['String'];
};

export type QueryFindCategoriesArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindDocumentArgs = {
    id: Scalars['String'];
};

export type QueryFindDocumentsArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindEntriesArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindEntryArgs = {
    id: Scalars['String'];
};

export type QueryFindGlossaryItemArgs = {
    id: Scalars['String'];
};

export type QueryFindGlossaryItemsArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindItemsArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindOneCategoryArgs = {
    id: Scalars['String'];
};

export type QueryFindOneItemArgs = {
    id: Scalars['String'];
};

export type QueryFindOnePersonArgs = {
    id: Scalars['String'];
};

export type QueryFindOnePlaceArgs = {
    id: Scalars['String'];
};

export type QueryFindOneTobaccoMarkArgs = {
    id: Scalars['String'];
};

export type QueryFindParsedEntriesArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindParsedEntryArgs = {
    id: Scalars['String'];
};

export type QueryFindPeopleArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindPlacesArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryFindTobaccoMarksArgs = {
    options?: InputMaybe<FindAllLimitAndSkip>;
    search?: InputMaybe<Scalars['String']>;
};

export type QueryGetUserArgs = {
    username: Scalars['String'];
};

export type QueryListGroupsArgs = {
    limit?: InputMaybe<Scalars['Float']>;
    paginationToken?: InputMaybe<Scalars['String']>;
};

export type QueryListGroupsForUserArgs = {
    limit?: InputMaybe<Scalars['Float']>;
    nextToken?: InputMaybe<Scalars['String']>;
    username: Scalars['String'];
};

export type QueryListUsersArgs = {
    limit?: InputMaybe<Scalars['Float']>;
    paginationToken?: InputMaybe<Scalars['String']>;
};

export type QueryListUsersInGroupArgs = {
    groupname: Scalars['String'];
    limit?: InputMaybe<Scalars['Float']>;
    nextToken?: InputMaybe<Scalars['String']>;
};

export type RegularEntryInput = {
    /** words */
    entry: Scalars['String'];
    itemsMentioned: Array<MentionedItemsInput>;
    tobaccoMarks: Array<TobaccoMarkInput>;
};

export type RegularEntryObject = {
    __typename?: 'RegularEntryObject';
    /** words */
    entry: Scalars['String'];
    itemsMentioned: Array<MentionedItemsObject>;
    tobaccoMarks: Array<TobaccoMarkObject>;
};

export type RegularEntrySearch = {
    entryDescription?: InputMaybe<Scalars['String']>;
    tobaccoMarkName?: InputMaybe<Scalars['String']>;
};

export type TobaccoEntryInput = {
    /** words */
    entry: Scalars['String'];
    marks: Array<TobaccoMarkInput>;
    money: Array<TobaccoMoneyInput>;
    notes: Array<NoteInput>;
    /** words */
    tobaccoShaved: Scalars['Float'];
};

export type TobaccoEntryObject = {
    __typename?: 'TobaccoEntryObject';
    /** words */
    entry: Scalars['String'];
    marks: Array<TobaccoMarkObject>;
    money: Array<TobaccoMoneyObject>;
    notes: Array<NoteObject>;
    /** words */
    tobaccoShaved: Scalars['Float'];
};

export type TobaccoEntrySearch = {
    description?: InputMaybe<Scalars['String']>;
    moneyType?: InputMaybe<Scalars['String']>;
    noteNumber?: InputMaybe<Scalars['Float']>;
    tobaccoMarkName?: InputMaybe<Scalars['String']>;
};

/** TobaccoMark Object */
export type TobaccoMark = {
    __typename?: 'TobaccoMark';
    /** Variations of given item */
    description?: Maybe<Scalars['String']>;
    /** String of MongoDB ObjectId */
    id: Scalars['ID'];
    /** TODO: Fill this in */
    image?: Maybe<Scalars['String']>;
    /** TODO: Fill this in */
    netWeight?: Maybe<Scalars['String']>;
    /** TODO: Fill this in */
    note?: Maybe<Scalars['String']>;
    /** TODO: Fill this in */
    notes?: Maybe<Scalars['String']>;
    /** TODO: Fill this in */
    tobaccoMarkId: Scalars['String'];
    /** TODO: Fill this in */
    warehouse: Scalars['String'];
    /** TODO: Fill this in */
    where?: Maybe<Scalars['String']>;
    /** TODO: Fill this in */
    whoRepresents?: Maybe<Scalars['String']>;
    /** TODO: Fill this in */
    whoUnder?: Maybe<Scalars['String']>;
};

export type TobaccoMarkInput = {
    /** words */
    markID?: InputMaybe<Scalars['ID']>;
    markName: Scalars['String'];
};

export type TobaccoMarkObject = {
    __typename?: 'TobaccoMarkObject';
    /** words */
    markID: Scalars['ID'];
    markName: Scalars['String'];
    populate?: Maybe<TobaccoMark>;
};

export type TobaccoMoneyInput = {
    /** words */
    casksInTransaction: Scalars['Float'];
    /** words */
    casksSoldForEach: PoundsShillingsPenceInput;
    /** words */
    moneyType: Scalars['String'];
    /** words */
    rateForTobacco: PoundsShillingsPenceInput;
    /** words */
    tobaccoAmount: Scalars['Float'];
    /** words */
    tobaccoSold: PoundsShillingsPenceInput;
};

export type TobaccoMoneyObject = {
    __typename?: 'TobaccoMoneyObject';
    /** words */
    casksInTransaction: Scalars['Float'];
    /** words */
    casksSoldForEach: PoundsShillingsPence;
    /** words */
    moneyType: Scalars['String'];
    /** words */
    rateForTobacco: PoundsShillingsPence;
    /** words */
    tobaccoAmount: Scalars['Float'];
    /** words */
    tobaccoSold: PoundsShillingsPence;
};

export type UpdateAccountHolder = {
    /** First name of account holder */
    accountFirstName?: InputMaybe<Scalars['String']>;
    /** ID of the accountholder to reference in peoples master list */
    accountHolderID?: InputMaybe<Scalars['ID']>;
    /** Last name of account holder */
    accountLastName?: InputMaybe<Scalars['String']>;
    /** Debt or Credit transaction */
    debitOrCredit?: InputMaybe<Scalars['Float']>;
    /** Location? */
    location?: InputMaybe<Scalars['String']>;
    /** Prefix of account holder's name */
    prefix?: InputMaybe<Scalars['String']>;
    /** Profession of account holder */
    profession?: InputMaybe<Scalars['String']>;
    /** Reference? */
    reference?: InputMaybe<Scalars['String']>;
    /** Suffix of account holder */
    suffix?: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryInput = {
    /** Category type */
    category: Scalars['String'];
    /** Items in the category */
    item: Scalars['String'];
    /** Subcategory? */
    subcategory: Scalars['String'];
};

export type UpdateDate = {
    /** day of date */
    day?: InputMaybe<Scalars['Int']>;
    /** complete date */
    fullDate?: InputMaybe<Scalars['DateTime']>;
    /** month of date */
    month?: InputMaybe<Scalars['Int']>;
    /** year of date */
    year?: InputMaybe<Scalars['Int']>;
};

export type UpdateDocumentInput = {
    /** Description of document */
    description?: InputMaybe<Scalars['String']>;
    /** Key of file in S3 bucket */
    fileKey?: InputMaybe<Scalars['String']>;
    /** Name of document */
    name?: InputMaybe<Scalars['String']>;
};

export type UpdateEntryInput = {
    /** Information on the account holder in the transaction */
    accountHolder?: InputMaybe<UpdateAccountHolder>;
    /** Date of entry */
    dateInfo?: InputMaybe<UpdateDate>;
    /** Type of Entry */
    entry?: InputMaybe<Scalars['String']>;
    folioRefs?: InputMaybe<Array<Scalars['String']>>;
    itemEntries?: InputMaybe<Array<UpdateItemEntry>>;
    ledgerRefs?: InputMaybe<Array<Scalars['String']>>;
    /** Meta information of the entry */
    meta?: InputMaybe<UpdateMeta>;
    /** general money information for the entry */
    money?: InputMaybe<UpdateMoney>;
    /** People referenced in this entry */
    people?: InputMaybe<Array<UpdatePeoplePlaces>>;
    /** Places referenced in this entry */
    places?: InputMaybe<Array<UpdatePeoplePlaces>>;
    regularEntry?: InputMaybe<UpdateRegularEntry>;
    tobaccoEntry?: InputMaybe<UpdateTobaccoEntry>;
};

export type UpdateGlossaryItemInput = {
    /** Category item is in */
    category?: InputMaybe<Scalars['String']>;
    /** citations form information used in this item's details */
    citations?: InputMaybe<Scalars['String']>;
    /** description of the cultural context surrounding the item */
    culturalContext?: InputMaybe<Scalars['String']>;
    /** Description of item */
    description?: InputMaybe<Scalars['String']>;
    /** images of item */
    images?: InputMaybe<Array<UpdateImageObject>>;
    /** Name of glossary item */
    name?: InputMaybe<Scalars['String']>;
    /** Item's origin */
    origin?: InputMaybe<Scalars['String']>;
    /** Qualifiers */
    qualifiers?: InputMaybe<Scalars['String']>;
    /** Sub-category item is in */
    subcategory?: InputMaybe<Scalars['String']>;
    /** Item's use */
    use?: InputMaybe<Scalars['String']>;
};

/** Image Information */
export type UpdateImageObject = {
    /** image caption */
    caption?: InputMaybe<Scalars['String']>;
    /** citation about the collection the image is in */
    collectionCitation?: InputMaybe<Scalars['String']>;
    /** date of the image */
    date?: InputMaybe<Scalars['String']>;
    /** dimensions of the item in the image */
    dimensions: Scalars['String'];
    /** string of filename of image in the S3 Bucket */
    imageKey?: InputMaybe<Scalars['String']>;
    /** license the image is under */
    license?: InputMaybe<Scalars['String']>;
    material?: InputMaybe<Scalars['String']>;
    /** name of the image */
    name?: InputMaybe<Scalars['String']>;
    /** key to image in S3 Bucket */
    url?: InputMaybe<Scalars['String']>;
};

export type UpdateItemEntry = {
    itemsMentioned?: InputMaybe<Array<UpdateMentionedItems>>;
    itemsOrServices: Array<InputMaybe<UpdateItemOrService>>;
    perOrder?: InputMaybe<Scalars['Float']>;
    percentage?: InputMaybe<Scalars['Float']>;
};

export type UpdateItemInput = {
    /** Name of the item */
    item?: InputMaybe<Scalars['String']>;
    /** Description of the item */
    variants?: InputMaybe<Scalars['String']>;
};

export type UpdateItemOrService = {
    category?: InputMaybe<Scalars['String']>;
    item?: InputMaybe<Scalars['String']>;
    itemCost?: InputMaybe<UpdatePoundsShillingsPence>;
    qualifier?: InputMaybe<Scalars['String']>;
    quantity?: InputMaybe<Scalars['Float']>;
    subcategory?: InputMaybe<Scalars['String']>;
    unitCost?: InputMaybe<UpdatePoundsShillingsPence>;
    variants?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateMentionedItems = {
    item?: InputMaybe<Scalars['String']>;
    qualifier?: InputMaybe<Scalars['String']>;
    quantity?: InputMaybe<Scalars['Float']>;
};

export type UpdateMeta = {
    /** comments */
    comments?: InputMaybe<Scalars['String']>;
    /** ID of entry within Folio */
    entryID?: InputMaybe<Scalars['String']>;
    /** Folio the entry is contained in */
    folioPage?: InputMaybe<Scalars['String']>;
    /** Ledger containing this Entry */
    ledger?: InputMaybe<Scalars['String']>;
    /** Store Owner */
    owner?: InputMaybe<Scalars['String']>;
    /** Reel of the Entry */
    reel?: InputMaybe<Scalars['String']>;
    /** Name of Store */
    store?: InputMaybe<Scalars['String']>;
    /** Year the entry was made */
    year?: InputMaybe<Scalars['String']>;
};

export type UpdateMoney = {
    colony?: InputMaybe<Scalars['String']>;
    commodity?: InputMaybe<Scalars['String']>;
    currency?: InputMaybe<UpdatePoundsShillingsPence>;
    quantity?: InputMaybe<Scalars['String']>;
    sterling?: InputMaybe<UpdatePoundsShillingsPence>;
};

export type UpdateNote = {
    barrelWeight?: InputMaybe<Scalars['Float']>;
    noteNum?: InputMaybe<Scalars['Float']>;
    tobaccoWeight?: InputMaybe<Scalars['Float']>;
    totalWeight?: InputMaybe<Scalars['Float']>;
};

export type UpdatePeoplePlaces = {
    /** words */
    id?: InputMaybe<Scalars['ID']>;
    /** Persons name */
    name?: InputMaybe<Scalars['String']>;
};

export type UpdatePersonInput = {
    /** Variations of given item */
    account?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    enslaved?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    firstName?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    gender?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    lastName?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    location?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    prefix?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    profession?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    professionCategory?: InputMaybe<Scalars['String']>;
    professionQualifier?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    reference?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    store?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    suffix?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    variations?: InputMaybe<Scalars['String']>;
};

export type UpdatePlaceInput = {
    /** Variations of given item */
    alias?: InputMaybe<Scalars['String']>;
    /** Variations of given item */
    descriptor?: InputMaybe<Scalars['String']>;
    /** Type of item */
    location?: InputMaybe<Scalars['String']>;
};

export type UpdatePoundsShillingsPence = {
    /** Number of Pence */
    pence?: InputMaybe<Scalars['Float']>;
    /** Number of pounds */
    pounds?: InputMaybe<Scalars['Float']>;
    /** Number of shillings */
    shilling?: InputMaybe<Scalars['Float']>;
};

export type UpdateRegularEntry = {
    /** words */
    entry?: InputMaybe<Scalars['String']>;
    itemsMentioned?: InputMaybe<Array<UpdateMentionedItems>>;
    tobaccoMarks?: InputMaybe<Array<UpdateTobaccoMark>>;
};

export type UpdateTobaccoEntry = {
    /** words */
    entry?: InputMaybe<Scalars['String']>;
    marks?: InputMaybe<Array<UpdateTobaccoMark>>;
    money?: InputMaybe<Array<UpdateTobaccoMoney>>;
    notes?: InputMaybe<Array<UpdateNote>>;
    /** words */
    tobaccoShaved?: InputMaybe<Scalars['Float']>;
};

export type UpdateTobaccoMark = {
    /** words */
    markID?: InputMaybe<Scalars['ID']>;
    markName?: InputMaybe<Scalars['String']>;
};

export type UpdateTobaccoMarkInput = {
    /** TODO: Fill this in */
    description?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    image?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    netWeight?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    note?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    notes?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    tobaccoMarkId?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    warehouse?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    where?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    whoRepresents?: InputMaybe<Scalars['String']>;
    /** TODO: Fill this in */
    whoUnder?: InputMaybe<Scalars['String']>;
};

export type UpdateTobaccoMoney = {
    /** words */
    casksInTransaction?: InputMaybe<Scalars['Float']>;
    /** words */
    casksSoldForEach?: InputMaybe<UpdatePoundsShillingsPence>;
    /** words */
    moneyType?: InputMaybe<Scalars['String']>;
    /** words */
    rateForTobacco?: InputMaybe<UpdatePoundsShillingsPence>;
    /** words */
    tobaccoAmount?: InputMaybe<Scalars['Float']>;
    /** words */
    tobaccoSold?: InputMaybe<UpdatePoundsShillingsPence>;
};

export type GlossaryItemFieldsFragment = {
    __typename?: 'GlossaryItem';
    id: string;
    name: string;
    description: string;
    origin: string;
    use: string;
    category: string;
    subcategory: string;
    qualifiers: string;
    culturalContext: string;
    citations: string;
    images: Array<{
        __typename?: 'ImageObject';
        imageKey: string;
        name: string;
        material: string;
        dimensions: string;
        date: string;
        caption: string;
        collectionCitation: string;
        url: string;
        license: string;
    }>;
};

export type CreateGlossaryItemMutationVariables = Exact<{
    item: CreateGlossaryItemInput;
}>;

export type CreateGlossaryItemMutation = {
    __typename?: 'Mutation';
    createGlossaryItem: {
        __typename?: 'GlossaryItem';
        id: string;
        name: string;
        description: string;
        origin: string;
        use: string;
        category: string;
        subcategory: string;
        qualifiers: string;
        culturalContext: string;
        citations: string;
        images: Array<{
            __typename?: 'ImageObject';
            imageKey: string;
            name: string;
            material: string;
            dimensions: string;
            date: string;
            caption: string;
            collectionCitation: string;
            url: string;
            license: string;
        }>;
    };
};

export type GlossaryItemsQueryQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type GlossaryItemsQueryQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'GlossaryItem';
        id: string;
        name: string;
        description: string;
        origin: string;
        use: string;
        category: string;
        subcategory: string;
        qualifiers: string;
        culturalContext: string;
        citations: string;
        images: Array<{
            __typename?: 'ImageObject';
            imageKey: string;
            name: string;
            material: string;
            dimensions: string;
            date: string;
            caption: string;
            collectionCitation: string;
            url: string;
            license: string;
        }>;
    }> | null;
};

export type UpdateGlossaryItemMutationVariables = Exact<{
    id: Scalars['String'];
    updates: UpdateGlossaryItemInput;
}>;

export type UpdateGlossaryItemMutation = {
    __typename?: 'Mutation';
    updateGlossaryItem?: {
        __typename?: 'GlossaryItem';
        id: string;
        name: string;
        description: string;
        origin: string;
        use: string;
        category: string;
        subcategory: string;
        qualifiers: string;
        culturalContext: string;
        citations: string;
        images: Array<{
            __typename?: 'ImageObject';
            imageKey: string;
            name: string;
            material: string;
            dimensions: string;
            date: string;
            caption: string;
            collectionCitation: string;
            url: string;
            license: string;
        }>;
    } | null;
};

export type DeleteGlossaryItemMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteGlossaryItemMutation = {
    __typename?: 'Mutation';
    deletedItem?: {
        __typename?: 'GlossaryItem';
        id: string;
        name: string;
        description: string;
        origin: string;
        use: string;
        category: string;
        subcategory: string;
        qualifiers: string;
        culturalContext: string;
        citations: string;
        images: Array<{
            __typename?: 'ImageObject';
            imageKey: string;
            name: string;
            material: string;
            dimensions: string;
            date: string;
            caption: string;
            collectionCitation: string;
            url: string;
            license: string;
        }>;
    } | null;
};

export type GlossaryItemQueryQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type GlossaryItemQueryQuery = {
    __typename?: 'Query';
    item?: {
        __typename?: 'GlossaryItem';
        id: string;
        name: string;
        description: string;
        origin: string;
        use: string;
        category: string;
        subcategory: string;
        qualifiers: string;
        culturalContext: string;
        citations: string;
        images: Array<{
            __typename?: 'ImageObject';
            imageKey: string;
            name: string;
            material: string;
            dimensions: string;
            date: string;
            caption: string;
            collectionCitation: string;
            url: string;
            license: string;
        }>;
    } | null;
};

export type DocumentFieldsFragment = {
    __typename?: 'DocumentInfo';
    id: string;
    name: string;
    description: string;
    fileKey: string;
};

export type CreateDocumentMutationVariables = Exact<{
    doc: CreateDocumentInput;
}>;

export type CreateDocumentMutation = {
    __typename?: 'Mutation';
    doc: {
        __typename?: 'DocumentInfo';
        id: string;
        name: string;
        description: string;
        fileKey: string;
    };
};

export type FetchDocumentsQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type FetchDocumentsQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'DocumentInfo';
        id: string;
        name: string;
        description: string;
        fileKey: string;
    }> | null;
};

export type UpdateDocumentMutationVariables = Exact<{
    id: Scalars['String'];
    updates: UpdateDocumentInput;
}>;

export type UpdateDocumentMutation = {
    __typename?: 'Mutation';
    doc?: {
        __typename?: 'DocumentInfo';
        id: string;
        name: string;
        description: string;
        fileKey: string;
    } | null;
};

export type DeleteDocumentMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteDocumentMutation = {
    __typename?: 'Mutation';
    doc?: {
        __typename?: 'DocumentInfo';
        id: string;
        name: string;
        description: string;
        fileKey: string;
    } | null;
};

export type FetchPeopleQueryVariables = Exact<{
    search: Scalars['String'];
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type FetchPeopleQuery = {
    __typename?: 'Query';
    people?: Array<{
        __typename?: 'Person';
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        name: string;
    }> | null;
};

export type SearchPlacesQueryVariables = Exact<{
    search: Scalars['String'];
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type SearchPlacesQuery = {
    __typename?: 'Query';
    places?: Array<{
        __typename?: 'Place';
        id: string;
        name?: string | null;
    }> | null;
};

export type FetchMarksQueryVariables = Exact<{
    search: Scalars['String'];
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type FetchMarksQuery = {
    __typename?: 'Query';
    marks?: Array<{
        __typename?: 'TobaccoMark';
        id: string;
        markID: string;
        markName: string;
    }> | null;
};

export type CategoryFieldsFragment = {
    __typename?: 'Category';
    id: string;
    item: string;
    category: string;
    subcategory: string;
};

export type CreateCategoryMutationVariables = Exact<{
    category: CreateCategoryInput;
}>;

export type CreateCategoryMutation = {
    __typename?: 'Mutation';
    createCategory: {
        __typename?: 'Category';
        id: string;
        item: string;
        category: string;
        subcategory: string;
    };
};

export type CategoriesQueryQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type CategoriesQueryQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'Category';
        id: string;
        item: string;
        category: string;
        subcategory: string;
    }> | null;
};

export type UpdateCategoryMutationVariables = Exact<{
    id: Scalars['String'];
    updates: UpdateCategoryInput;
}>;

export type UpdateCategoryMutation = {
    __typename?: 'Mutation';
    updateCategory?: {
        __typename?: 'Category';
        id: string;
        item: string;
        category: string;
        subcategory: string;
    } | null;
};

export type DeleteCategoryMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteCategoryMutation = {
    __typename?: 'Mutation';
    deleteCategory?: {
        __typename?: 'Category';
        id: string;
        item: string;
        category: string;
        subcategory: string;
    } | null;
};

export type ItemsFieldsFragment = {
    __typename?: 'Item';
    id: string;
    item: string;
    variants: string;
};

export type CreateItemMutationVariables = Exact<{
    item: CreateItemInput;
}>;

export type CreateItemMutation = {
    __typename?: 'Mutation';
    createItem: {
        __typename?: 'Item';
        id: string;
        item: string;
        variants: string;
    };
};

export type ItemsQueryQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type ItemsQueryQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'Item';
        id: string;
        item: string;
        variants: string;
    }> | null;
};

export type UpdateItemMutationVariables = Exact<{
    id: Scalars['String'];
    updates: UpdateItemInput;
}>;

export type UpdateItemMutation = {
    __typename?: 'Mutation';
    updateItem?: {
        __typename?: 'Item';
        id: string;
        item: string;
        variants: string;
    } | null;
};

export type DeleteItemMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteItemMutation = {
    __typename?: 'Mutation';
    deleteItem?: {
        __typename?: 'Item';
        id: string;
        item: string;
        variants: string;
    } | null;
};

export type PersonFieldsFragment = {
    __typename?: 'Person';
    id: string;
    account?: string | null;
    enslaved?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    gender?: string | null;
    location?: string | null;
    prefix?: string | null;
    suffix?: string | null;
    profession?: string | null;
    professionCategory?: string | null;
    professionQualifier?: string | null;
    reference?: string | null;
    store?: string | null;
    variations?: string | null;
};

export type CreatePersonMutationVariables = Exact<{
    person: CreatePersonInput;
}>;

export type CreatePersonMutation = {
    __typename?: 'Mutation';
    createPerson: {
        __typename?: 'Person';
        id: string;
        account?: string | null;
        enslaved?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        gender?: string | null;
        location?: string | null;
        prefix?: string | null;
        suffix?: string | null;
        profession?: string | null;
        professionCategory?: string | null;
        professionQualifier?: string | null;
        reference?: string | null;
        store?: string | null;
        variations?: string | null;
    };
};

export type FetchPersonQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type FetchPersonQuery = {
    __typename?: 'Query';
    person?: {
        __typename?: 'Person';
        id: string;
        account?: string | null;
        enslaved?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        gender?: string | null;
        location?: string | null;
        prefix?: string | null;
        suffix?: string | null;
        profession?: string | null;
        professionCategory?: string | null;
        professionQualifier?: string | null;
        reference?: string | null;
        store?: string | null;
        variations?: string | null;
    } | null;
};

export type PeopleQueryQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type PeopleQueryQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'Person';
        id: string;
        account?: string | null;
        enslaved?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        gender?: string | null;
        location?: string | null;
        prefix?: string | null;
        suffix?: string | null;
        profession?: string | null;
        professionCategory?: string | null;
        professionQualifier?: string | null;
        reference?: string | null;
        store?: string | null;
        variations?: string | null;
    }> | null;
};

export type UpdatePersonMutationVariables = Exact<{
    id: Scalars['String'];
    updates: UpdatePersonInput;
}>;

export type UpdatePersonMutation = {
    __typename?: 'Mutation';
    updatePerson?: {
        __typename?: 'Person';
        id: string;
        account?: string | null;
        enslaved?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        gender?: string | null;
        location?: string | null;
        prefix?: string | null;
        suffix?: string | null;
        profession?: string | null;
        professionCategory?: string | null;
        professionQualifier?: string | null;
        reference?: string | null;
        store?: string | null;
        variations?: string | null;
    } | null;
};

export type DeletePersonMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeletePersonMutation = {
    __typename?: 'Mutation';
    deletePerson?: {
        __typename?: 'Person';
        id: string;
        account?: string | null;
        enslaved?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        gender?: string | null;
        location?: string | null;
        prefix?: string | null;
        suffix?: string | null;
        profession?: string | null;
        professionCategory?: string | null;
        professionQualifier?: string | null;
        reference?: string | null;
        store?: string | null;
        variations?: string | null;
    } | null;
};

export type PlaceFieldsFragment = {
    __typename?: 'Place';
    id: string;
    location?: string | null;
    alias?: string | null;
    descriptor?: string | null;
};

export type FetchPlaceQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type FetchPlaceQuery = {
    __typename?: 'Query';
    place?: {
        __typename?: 'Place';
        id: string;
        location?: string | null;
        alias?: string | null;
        descriptor?: string | null;
    } | null;
};

export type CreatePlaceMutationVariables = Exact<{
    place: CreatePlaceInput;
}>;

export type CreatePlaceMutation = {
    __typename?: 'Mutation';
    createPlace: {
        __typename?: 'Place';
        id: string;
        location?: string | null;
        alias?: string | null;
        descriptor?: string | null;
    };
};

export type PlacesQueryQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type PlacesQueryQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'Place';
        id: string;
        location?: string | null;
        alias?: string | null;
        descriptor?: string | null;
    }> | null;
};

export type UpdatePlaceMutationVariables = Exact<{
    id: Scalars['String'];
    updates: UpdatePlaceInput;
}>;

export type UpdatePlaceMutation = {
    __typename?: 'Mutation';
    updatePlace?: {
        __typename?: 'Place';
        id: string;
        location?: string | null;
        alias?: string | null;
        descriptor?: string | null;
    } | null;
};

export type DeletePlaceMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeletePlaceMutation = {
    __typename?: 'Mutation';
    deletePlace?: {
        __typename?: 'Place';
        id: string;
        location?: string | null;
        alias?: string | null;
        descriptor?: string | null;
    } | null;
};

export type MarkFieldsFragment = {
    __typename?: 'TobaccoMark';
    id: string;
    description?: string | null;
    image?: string | null;
    netWeight?: string | null;
    note?: string | null;
    notes?: string | null;
    tobaccoMarkId: string;
    warehouse: string;
    where?: string | null;
    whoRepresents?: string | null;
    whoUnder?: string | null;
};

export type FetchMarkQueryVariables = Exact<{
    id: Scalars['String'];
}>;

export type FetchMarkQuery = {
    __typename?: 'Query';
    mark?: {
        __typename?: 'TobaccoMark';
        id: string;
        description?: string | null;
        image?: string | null;
        netWeight?: string | null;
        note?: string | null;
        notes?: string | null;
        tobaccoMarkId: string;
        warehouse: string;
        where?: string | null;
        whoRepresents?: string | null;
        whoUnder?: string | null;
    } | null;
};

export type CreateTobaccoMarkMutationVariables = Exact<{
    mark: CreateTobaccoMarkInput;
}>;

export type CreateTobaccoMarkMutation = {
    __typename?: 'Mutation';
    createTobaccoMark: {
        __typename?: 'TobaccoMark';
        id: string;
        description?: string | null;
        image?: string | null;
        netWeight?: string | null;
        note?: string | null;
        notes?: string | null;
        tobaccoMarkId: string;
        warehouse: string;
        where?: string | null;
        whoRepresents?: string | null;
        whoUnder?: string | null;
    };
};

export type TobaccoMarksQueryQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
}>;

export type TobaccoMarksQueryQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'TobaccoMark';
        id: string;
        description?: string | null;
        image?: string | null;
        netWeight?: string | null;
        note?: string | null;
        notes?: string | null;
        tobaccoMarkId: string;
        warehouse: string;
        where?: string | null;
        whoRepresents?: string | null;
        whoUnder?: string | null;
    }> | null;
};

export type UpdateTobaccoMarkMutationVariables = Exact<{
    id: Scalars['String'];
    updates: UpdateTobaccoMarkInput;
}>;

export type UpdateTobaccoMarkMutation = {
    __typename?: 'Mutation';
    updateTobaccoMark?: {
        __typename?: 'TobaccoMark';
        id: string;
        description?: string | null;
        image?: string | null;
        netWeight?: string | null;
        note?: string | null;
        notes?: string | null;
        tobaccoMarkId: string;
        warehouse: string;
        where?: string | null;
        whoRepresents?: string | null;
        whoUnder?: string | null;
    } | null;
};

export type DeleteTobaccoMarkMutationVariables = Exact<{
    id: Scalars['String'];
}>;

export type DeleteTobaccoMarkMutation = {
    __typename?: 'Mutation';
    deleteTobaccoMark?: {
        __typename?: 'TobaccoMark';
        id: string;
        description?: string | null;
        image?: string | null;
        netWeight?: string | null;
        note?: string | null;
        notes?: string | null;
        tobaccoMarkId: string;
        warehouse: string;
        where?: string | null;
        whoRepresents?: string | null;
        whoUnder?: string | null;
    } | null;
};

export type MentionedItemsFragment = {
    __typename?: 'MentionedItemsObject';
    quantity: number;
    qualifier: string;
    item: string;
};

export type MoneyFragment = {
    __typename?: 'PoundsShillingsPence';
    pounds?: number | null;
    shilling?: number | null;
    pence?: number | null;
};

export type EntryFieldsFragment = {
    __typename?: 'Entry';
    id: string;
    folioRefs: Array<string>;
    ledgerRefs: Array<string>;
    entry: string;
    accountHolder: {
        __typename?: 'AccHolderObject';
        accountFirstName: string;
        accountLastName: string;
        prefix: string;
        suffix: string;
        profession: string;
        location: string;
        reference: string;
        debitOrCredit: number;
        accountHolderID?: string | null;
        populate?: {
            __typename?: 'Person';
            id: string;
            account?: string | null;
            enslaved?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            gender?: string | null;
            location?: string | null;
            prefix?: string | null;
            suffix?: string | null;
            profession?: string | null;
            professionCategory?: string | null;
            professionQualifier?: string | null;
            reference?: string | null;
            store?: string | null;
            variations?: string | null;
        } | null;
    };
    meta: {
        __typename?: 'MetaObject';
        ledger: string;
        reel: string;
        owner: string;
        store: string;
        year: string;
        folioPage: string;
        entryID: string;
        comments: string;
    };
    dateInfo: {
        __typename?: 'DateObject';
        day: number;
        month: number;
        year: number;
        fullDate?: any | null;
    };
    itemEntries?: Array<{
        __typename?: 'ItemEntryObject';
        perOrder: number;
        percentage: number;
        itemsOrServices: Array<{
            __typename?: 'ItemOrServiceObject';
            quantity: number;
            qualifier: string;
            variants: Array<string>;
            item: string;
            category?: string | null;
            subcategory?: string | null;
            unitCost: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            itemCost: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
        } | null>;
        itemsMentioned: Array<{
            __typename?: 'MentionedItemsObject';
            quantity: number;
            qualifier: string;
            item: string;
        }>;
    }> | null;
    tobaccoEntry?: {
        __typename?: 'TobaccoEntryObject';
        entry: string;
        tobaccoShaved: number;
        marks: Array<{
            __typename?: 'TobaccoMarkObject';
            markID: string;
            markName: string;
            populate?: {
                __typename?: 'TobaccoMark';
                id: string;
                description?: string | null;
                image?: string | null;
                netWeight?: string | null;
                note?: string | null;
                notes?: string | null;
                tobaccoMarkId: string;
                warehouse: string;
                where?: string | null;
                whoRepresents?: string | null;
                whoUnder?: string | null;
            } | null;
        }>;
        notes: Array<{
            __typename?: 'NoteObject';
            noteNum: number;
            totalWeight: number;
            barrelWeight: number;
            tobaccoWeight: number;
        }>;
        money: Array<{
            __typename?: 'TobaccoMoneyObject';
            moneyType: string;
            tobaccoAmount: number;
            casksInTransaction: number;
            rateForTobacco: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            tobaccoSold: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            casksSoldForEach: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
        }>;
    } | null;
    regularEntry?: {
        __typename?: 'RegularEntryObject';
        entry: string;
        tobaccoMarks: Array<{
            __typename?: 'TobaccoMarkObject';
            markID: string;
            markName: string;
            populate?: {
                __typename?: 'TobaccoMark';
                id: string;
                description?: string | null;
                image?: string | null;
                netWeight?: string | null;
                note?: string | null;
                notes?: string | null;
                tobaccoMarkId: string;
                warehouse: string;
                where?: string | null;
                whoRepresents?: string | null;
                whoUnder?: string | null;
            } | null;
        }>;
        itemsMentioned: Array<{
            __typename?: 'MentionedItemsObject';
            quantity: number;
            qualifier: string;
            item: string;
        }>;
    } | null;
    people: Array<{
        __typename?: 'PersonObject';
        name: string;
        id?: string | null;
        populate?: {
            __typename?: 'Person';
            id: string;
            account?: string | null;
            enslaved?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            gender?: string | null;
            location?: string | null;
            prefix?: string | null;
            suffix?: string | null;
            profession?: string | null;
            professionCategory?: string | null;
            professionQualifier?: string | null;
            reference?: string | null;
            store?: string | null;
            variations?: string | null;
        } | null;
    }>;
    places: Array<{
        __typename?: 'PlaceObject';
        name: string;
        id?: string | null;
        populate?: {
            __typename?: 'Place';
            id: string;
            location?: string | null;
            alias?: string | null;
            descriptor?: string | null;
        } | null;
    }>;
    money: {
        __typename?: 'MoneyObject';
        commodity: string;
        colony?: string | null;
        quantity?: string | null;
        currency: {
            __typename?: 'PoundsShillingsPence';
            pounds?: number | null;
            shilling?: number | null;
            pence?: number | null;
        };
        sterling: {
            __typename?: 'PoundsShillingsPence';
            pounds?: number | null;
            shilling?: number | null;
            pence?: number | null;
        };
    };
};

export type EntriesQueryQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
    populate: Scalars['Boolean'];
}>;

export type EntriesQueryQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'Entry';
        id: string;
        folioRefs: Array<string>;
        ledgerRefs: Array<string>;
        entry: string;
        accountHolder: {
            __typename?: 'AccHolderObject';
            accountFirstName: string;
            accountLastName: string;
            prefix: string;
            suffix: string;
            profession: string;
            location: string;
            reference: string;
            debitOrCredit: number;
            accountHolderID?: string | null;
            populate?: {
                __typename?: 'Person';
                id: string;
                account?: string | null;
                enslaved?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                gender?: string | null;
                location?: string | null;
                prefix?: string | null;
                suffix?: string | null;
                profession?: string | null;
                professionCategory?: string | null;
                professionQualifier?: string | null;
                reference?: string | null;
                store?: string | null;
                variations?: string | null;
            } | null;
        };
        meta: {
            __typename?: 'MetaObject';
            ledger: string;
            reel: string;
            owner: string;
            store: string;
            year: string;
            folioPage: string;
            entryID: string;
            comments: string;
        };
        dateInfo: {
            __typename?: 'DateObject';
            day: number;
            month: number;
            year: number;
            fullDate?: any | null;
        };
        itemEntries?: Array<{
            __typename?: 'ItemEntryObject';
            perOrder: number;
            percentage: number;
            itemsOrServices: Array<{
                __typename?: 'ItemOrServiceObject';
                quantity: number;
                qualifier: string;
                variants: Array<string>;
                item: string;
                category?: string | null;
                subcategory?: string | null;
                unitCost: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                itemCost: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
            } | null>;
            itemsMentioned: Array<{
                __typename?: 'MentionedItemsObject';
                quantity: number;
                qualifier: string;
                item: string;
            }>;
        }> | null;
        tobaccoEntry?: {
            __typename?: 'TobaccoEntryObject';
            entry: string;
            tobaccoShaved: number;
            marks: Array<{
                __typename?: 'TobaccoMarkObject';
                markID: string;
                markName: string;
                populate?: {
                    __typename?: 'TobaccoMark';
                    id: string;
                    description?: string | null;
                    image?: string | null;
                    netWeight?: string | null;
                    note?: string | null;
                    notes?: string | null;
                    tobaccoMarkId: string;
                    warehouse: string;
                    where?: string | null;
                    whoRepresents?: string | null;
                    whoUnder?: string | null;
                } | null;
            }>;
            notes: Array<{
                __typename?: 'NoteObject';
                noteNum: number;
                totalWeight: number;
                barrelWeight: number;
                tobaccoWeight: number;
            }>;
            money: Array<{
                __typename?: 'TobaccoMoneyObject';
                moneyType: string;
                tobaccoAmount: number;
                casksInTransaction: number;
                rateForTobacco: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                tobaccoSold: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                casksSoldForEach: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
            }>;
        } | null;
        regularEntry?: {
            __typename?: 'RegularEntryObject';
            entry: string;
            tobaccoMarks: Array<{
                __typename?: 'TobaccoMarkObject';
                markID: string;
                markName: string;
                populate?: {
                    __typename?: 'TobaccoMark';
                    id: string;
                    description?: string | null;
                    image?: string | null;
                    netWeight?: string | null;
                    note?: string | null;
                    notes?: string | null;
                    tobaccoMarkId: string;
                    warehouse: string;
                    where?: string | null;
                    whoRepresents?: string | null;
                    whoUnder?: string | null;
                } | null;
            }>;
            itemsMentioned: Array<{
                __typename?: 'MentionedItemsObject';
                quantity: number;
                qualifier: string;
                item: string;
            }>;
        } | null;
        people: Array<{
            __typename?: 'PersonObject';
            name: string;
            id?: string | null;
            populate?: {
                __typename?: 'Person';
                id: string;
                account?: string | null;
                enslaved?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                gender?: string | null;
                location?: string | null;
                prefix?: string | null;
                suffix?: string | null;
                profession?: string | null;
                professionCategory?: string | null;
                professionQualifier?: string | null;
                reference?: string | null;
                store?: string | null;
                variations?: string | null;
            } | null;
        }>;
        places: Array<{
            __typename?: 'PlaceObject';
            name: string;
            id?: string | null;
            populate?: {
                __typename?: 'Place';
                id: string;
                location?: string | null;
                alias?: string | null;
                descriptor?: string | null;
            } | null;
        }>;
        money: {
            __typename?: 'MoneyObject';
            commodity: string;
            colony?: string | null;
            quantity?: string | null;
            currency: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            sterling: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
        };
    }> | null;
};

export type AdvancedSearchQueryVariables = Exact<{
    advanced?: InputMaybe<AdvancedSearchInput>;
    options?: InputMaybe<FindAllLimitAndSkip>;
    populate: Scalars['Boolean'];
}>;

export type AdvancedSearchQuery = {
    __typename?: 'Query';
    count?: number | null;
    rows?: Array<{
        __typename?: 'Entry';
        id: string;
        folioRefs: Array<string>;
        ledgerRefs: Array<string>;
        entry: string;
        accountHolder: {
            __typename?: 'AccHolderObject';
            accountFirstName: string;
            accountLastName: string;
            prefix: string;
            suffix: string;
            profession: string;
            location: string;
            reference: string;
            debitOrCredit: number;
            accountHolderID?: string | null;
            populate?: {
                __typename?: 'Person';
                id: string;
                account?: string | null;
                enslaved?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                gender?: string | null;
                location?: string | null;
                prefix?: string | null;
                suffix?: string | null;
                profession?: string | null;
                professionCategory?: string | null;
                professionQualifier?: string | null;
                reference?: string | null;
                store?: string | null;
                variations?: string | null;
            } | null;
        };
        meta: {
            __typename?: 'MetaObject';
            ledger: string;
            reel: string;
            owner: string;
            store: string;
            year: string;
            folioPage: string;
            entryID: string;
            comments: string;
        };
        dateInfo: {
            __typename?: 'DateObject';
            day: number;
            month: number;
            year: number;
            fullDate?: any | null;
        };
        itemEntries?: Array<{
            __typename?: 'ItemEntryObject';
            perOrder: number;
            percentage: number;
            itemsOrServices: Array<{
                __typename?: 'ItemOrServiceObject';
                quantity: number;
                qualifier: string;
                variants: Array<string>;
                item: string;
                category?: string | null;
                subcategory?: string | null;
                unitCost: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                itemCost: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
            } | null>;
            itemsMentioned: Array<{
                __typename?: 'MentionedItemsObject';
                quantity: number;
                qualifier: string;
                item: string;
            }>;
        }> | null;
        tobaccoEntry?: {
            __typename?: 'TobaccoEntryObject';
            entry: string;
            tobaccoShaved: number;
            marks: Array<{
                __typename?: 'TobaccoMarkObject';
                markID: string;
                markName: string;
                populate?: {
                    __typename?: 'TobaccoMark';
                    id: string;
                    description?: string | null;
                    image?: string | null;
                    netWeight?: string | null;
                    note?: string | null;
                    notes?: string | null;
                    tobaccoMarkId: string;
                    warehouse: string;
                    where?: string | null;
                    whoRepresents?: string | null;
                    whoUnder?: string | null;
                } | null;
            }>;
            notes: Array<{
                __typename?: 'NoteObject';
                noteNum: number;
                totalWeight: number;
                barrelWeight: number;
                tobaccoWeight: number;
            }>;
            money: Array<{
                __typename?: 'TobaccoMoneyObject';
                moneyType: string;
                tobaccoAmount: number;
                casksInTransaction: number;
                rateForTobacco: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                tobaccoSold: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                casksSoldForEach: {
                    __typename?: 'PoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
            }>;
        } | null;
        regularEntry?: {
            __typename?: 'RegularEntryObject';
            entry: string;
            tobaccoMarks: Array<{
                __typename?: 'TobaccoMarkObject';
                markID: string;
                markName: string;
                populate?: {
                    __typename?: 'TobaccoMark';
                    id: string;
                    description?: string | null;
                    image?: string | null;
                    netWeight?: string | null;
                    note?: string | null;
                    notes?: string | null;
                    tobaccoMarkId: string;
                    warehouse: string;
                    where?: string | null;
                    whoRepresents?: string | null;
                    whoUnder?: string | null;
                } | null;
            }>;
            itemsMentioned: Array<{
                __typename?: 'MentionedItemsObject';
                quantity: number;
                qualifier: string;
                item: string;
            }>;
        } | null;
        people: Array<{
            __typename?: 'PersonObject';
            name: string;
            id?: string | null;
            populate?: {
                __typename?: 'Person';
                id: string;
                account?: string | null;
                enslaved?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                gender?: string | null;
                location?: string | null;
                prefix?: string | null;
                suffix?: string | null;
                profession?: string | null;
                professionCategory?: string | null;
                professionQualifier?: string | null;
                reference?: string | null;
                store?: string | null;
                variations?: string | null;
            } | null;
        }>;
        places: Array<{
            __typename?: 'PlaceObject';
            name: string;
            id?: string | null;
            populate?: {
                __typename?: 'Place';
                id: string;
                location?: string | null;
                alias?: string | null;
                descriptor?: string | null;
            } | null;
        }>;
        money: {
            __typename?: 'MoneyObject';
            commodity: string;
            colony?: string | null;
            quantity?: string | null;
            currency: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            sterling: {
                __typename?: 'PoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
        };
    }> | null;
};

export type ListUsersQueryVariables = Exact<{ [key: string]: never }>;

export type ListUsersQuery = { __typename?: 'Query'; rows?: any | null };

export type AddUserToGroupMutationVariables = Exact<{
    groupname: Scalars['String'];
    username: Scalars['String'];
}>;

export type AddUserToGroupMutation = {
    __typename?: 'Mutation';
    addUserToGroup?: any | null;
};

export type RemoveUserFromGroupMutationVariables = Exact<{
    groupname: Scalars['String'];
    username: Scalars['String'];
}>;

export type RemoveUserFromGroupMutation = {
    __typename?: 'Mutation';
    removeUserFromGroup?: any | null;
};

export type EnableUserMutationVariables = Exact<{
    username: Scalars['String'];
}>;

export type EnableUserMutation = {
    __typename?: 'Mutation';
    enableUser?: any | null;
};

export type DisableUserMutationVariables = Exact<{
    username: Scalars['String'];
}>;

export type DisableUserMutation = {
    __typename?: 'Mutation';
    disableUser?: any | null;
};

export type ListGroupsForUserQueryVariables = Exact<{
    username: Scalars['String'];
}>;

export type ListGroupsForUserQuery = {
    __typename?: 'Query';
    oldgroups?: any | null;
};

export type ParsedMentionedItemsFragment = {
    __typename?: 'ParsedMentionedItemsObject';
    quantity: number;
    qualifier: string;
    item: string;
};

export type ParsedMoneyFragment = {
    __typename?: 'ParsedPoundsShillingsPence';
    pounds?: number | null;
    shilling?: number | null;
    pence?: number | null;
};

export type ParsedEntryFieldsFragment = {
    __typename?: 'ParsedEntry';
    id: string;
    folioRefs: Array<string>;
    ledgerRefs: Array<string>;
    entry: string;
    documentName: string;
    accountHolder: {
        __typename?: 'ParsedAccHolderObject';
        accountFirstName: string;
        accountLastName: string;
        prefix: string;
        suffix: string;
        profession: string;
        location: string;
        reference: string;
        debitOrCredit: number;
        accountHolderID?: string | null;
        populate?: {
            __typename?: 'Person';
            id: string;
            account?: string | null;
            enslaved?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            gender?: string | null;
            location?: string | null;
            prefix?: string | null;
            suffix?: string | null;
            profession?: string | null;
            professionCategory?: string | null;
            professionQualifier?: string | null;
            reference?: string | null;
            store?: string | null;
            variations?: string | null;
        } | null;
    };
    meta: {
        __typename?: 'ParsedMetaObject';
        ledger: string;
        reel: string;
        owner: string;
        store: string;
        year: string;
        folioPage: string;
        entryID: string;
        comments: string;
    };
    dateInfo: {
        __typename?: 'ParsedDateObject';
        day: number;
        month: number;
        year: number;
        fullDate?: any | null;
    };
    itemEntries?: Array<{
        __typename?: 'ParsedItemEntryObject';
        perOrder: number;
        percentage: number;
        itemsOrServices: Array<{
            __typename?: 'ParsedItemOrServiceObject';
            quantity: number;
            qualifier: string;
            variants: Array<string>;
            item: string;
            category?: string | null;
            subcategory?: string | null;
            unitCost: {
                __typename?: 'ParsedPoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            itemCost: {
                __typename?: 'ParsedPoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
        } | null>;
        itemsMentioned: Array<{
            __typename?: 'ParsedMentionedItemsObject';
            quantity: number;
            qualifier: string;
            item: string;
        }>;
    }> | null;
    tobaccoEntry?: {
        __typename?: 'ParsedTobaccoEntryObject';
        entry: string;
        tobaccoShaved: number;
        marks: Array<{
            __typename?: 'ParsedTobaccoMarkObject';
            markID: string;
            markName: string;
            populate?: {
                __typename?: 'TobaccoMark';
                id: string;
                description?: string | null;
                image?: string | null;
                netWeight?: string | null;
                note?: string | null;
                notes?: string | null;
                tobaccoMarkId: string;
                warehouse: string;
                where?: string | null;
                whoRepresents?: string | null;
                whoUnder?: string | null;
            } | null;
        }>;
        notes: Array<{
            __typename?: 'ParsedNoteObject';
            noteNum: number;
            totalWeight: number;
            barrelWeight: number;
            tobaccoWeight: number;
        }>;
        money: Array<{
            __typename?: 'ParsedTobaccoMoneyObject';
            moneyType: string;
            tobaccoAmount: number;
            casksInTransaction: number;
            rateForTobacco: {
                __typename?: 'ParsedPoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            tobaccoSold: {
                __typename?: 'ParsedPoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            casksSoldForEach: {
                __typename?: 'ParsedPoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
        }>;
    } | null;
    regularEntry?: {
        __typename?: 'ParsedRegularEntryObject';
        entry: string;
        tobaccoMarks: Array<{
            __typename?: 'ParsedTobaccoMarkObject';
            markID: string;
            markName: string;
            populate?: {
                __typename?: 'TobaccoMark';
                id: string;
                description?: string | null;
                image?: string | null;
                netWeight?: string | null;
                note?: string | null;
                notes?: string | null;
                tobaccoMarkId: string;
                warehouse: string;
                where?: string | null;
                whoRepresents?: string | null;
                whoUnder?: string | null;
            } | null;
        }>;
        itemsMentioned: Array<{
            __typename?: 'ParsedMentionedItemsObject';
            quantity: number;
            qualifier: string;
            item: string;
        }>;
    } | null;
    people: Array<{
        __typename?: 'ParsedPersonObject';
        name: string;
        id?: string | null;
        populate?: {
            __typename?: 'Person';
            id: string;
            account?: string | null;
            enslaved?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            gender?: string | null;
            location?: string | null;
            prefix?: string | null;
            suffix?: string | null;
            profession?: string | null;
            professionCategory?: string | null;
            professionQualifier?: string | null;
            reference?: string | null;
            store?: string | null;
            variations?: string | null;
        } | null;
    }>;
    places: Array<{
        __typename?: 'ParsedPlaceObject';
        name: string;
        id?: string | null;
        populate?: {
            __typename?: 'Place';
            id: string;
            location?: string | null;
            alias?: string | null;
            descriptor?: string | null;
        } | null;
    }>;
    money: {
        __typename?: 'ParsedMoneyObject';
        commodity: string;
        colony?: string | null;
        quantity?: string | null;
        currency: {
            __typename?: 'ParsedPoundsShillingsPence';
            pounds?: number | null;
            shilling?: number | null;
            pence?: number | null;
        };
        sterling: {
            __typename?: 'ParsedPoundsShillingsPence';
            pounds?: number | null;
            shilling?: number | null;
            pence?: number | null;
        };
    };
};

export type ParsedEntriesQueryQueryVariables = Exact<{
    search?: InputMaybe<Scalars['String']>;
    options?: InputMaybe<FindAllLimitAndSkip>;
    populate: Scalars['Boolean'];
}>;

export type ParsedEntriesQueryQuery = {
    __typename?: 'Query';
    count: number;
    rows?: Array<{
        __typename?: 'ParsedEntry';
        id: string;
        folioRefs: Array<string>;
        ledgerRefs: Array<string>;
        entry: string;
        documentName: string;
        accountHolder: {
            __typename?: 'ParsedAccHolderObject';
            accountFirstName: string;
            accountLastName: string;
            prefix: string;
            suffix: string;
            profession: string;
            location: string;
            reference: string;
            debitOrCredit: number;
            accountHolderID?: string | null;
            populate?: {
                __typename?: 'Person';
                id: string;
                account?: string | null;
                enslaved?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                gender?: string | null;
                location?: string | null;
                prefix?: string | null;
                suffix?: string | null;
                profession?: string | null;
                professionCategory?: string | null;
                professionQualifier?: string | null;
                reference?: string | null;
                store?: string | null;
                variations?: string | null;
            } | null;
        };
        meta: {
            __typename?: 'ParsedMetaObject';
            ledger: string;
            reel: string;
            owner: string;
            store: string;
            year: string;
            folioPage: string;
            entryID: string;
            comments: string;
        };
        dateInfo: {
            __typename?: 'ParsedDateObject';
            day: number;
            month: number;
            year: number;
            fullDate?: any | null;
        };
        itemEntries?: Array<{
            __typename?: 'ParsedItemEntryObject';
            perOrder: number;
            percentage: number;
            itemsOrServices: Array<{
                __typename?: 'ParsedItemOrServiceObject';
                quantity: number;
                qualifier: string;
                variants: Array<string>;
                item: string;
                category?: string | null;
                subcategory?: string | null;
                unitCost: {
                    __typename?: 'ParsedPoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                itemCost: {
                    __typename?: 'ParsedPoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
            } | null>;
            itemsMentioned: Array<{
                __typename?: 'ParsedMentionedItemsObject';
                quantity: number;
                qualifier: string;
                item: string;
            }>;
        }> | null;
        tobaccoEntry?: {
            __typename?: 'ParsedTobaccoEntryObject';
            entry: string;
            tobaccoShaved: number;
            marks: Array<{
                __typename?: 'ParsedTobaccoMarkObject';
                markID: string;
                markName: string;
                populate?: {
                    __typename?: 'TobaccoMark';
                    id: string;
                    description?: string | null;
                    image?: string | null;
                    netWeight?: string | null;
                    note?: string | null;
                    notes?: string | null;
                    tobaccoMarkId: string;
                    warehouse: string;
                    where?: string | null;
                    whoRepresents?: string | null;
                    whoUnder?: string | null;
                } | null;
            }>;
            notes: Array<{
                __typename?: 'ParsedNoteObject';
                noteNum: number;
                totalWeight: number;
                barrelWeight: number;
                tobaccoWeight: number;
            }>;
            money: Array<{
                __typename?: 'ParsedTobaccoMoneyObject';
                moneyType: string;
                tobaccoAmount: number;
                casksInTransaction: number;
                rateForTobacco: {
                    __typename?: 'ParsedPoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                tobaccoSold: {
                    __typename?: 'ParsedPoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
                casksSoldForEach: {
                    __typename?: 'ParsedPoundsShillingsPence';
                    pounds?: number | null;
                    shilling?: number | null;
                    pence?: number | null;
                };
            }>;
        } | null;
        regularEntry?: {
            __typename?: 'ParsedRegularEntryObject';
            entry: string;
            tobaccoMarks: Array<{
                __typename?: 'ParsedTobaccoMarkObject';
                markID: string;
                markName: string;
                populate?: {
                    __typename?: 'TobaccoMark';
                    id: string;
                    description?: string | null;
                    image?: string | null;
                    netWeight?: string | null;
                    note?: string | null;
                    notes?: string | null;
                    tobaccoMarkId: string;
                    warehouse: string;
                    where?: string | null;
                    whoRepresents?: string | null;
                    whoUnder?: string | null;
                } | null;
            }>;
            itemsMentioned: Array<{
                __typename?: 'ParsedMentionedItemsObject';
                quantity: number;
                qualifier: string;
                item: string;
            }>;
        } | null;
        people: Array<{
            __typename?: 'ParsedPersonObject';
            name: string;
            id?: string | null;
            populate?: {
                __typename?: 'Person';
                id: string;
                account?: string | null;
                enslaved?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                gender?: string | null;
                location?: string | null;
                prefix?: string | null;
                suffix?: string | null;
                profession?: string | null;
                professionCategory?: string | null;
                professionQualifier?: string | null;
                reference?: string | null;
                store?: string | null;
                variations?: string | null;
            } | null;
        }>;
        places: Array<{
            __typename?: 'ParsedPlaceObject';
            name: string;
            id?: string | null;
            populate?: {
                __typename?: 'Place';
                id: string;
                location?: string | null;
                alias?: string | null;
                descriptor?: string | null;
            } | null;
        }>;
        money: {
            __typename?: 'ParsedMoneyObject';
            commodity: string;
            colony?: string | null;
            quantity?: string | null;
            currency: {
                __typename?: 'ParsedPoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
            sterling: {
                __typename?: 'ParsedPoundsShillingsPence';
                pounds?: number | null;
                shilling?: number | null;
                pence?: number | null;
            };
        };
    }> | null;
};

export const GlossaryItemFieldsFragmentDoc = gql`
    fragment glossaryItemFields on GlossaryItem {
        id
        name
        description
        origin
        use
        category
        subcategory
        qualifiers
        culturalContext
        citations
        images {
            imageKey
            name
            material
            dimensions
            date
            caption
            collectionCitation
            url
            license
        }
    }
`;
export const DocumentFieldsFragmentDoc = gql`
    fragment documentFields on DocumentInfo {
        id
        name
        description
        fileKey
    }
`;
export const CategoryFieldsFragmentDoc = gql`
    fragment categoryFields on Category {
        id
        item
        category
        subcategory
    }
`;
export const ItemsFieldsFragmentDoc = gql`
    fragment itemsFields on Item {
        id
        item
        variants
    }
`;
export const PersonFieldsFragmentDoc = gql`
    fragment personFields on Person {
        id
        account
        enslaved
        firstName
        lastName
        gender
        location
        prefix
        suffix
        profession
        professionCategory
        professionQualifier
        reference
        store
        variations
    }
`;
export const MoneyFragmentDoc = gql`
    fragment money on PoundsShillingsPence {
        pounds
        shilling
        pence
    }
`;
export const MentionedItemsFragmentDoc = gql`
    fragment mentionedItems on MentionedItemsObject {
        quantity
        qualifier
        item
    }
`;
export const MarkFieldsFragmentDoc = gql`
    fragment markFields on TobaccoMark {
        id
        description
        image
        netWeight
        note
        notes
        tobaccoMarkId
        warehouse
        where
        whoRepresents
        whoUnder
    }
`;
export const PlaceFieldsFragmentDoc = gql`
    fragment placeFields on Place {
        id
        location
        alias
        descriptor
    }
`;
export const EntryFieldsFragmentDoc = gql`
    fragment entryFields on Entry {
        id
        accountHolder {
            accountFirstName
            accountLastName
            prefix
            suffix
            profession
            location
            reference
            debitOrCredit
            accountHolderID
            populate @include(if: $populate) {
                ...personFields
            }
        }
        meta {
            ledger
            reel
            owner
            store
            year
            folioPage
            entryID
            comments
        }
        dateInfo {
            day
            month
            year
            fullDate
        }
        folioRefs
        ledgerRefs
        itemEntries {
            perOrder
            percentage
            itemsOrServices {
                quantity
                qualifier
                variants
                item
                category
                subcategory
                unitCost {
                    ...money
                }
                itemCost {
                    ...money
                }
            }
            itemsMentioned {
                ...mentionedItems
            }
        }
        tobaccoEntry {
            entry
            marks {
                markID
                markName
                populate @include(if: $populate) {
                    ...markFields
                }
            }
            notes {
                noteNum
                totalWeight
                barrelWeight
                tobaccoWeight
            }
            money {
                moneyType
                tobaccoAmount
                rateForTobacco {
                    ...money
                }
                casksInTransaction
                tobaccoSold {
                    ...money
                }
                casksSoldForEach {
                    ...money
                }
            }
            tobaccoShaved
        }
        regularEntry {
            entry
            tobaccoMarks {
                markID
                markName
                populate @include(if: $populate) {
                    ...markFields
                }
            }
            itemsMentioned {
                ...mentionedItems
            }
        }
        people {
            name
            id
            populate @include(if: $populate) {
                ...personFields
            }
        }
        places {
            name
            id
            populate @include(if: $populate) {
                ...placeFields
            }
        }
        entry
        money {
            commodity
            colony
            quantity
            currency {
                ...money
            }
            sterling {
                ...money
            }
        }
    }
    ${PersonFieldsFragmentDoc}
    ${MoneyFragmentDoc}
    ${MentionedItemsFragmentDoc}
    ${MarkFieldsFragmentDoc}
    ${PlaceFieldsFragmentDoc}
`;
export const ParsedMoneyFragmentDoc = gql`
    fragment parsedMoney on ParsedPoundsShillingsPence {
        pounds
        shilling
        pence
    }
`;
export const ParsedMentionedItemsFragmentDoc = gql`
    fragment parsedMentionedItems on ParsedMentionedItemsObject {
        quantity
        qualifier
        item
    }
`;
export const ParsedEntryFieldsFragmentDoc = gql`
    fragment parsedEntryFields on ParsedEntry {
        id
        accountHolder {
            accountFirstName
            accountLastName
            prefix
            suffix
            profession
            location
            reference
            debitOrCredit
            accountHolderID
            populate @include(if: $populate) {
                ...personFields
            }
        }
        meta {
            ledger
            reel
            owner
            store
            year
            folioPage
            entryID
            comments
        }
        dateInfo {
            day
            month
            year
            fullDate
        }
        folioRefs
        ledgerRefs
        itemEntries {
            perOrder
            percentage
            itemsOrServices {
                quantity
                qualifier
                variants
                item
                category
                subcategory
                unitCost {
                    ...parsedMoney
                }
                itemCost {
                    ...parsedMoney
                }
            }
            itemsMentioned {
                ...parsedMentionedItems
            }
        }
        tobaccoEntry {
            entry
            marks {
                markID
                markName
                populate @include(if: $populate) {
                    ...markFields
                }
            }
            notes {
                noteNum
                totalWeight
                barrelWeight
                tobaccoWeight
            }
            money {
                moneyType
                tobaccoAmount
                rateForTobacco {
                    ...parsedMoney
                }
                casksInTransaction
                tobaccoSold {
                    ...parsedMoney
                }
                casksSoldForEach {
                    ...parsedMoney
                }
            }
            tobaccoShaved
        }
        regularEntry {
            entry
            tobaccoMarks {
                markID
                markName
                populate @include(if: $populate) {
                    ...markFields
                }
            }
            itemsMentioned {
                ...parsedMentionedItems
            }
        }
        people {
            name
            id
            populate @include(if: $populate) {
                ...personFields
            }
        }
        places {
            name
            id
            populate @include(if: $populate) {
                ...placeFields
            }
        }
        entry
        money {
            commodity
            colony
            quantity
            currency {
                ...parsedMoney
            }
            sterling {
                ...parsedMoney
            }
        }
        documentName
    }
    ${PersonFieldsFragmentDoc}
    ${ParsedMoneyFragmentDoc}
    ${ParsedMentionedItemsFragmentDoc}
    ${MarkFieldsFragmentDoc}
    ${PlaceFieldsFragmentDoc}
`;
export const CreateGlossaryItemDocument = gql`
    mutation createGlossaryItem($item: CreateGlossaryItemInput!) {
        createGlossaryItem(newGlossaryItem: $item) {
            ...glossaryItemFields
        }
    }
    ${GlossaryItemFieldsFragmentDoc}
`;

export function useCreateGlossaryItemMutation() {
    return Urql.useMutation<
        CreateGlossaryItemMutation,
        CreateGlossaryItemMutationVariables
    >(CreateGlossaryItemDocument);
}
export const GlossaryItemsQueryDocument = gql`
    query glossaryItemsQuery($search: String, $options: FindAllLimitAndSkip) {
        rows: findGlossaryItems(search: $search, options: $options) {
            ...glossaryItemFields
        }
        count: countGlossaryItems(search: $search)
    }
    ${GlossaryItemFieldsFragmentDoc}
`;

export function useGlossaryItemsQueryQuery(
    options?: Omit<
        Urql.UseQueryArgs<GlossaryItemsQueryQueryVariables>,
        'query'
    >,
) {
    return Urql.useQuery<
        GlossaryItemsQueryQuery,
        GlossaryItemsQueryQueryVariables
    >({ query: GlossaryItemsQueryDocument, ...options });
}
export const UpdateGlossaryItemDocument = gql`
    mutation updateGlossaryItem(
        $id: String!
        $updates: UpdateGlossaryItemInput!
    ) {
        updateGlossaryItem(id: $id, updatedFields: $updates) {
            ...glossaryItemFields
        }
    }
    ${GlossaryItemFieldsFragmentDoc}
`;

export function useUpdateGlossaryItemMutation() {
    return Urql.useMutation<
        UpdateGlossaryItemMutation,
        UpdateGlossaryItemMutationVariables
    >(UpdateGlossaryItemDocument);
}
export const DeleteGlossaryItemDocument = gql`
    mutation deleteGlossaryItem($id: String!) {
        deletedItem: deleteGlossaryItem(id: $id) {
            ...glossaryItemFields
        }
    }
    ${GlossaryItemFieldsFragmentDoc}
`;

export function useDeleteGlossaryItemMutation() {
    return Urql.useMutation<
        DeleteGlossaryItemMutation,
        DeleteGlossaryItemMutationVariables
    >(DeleteGlossaryItemDocument);
}
export const GlossaryItemQueryDocument = gql`
    query glossaryItemQuery($id: String!) {
        item: findGlossaryItem(id: $id) {
            ...glossaryItemFields
        }
    }
    ${GlossaryItemFieldsFragmentDoc}
`;

export function useGlossaryItemQueryQuery(
    options: Omit<Urql.UseQueryArgs<GlossaryItemQueryQueryVariables>, 'query'>,
) {
    return Urql.useQuery<
        GlossaryItemQueryQuery,
        GlossaryItemQueryQueryVariables
    >({ query: GlossaryItemQueryDocument, ...options });
}
export const CreateDocumentDocument = gql`
    mutation createDocument($doc: CreateDocumentInput!) {
        doc: createDocument(newDocument: $doc) {
            ...documentFields
        }
    }
    ${DocumentFieldsFragmentDoc}
`;

export function useCreateDocumentMutation() {
    return Urql.useMutation<
        CreateDocumentMutation,
        CreateDocumentMutationVariables
    >(CreateDocumentDocument);
}
export const FetchDocumentsDocument = gql`
    query fetchDocuments($search: String, $options: FindAllLimitAndSkip) {
        rows: findDocuments(search: $search, options: $options) {
            ...documentFields
        }
        count: countDocuments(search: $search)
    }
    ${DocumentFieldsFragmentDoc}
`;

export function useFetchDocumentsQuery(
    options?: Omit<Urql.UseQueryArgs<FetchDocumentsQueryVariables>, 'query'>,
) {
    return Urql.useQuery<FetchDocumentsQuery, FetchDocumentsQueryVariables>({
        query: FetchDocumentsDocument,
        ...options,
    });
}
export const UpdateDocumentDocument = gql`
    mutation updateDocument($id: String!, $updates: UpdateDocumentInput!) {
        doc: updateDocument(id: $id, updatedFields: $updates) {
            ...documentFields
        }
    }
    ${DocumentFieldsFragmentDoc}
`;

export function useUpdateDocumentMutation() {
    return Urql.useMutation<
        UpdateDocumentMutation,
        UpdateDocumentMutationVariables
    >(UpdateDocumentDocument);
}
export const DeleteDocumentDocument = gql`
    mutation deleteDocument($id: String!) {
        doc: deleteDocument(id: $id) {
            ...documentFields
        }
    }
    ${DocumentFieldsFragmentDoc}
`;

export function useDeleteDocumentMutation() {
    return Urql.useMutation<
        DeleteDocumentMutation,
        DeleteDocumentMutationVariables
    >(DeleteDocumentDocument);
}
export const FetchPeopleDocument = gql`
    query FetchPeople($search: String!, $options: FindAllLimitAndSkip) {
        people: findPeople(search: $search, options: $options) {
            id
            firstName
            lastName
            name: fullName
        }
    }
`;

export function useFetchPeopleQuery(
    options: Omit<Urql.UseQueryArgs<FetchPeopleQueryVariables>, 'query'>,
) {
    return Urql.useQuery<FetchPeopleQuery, FetchPeopleQueryVariables>({
        query: FetchPeopleDocument,
        ...options,
    });
}
export const SearchPlacesDocument = gql`
    query searchPlaces($search: String!, $options: FindAllLimitAndSkip) {
        places: findPlaces(search: $search, options: $options) {
            id
            name: location
        }
    }
`;

export function useSearchPlacesQuery(
    options: Omit<Urql.UseQueryArgs<SearchPlacesQueryVariables>, 'query'>,
) {
    return Urql.useQuery<SearchPlacesQuery, SearchPlacesQueryVariables>({
        query: SearchPlacesDocument,
        ...options,
    });
}
export const FetchMarksDocument = gql`
    query FetchMarks($search: String!, $options: FindAllLimitAndSkip) {
        marks: findTobaccoMarks(search: $search, options: $options) {
            id
            markID: id
            markName: tobaccoMarkId
        }
    }
`;

export function useFetchMarksQuery(
    options: Omit<Urql.UseQueryArgs<FetchMarksQueryVariables>, 'query'>,
) {
    return Urql.useQuery<FetchMarksQuery, FetchMarksQueryVariables>({
        query: FetchMarksDocument,
        ...options,
    });
}
export const CreateCategoryDocument = gql`
    mutation createCategory($category: CreateCategoryInput!) {
        createCategory(category: $category) {
            ...categoryFields
        }
    }
    ${CategoryFieldsFragmentDoc}
`;

export function useCreateCategoryMutation() {
    return Urql.useMutation<
        CreateCategoryMutation,
        CreateCategoryMutationVariables
    >(CreateCategoryDocument);
}
export const CategoriesQueryDocument = gql`
    query CategoriesQuery($search: String, $options: FindAllLimitAndSkip) {
        rows: findCategories(search: $search, options: $options) {
            ...categoryFields
        }
        count: countCategories(search: $search)
    }
    ${CategoryFieldsFragmentDoc}
`;

export function useCategoriesQueryQuery(
    options?: Omit<Urql.UseQueryArgs<CategoriesQueryQueryVariables>, 'query'>,
) {
    return Urql.useQuery<CategoriesQueryQuery, CategoriesQueryQueryVariables>({
        query: CategoriesQueryDocument,
        ...options,
    });
}
export const UpdateCategoryDocument = gql`
    mutation updateCategory($id: String!, $updates: UpdateCategoryInput!) {
        updateCategory(id: $id, updatedFields: $updates) {
            ...categoryFields
        }
    }
    ${CategoryFieldsFragmentDoc}
`;

export function useUpdateCategoryMutation() {
    return Urql.useMutation<
        UpdateCategoryMutation,
        UpdateCategoryMutationVariables
    >(UpdateCategoryDocument);
}
export const DeleteCategoryDocument = gql`
    mutation deleteCategory($id: String!) {
        deleteCategory(id: $id) {
            ...categoryFields
        }
    }
    ${CategoryFieldsFragmentDoc}
`;

export function useDeleteCategoryMutation() {
    return Urql.useMutation<
        DeleteCategoryMutation,
        DeleteCategoryMutationVariables
    >(DeleteCategoryDocument);
}
export const CreateItemDocument = gql`
    mutation createItem($item: CreateItemInput!) {
        createItem(item: $item) {
            ...itemsFields
        }
    }
    ${ItemsFieldsFragmentDoc}
`;

export function useCreateItemMutation() {
    return Urql.useMutation<CreateItemMutation, CreateItemMutationVariables>(
        CreateItemDocument,
    );
}
export const ItemsQueryDocument = gql`
    query itemsQuery($search: String, $options: FindAllLimitAndSkip) {
        rows: findItems(search: $search, options: $options) {
            ...itemsFields
        }
        count: countItems(search: $search)
    }
    ${ItemsFieldsFragmentDoc}
`;

export function useItemsQueryQuery(
    options?: Omit<Urql.UseQueryArgs<ItemsQueryQueryVariables>, 'query'>,
) {
    return Urql.useQuery<ItemsQueryQuery, ItemsQueryQueryVariables>({
        query: ItemsQueryDocument,
        ...options,
    });
}
export const UpdateItemDocument = gql`
    mutation updateItem($id: String!, $updates: UpdateItemInput!) {
        updateItem(id: $id, updatedFields: $updates) {
            ...itemsFields
        }
    }
    ${ItemsFieldsFragmentDoc}
`;

export function useUpdateItemMutation() {
    return Urql.useMutation<UpdateItemMutation, UpdateItemMutationVariables>(
        UpdateItemDocument,
    );
}
export const DeleteItemDocument = gql`
    mutation deleteItem($id: String!) {
        deleteItem(id: $id) {
            ...itemsFields
        }
    }
    ${ItemsFieldsFragmentDoc}
`;

export function useDeleteItemMutation() {
    return Urql.useMutation<DeleteItemMutation, DeleteItemMutationVariables>(
        DeleteItemDocument,
    );
}
export const CreatePersonDocument = gql`
    mutation createPerson($person: CreatePersonInput!) {
        createPerson(person: $person) {
            ...personFields
        }
    }
    ${PersonFieldsFragmentDoc}
`;

export function useCreatePersonMutation() {
    return Urql.useMutation<
        CreatePersonMutation,
        CreatePersonMutationVariables
    >(CreatePersonDocument);
}
export const FetchPersonDocument = gql`
    query FetchPerson($id: String!) {
        person: findOnePerson(id: $id) {
            ...personFields
        }
    }
    ${PersonFieldsFragmentDoc}
`;

export function useFetchPersonQuery(
    options: Omit<Urql.UseQueryArgs<FetchPersonQueryVariables>, 'query'>,
) {
    return Urql.useQuery<FetchPersonQuery, FetchPersonQueryVariables>({
        query: FetchPersonDocument,
        ...options,
    });
}
export const PeopleQueryDocument = gql`
    query peopleQuery($search: String, $options: FindAllLimitAndSkip) {
        rows: findPeople(search: $search, options: $options) {
            ...personFields
        }
        count: countPeople(search: $search)
    }
    ${PersonFieldsFragmentDoc}
`;

export function usePeopleQueryQuery(
    options?: Omit<Urql.UseQueryArgs<PeopleQueryQueryVariables>, 'query'>,
) {
    return Urql.useQuery<PeopleQueryQuery, PeopleQueryQueryVariables>({
        query: PeopleQueryDocument,
        ...options,
    });
}
export const UpdatePersonDocument = gql`
    mutation updatePerson($id: String!, $updates: UpdatePersonInput!) {
        updatePerson(id: $id, updatedFields: $updates) {
            ...personFields
        }
    }
    ${PersonFieldsFragmentDoc}
`;

export function useUpdatePersonMutation() {
    return Urql.useMutation<
        UpdatePersonMutation,
        UpdatePersonMutationVariables
    >(UpdatePersonDocument);
}
export const DeletePersonDocument = gql`
    mutation deletePerson($id: String!) {
        deletePerson(id: $id) {
            ...personFields
        }
    }
    ${PersonFieldsFragmentDoc}
`;

export function useDeletePersonMutation() {
    return Urql.useMutation<
        DeletePersonMutation,
        DeletePersonMutationVariables
    >(DeletePersonDocument);
}
export const FetchPlaceDocument = gql`
    query FetchPlace($id: String!) {
        place: findOnePlace(id: $id) {
            ...placeFields
        }
    }
    ${PlaceFieldsFragmentDoc}
`;

export function useFetchPlaceQuery(
    options: Omit<Urql.UseQueryArgs<FetchPlaceQueryVariables>, 'query'>,
) {
    return Urql.useQuery<FetchPlaceQuery, FetchPlaceQueryVariables>({
        query: FetchPlaceDocument,
        ...options,
    });
}
export const CreatePlaceDocument = gql`
    mutation createPlace($place: CreatePlaceInput!) {
        createPlace(place: $place) {
            ...placeFields
        }
    }
    ${PlaceFieldsFragmentDoc}
`;

export function useCreatePlaceMutation() {
    return Urql.useMutation<CreatePlaceMutation, CreatePlaceMutationVariables>(
        CreatePlaceDocument,
    );
}
export const PlacesQueryDocument = gql`
    query placesQuery($search: String, $options: FindAllLimitAndSkip) {
        rows: findPlaces(search: $search, options: $options) {
            ...placeFields
        }
        count: countPlaces(search: $search)
    }
    ${PlaceFieldsFragmentDoc}
`;

export function usePlacesQueryQuery(
    options?: Omit<Urql.UseQueryArgs<PlacesQueryQueryVariables>, 'query'>,
) {
    return Urql.useQuery<PlacesQueryQuery, PlacesQueryQueryVariables>({
        query: PlacesQueryDocument,
        ...options,
    });
}
export const UpdatePlaceDocument = gql`
    mutation updatePlace($id: String!, $updates: UpdatePlaceInput!) {
        updatePlace(id: $id, updatedFields: $updates) {
            ...placeFields
        }
    }
    ${PlaceFieldsFragmentDoc}
`;

export function useUpdatePlaceMutation() {
    return Urql.useMutation<UpdatePlaceMutation, UpdatePlaceMutationVariables>(
        UpdatePlaceDocument,
    );
}
export const DeletePlaceDocument = gql`
    mutation deletePlace($id: String!) {
        deletePlace(id: $id) {
            ...placeFields
        }
    }
    ${PlaceFieldsFragmentDoc}
`;

export function useDeletePlaceMutation() {
    return Urql.useMutation<DeletePlaceMutation, DeletePlaceMutationVariables>(
        DeletePlaceDocument,
    );
}
export const FetchMarkDocument = gql`
    query FetchMark($id: String!) {
        mark: findOneTobaccoMark(id: $id) {
            ...markFields
        }
    }
    ${MarkFieldsFragmentDoc}
`;

export function useFetchMarkQuery(
    options: Omit<Urql.UseQueryArgs<FetchMarkQueryVariables>, 'query'>,
) {
    return Urql.useQuery<FetchMarkQuery, FetchMarkQueryVariables>({
        query: FetchMarkDocument,
        ...options,
    });
}
export const CreateTobaccoMarkDocument = gql`
    mutation createTobaccoMark($mark: CreateTobaccoMarkInput!) {
        createTobaccoMark(tobaccoMark: $mark) {
            ...markFields
        }
    }
    ${MarkFieldsFragmentDoc}
`;

export function useCreateTobaccoMarkMutation() {
    return Urql.useMutation<
        CreateTobaccoMarkMutation,
        CreateTobaccoMarkMutationVariables
    >(CreateTobaccoMarkDocument);
}
export const TobaccoMarksQueryDocument = gql`
    query tobaccoMarksQuery($search: String, $options: FindAllLimitAndSkip) {
        rows: findTobaccoMarks(search: $search, options: $options) {
            ...markFields
        }
        count: countTobaccoMarks(search: $search)
    }
    ${MarkFieldsFragmentDoc}
`;

export function useTobaccoMarksQueryQuery(
    options?: Omit<Urql.UseQueryArgs<TobaccoMarksQueryQueryVariables>, 'query'>,
) {
    return Urql.useQuery<
        TobaccoMarksQueryQuery,
        TobaccoMarksQueryQueryVariables
    >({ query: TobaccoMarksQueryDocument, ...options });
}
export const UpdateTobaccoMarkDocument = gql`
    mutation updateTobaccoMark(
        $id: String!
        $updates: UpdateTobaccoMarkInput!
    ) {
        updateTobaccoMark(id: $id, updatedFields: $updates) {
            ...markFields
        }
    }
    ${MarkFieldsFragmentDoc}
`;

export function useUpdateTobaccoMarkMutation() {
    return Urql.useMutation<
        UpdateTobaccoMarkMutation,
        UpdateTobaccoMarkMutationVariables
    >(UpdateTobaccoMarkDocument);
}
export const DeleteTobaccoMarkDocument = gql`
    mutation deleteTobaccoMark($id: String!) {
        deleteTobaccoMark(id: $id) {
            ...markFields
        }
    }
    ${MarkFieldsFragmentDoc}
`;

export function useDeleteTobaccoMarkMutation() {
    return Urql.useMutation<
        DeleteTobaccoMarkMutation,
        DeleteTobaccoMarkMutationVariables
    >(DeleteTobaccoMarkDocument);
}
export const EntriesQueryDocument = gql`
    query entriesQuery(
        $search: String
        $options: FindAllLimitAndSkip
        $populate: Boolean!
    ) {
        rows: findEntries(search: $search, options: $options) {
            ...entryFields
        }
        count: countEntries(search: $search)
    }
    ${EntryFieldsFragmentDoc}
`;

export function useEntriesQueryQuery(
    options: Omit<Urql.UseQueryArgs<EntriesQueryQueryVariables>, 'query'>,
) {
    return Urql.useQuery<EntriesQueryQuery, EntriesQueryQueryVariables>({
        query: EntriesQueryDocument,
        ...options,
    });
}
export const AdvancedSearchDocument = gql`
    query AdvancedSearch(
        $advanced: AdvancedSearchInput
        $options: FindAllLimitAndSkip
        $populate: Boolean!
    ) {
        rows: advancedFindEntries(search: $advanced, options: $options) {
            ...entryFields
        }
        count: advancedCountEntries(search: $advanced)
    }
    ${EntryFieldsFragmentDoc}
`;

export function useAdvancedSearchQuery(
    options: Omit<Urql.UseQueryArgs<AdvancedSearchQueryVariables>, 'query'>,
) {
    return Urql.useQuery<AdvancedSearchQuery, AdvancedSearchQueryVariables>({
        query: AdvancedSearchDocument,
        ...options,
    });
}
export const ListUsersDocument = gql`
    query listUsers {
        rows: listUsers
    }
`;

export function useListUsersQuery(
    options?: Omit<Urql.UseQueryArgs<ListUsersQueryVariables>, 'query'>,
) {
    return Urql.useQuery<ListUsersQuery, ListUsersQueryVariables>({
        query: ListUsersDocument,
        ...options,
    });
}
export const AddUserToGroupDocument = gql`
    mutation addUserToGroup($groupname: String!, $username: String!) {
        addUserToGroup(groupname: $groupname, username: $username)
    }
`;

export function useAddUserToGroupMutation() {
    return Urql.useMutation<
        AddUserToGroupMutation,
        AddUserToGroupMutationVariables
    >(AddUserToGroupDocument);
}
export const RemoveUserFromGroupDocument = gql`
    mutation removeUserFromGroup($groupname: String!, $username: String!) {
        removeUserFromGroup(groupname: $groupname, username: $username)
    }
`;

export function useRemoveUserFromGroupMutation() {
    return Urql.useMutation<
        RemoveUserFromGroupMutation,
        RemoveUserFromGroupMutationVariables
    >(RemoveUserFromGroupDocument);
}
export const EnableUserDocument = gql`
    mutation enableUser($username: String!) {
        enableUser(username: $username)
    }
`;

export function useEnableUserMutation() {
    return Urql.useMutation<EnableUserMutation, EnableUserMutationVariables>(
        EnableUserDocument,
    );
}
export const DisableUserDocument = gql`
    mutation disableUser($username: String!) {
        disableUser(username: $username)
    }
`;

export function useDisableUserMutation() {
    return Urql.useMutation<DisableUserMutation, DisableUserMutationVariables>(
        DisableUserDocument,
    );
}
export const ListGroupsForUserDocument = gql`
    query listGroupsForUser($username: String!) {
        oldgroups: listGroupsForUser(username: $username)
    }
`;

export function useListGroupsForUserQuery(
    options: Omit<Urql.UseQueryArgs<ListGroupsForUserQueryVariables>, 'query'>,
) {
    return Urql.useQuery<
        ListGroupsForUserQuery,
        ListGroupsForUserQueryVariables
    >({ query: ListGroupsForUserDocument, ...options });
}
export const ParsedEntriesQueryDocument = gql`
    query parsedEntriesQuery(
        $search: String
        $options: FindAllLimitAndSkip
        $populate: Boolean!
    ) {
        rows: findParsedEntries(search: $search, options: $options) {
            ...parsedEntryFields
        }
        count: countEntries(search: $search)
    }
    ${ParsedEntryFieldsFragmentDoc}
`;

export function useParsedEntriesQueryQuery(
    options: Omit<Urql.UseQueryArgs<ParsedEntriesQueryQueryVariables>, 'query'>,
) {
    return Urql.useQuery<
        ParsedEntriesQueryQuery,
        ParsedEntriesQueryQueryVariables
    >({ query: ParsedEntriesQueryDocument, ...options });
}
