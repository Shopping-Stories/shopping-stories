
export interface Currency {
    pounds: number;
    shillings: number;
    pennies: number;
    farthings: number;
}

export interface Ledger {
    reel: string
    folio_year: string
    folio_page: string
    entry_id: string
}

export interface Entry {
    amount?: string;
    amount_is_combo?: boolean;
    item?: string;
    price?: string;
    price_is_combo?: boolean;
    phrases?: any;
    date?: string;
    currency?: Currency;
    sterling?: Currency;
    ledger?: Ledger;
    Marginalia?: string;
    currency_type?: string;
    currency_totaling_contextless?: boolean;
    commodity_totaling_contextless?: boolean;
    account_name?: string;
    store_owner?: string;
    "Date Year"?: string;
    "_Month"?: string;
    Day?: string;
    debit_or_credit?: string;
    context?: Array<Array<string>>;
    Quantity?: string;
    Commodity?: string;
    people?: Array<string>;
    type?: string;
    liber_book?: string;
    mentions?: Array<string>;
    itemID?: string;
    peopleID?: string;
    accountHolderID?: string;
    "_id"?: string;
}