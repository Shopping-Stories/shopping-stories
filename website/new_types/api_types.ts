
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

export interface ParserOutput {
    errors?: Array<string>
    error_context?: Array<Array<string | Array<string>>>
    amount?: string
    amount_is_combo?: boolean
    item?: string
    price?: string
    price_is_combo?: boolean
    phrases?: Array<Map<string, string | Array<string>>>
    date?: string
    pounds?: number
    pounds_ster?: number
    shillings?: number
    shillings_ster?: number
    pennies_ster?: number
    pennies?: number
    farthings_ster?: number
    Marginalia?: string
    farthings?: number
    currency_type?: string
    currency_totaling_contextless?: boolean
    commodity_totaling_contextless?: boolean
    account_name?: string
    reel?: number
    store_owner?: string
    folio_year?: string
    folio_page?: number
    entry_id?: string
    "Date Year"?: string
    "_Month": string
    Day?: string
    debit_or_credit?: string
    context?: Array<Array<string>>
    Quantity?: string
    Commodity?: string
    people?: Array<string>
    type?: string
    liber_book?: string
    mentions?: Array<string>
}
export type ParserOutputKey = keyof ParserOutput 

export const ParserOutputKeys = ["errors", "error_context", "context", "debit_or_credit", "account_name", "amount", "amount_is_combo", "item", "price", "type", "liber_book",  "price_is_combo", "phrases", "date", "pounds_ster", "shillings_ster", "pennies_ster", "farthings_ster", "pounds", "shillings", "pennies", "farthings", "currency_type", "currency_totaling_contextless", "commodity_totaling_contextless", "Marginalia", "store_owner", "reel", "folio_year", "folio_page", "entry_id", "Date Year", "_Month", "Day", "Quantity", "Commodity", "people", "mentions"] as Array<ParserOutputKey>

export const ParserStringKeys = new Set<ParserOutputKey>(["amount", "item", "price", "date", "Marginalia", "account_name", "store_owner", "folio_year", "entry_id", "Date Year", "_Month", "Day", "debit_or_credit", "Quantity", "Commodity", "type", "liber_book"] as Array<ParserOutputKey>)
export const ParserStringArrayKeys = new Set<ParserOutputKey>(["errors", "people", "mentions"] as Array<ParserOutputKey>)
export const ParserBooleanKeys = new Set<ParserOutputKey>(["amount_is_combo", "price_is_combo", "currency_totaling_contextless", "commodity_totaling_contextless"] as Array<ParserOutputKey>)
export const ParserNumberKeys = new Set<ParserOutputKey>(["pounds", "pounds_ster", "shillings", "shillings_ster", "pennies", "pennies_ster", "farthings", "farthings_ster", "reel", "folio_page"] as Array<ParserOutputKey>)