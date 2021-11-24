export interface GlossaryItem {
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
    images: [
        {
            dimensions: string;
            imageKey: string;
            name: string;
            material: string;
            date: string;
            caption: string;
            collectionCitation: string;
            url: string;
            license: string;
        },
    ];
}
export interface SearchType {
    search: string;
}
export interface DocumentInfo {
    id: string;
    name: string;
    description: string;
    fileKey: string;
}

export type CreateDocument = Omit<DocumentInfo, 'id'>;
export interface OptionsType {
    limit: number | null;
    skip: number | null;
}

export interface PersonOrPlace {
    name: string;
    id: string;
}

export interface Mark {
    markID: string;
    markName: string;
}

export interface PoundsShillingPence {
    pounds: number;
    shilling: number;
    pence: number;
}

export interface AccountHolder {
    accountFirstName: string;
    accountLastName: string;
    prefix: string;
    suffix: string;
    profession: string;
    location: string;
    reference: string;
    debitOrCredit: number;
    accountHolderID: string;
}

export interface MetaInformation {
    ledger: string;
    reel: string;
    owner: string;
    store: string;
    year: string;
    folioPage: string;
    entryID: string;
    comments: string;
}

export interface DateInfo {
    day: number;
    month: number;
    year: number;
    fullDate: Date | '';
}

export interface ItemMentioned {
    quantity: number;
    qualifier: string;
    item: string;
}

export interface ItemOrService {
    quantity: number;
    qualifier: string;
    variants: string[];
    item: string;
    category: string;
    subcategory: string;
    unitCost: PoundsShillingPence;
    itemCost: PoundsShillingPence;
}

export interface ItemEntry {
    perOrder: number;
    percentage: number;
    itemsOrServices: ItemOrService[];
    itemsMentioned: ItemMentioned[];
}

export interface TobaccoEntry {
    entry: string;
    marks: { markID?: string; markName: string };
    notes: {
        noteNum: number;
        totalWeight: number;
        barrelWeight: number;
        tobaccoWeight: number;
    }[];
    money: {
        moneyType: string;
        tobaccoAmount: number;
        rateForTobacco: PoundsShillingPence;
        casksInTransaction: number;
        tobaccoSold: PoundsShillingPence;
        casksSoldForEach: PoundsShillingPence;
    }[];
    tobaccoShaved: number;
}

export interface RegularEntry {
    entry: string;
    tobaccoMarks: { markID?: string; markName: string }[];
    itemsMentioned: ItemMentioned[];
}

export interface Entry {
    accountHolder: AccountHolder;
    meta: MetaInformation;
    dateInfo: DateInfo;
    folioRefs: string[];
    ledgerRefs: string[];
    itemEntries: ItemEntry[] | null;
    tobaccoEntry: TobaccoEntry | null;
    regularEntry: RegularEntry | null;
    people: { name: string; id?: string }[];
    places: { name: string; id?: string }[];
    entry: string;
    money: {
        commodity: string;
        colony: string;
        quantity: string;
        currency: PoundsShillingPence;
        sterling: PoundsShillingPence;
    };
}
