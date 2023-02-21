
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

export interface TobaccoMark {
    mark_number?: string;
    mark_text?: string;
}

export interface TobaccoEntry {
    number?: string;
    gross_weight?: string;
    tare_weight?: string;
    weight?: string;
}

export interface Entry {
    amount?: string;
    amount_is_combo?: boolean;
    tobacco_location?: string;
    tobacco_amount_off?: string;
    item?: string;
    price?: string;
    text_as_parsed?: string;
    original_entry?: string;
    price_is_combo?: boolean;
    phrases?: any;
    date?: string;
    currency_colony?: string;
    currency?: Currency;
    sterling?: Currency;
    ledger?: Ledger;
    folio_reference?: string;
    Marginalia?: string;
    store?: string;
    currency_type?: string;
    currency_totaling_contextless?: boolean;
    commodity_totaling_contextless?: boolean;
    account_name?: string;
    store_owner?: string;
    date_year?: string;
    month?: string;
    Day?: string;
    debit_or_credit?: string;
    context?: Array<Array<string>>;
    tobacco_marks?: Array<TobaccoMark>;
    tobacco_entries?: Array<TobaccoEntry>;
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
    phrases?: Array<Object>
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
    currency_colony?: string
    currency_totaling_contextless?: boolean
    commodity_totaling_contextless?: boolean
    account_name?: string
    reel?: number
    store?: string
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
    folio_reference?: string
    text_as_parsed?: string
    original_entry?: string
    tobacco_marks?: Array<TobaccoMark>
    tobacco_location?: string
    tobacco_amount_off?: string
    tobacco_entries?: Array<TobaccoEntry>
}
export type ParserOutputKey = keyof ParserOutput 

export const ParserOutputKeys = ["errors", "error_context", "context", "text_as_parsed", "original_entry", "store", "debit_or_credit", "account_name", "amount", "amount_is_combo", "item", "price", "type", "liber_book",  "price_is_combo", "phrases", "date", "pounds_ster", "shillings_ster", "pennies_ster", "farthings_ster", "pounds", "shillings", "pennies", "farthings", "currency_type", "currency_colony", "currency_totaling_contextless", "commodity_totaling_contextless", "tobacco_location", "tobacco_entries", "tobacco_marks", "tobacco_amount_off",  "Marginalia", "store_owner", "reel", "folio_reference", "folio_year", "folio_page", "entry_id", "Date Year", "_Month", "Day", "Quantity", "Commodity", "people", "mentions"] as Array<ParserOutputKey>

export const ParserStringKeys = new Set<ParserOutputKey>(["amount", "currency_colony", "item", "price", "tobacco_amount_off", "date", "Marginalia", "account_name", "store_owner", "folio_reference", "folio_year", "entry_id", "Date Year", "_Month", "Day", "tobacco_location", "debit_or_credit", "Quantity", "Commodity", "type", "liber_book", "store"] as Array<ParserOutputKey>)
export const ParserStringArrayKeys = new Set<ParserOutputKey>(["errors", "people", "mentions"] as Array<ParserOutputKey>)
export const ParserBooleanKeys = new Set<ParserOutputKey>(["amount_is_combo", "price_is_combo", "currency_totaling_contextless", "commodity_totaling_contextless"] as Array<ParserOutputKey>)
export const ParserNumberKeys = new Set<ParserOutputKey>(["pounds", "pounds_ster", "shillings", "shillings_ster", "pennies", "pennies_ster", "farthings", "farthings_ster", "reel", "folio_page"] as Array<ParserOutputKey>)


// Function to convert tobacco mark to string for editing purposes
export const tmToStr = (tms: Array<TobaccoMark>) => {
    let str: string = ""
    tms.map((value) => {
        str += value.mark_number
        str += " "
        str += value.mark_text
        str += ", "
    })

    return str
}  

// Converts the string from tmToStr back to a tobacco mark
export const tmStrToTMs = (tmstr: string) => {
    let splitTMs = tmstr.split(", ")
    let len = splitTMs.length
    if (splitTMs[splitTMs.length - 1] == "") {
        len -= 1
    }
    let tmArr: Array<TobaccoMark> = new Array(len)
    
    for (let i = 0; i < len; i++) {
        let TM = splitTMs[i].split(" ")
        let TMMap: TobaccoMark = {}
        TMMap.mark_number = TM[0]
        TMMap.mark_text = TM[1]
        tmArr[i] = TMMap
    }
    
    return tmArr
}

// Parses a string into an array of strings with delimiter "; "
export const parseStringArray = (str: string) => {
    let strsplit = str.split(",; ")
    let len = strsplit.length
    if (strsplit[strsplit.length - 1] == "") {
        len -= 1
    }
    let strArr: Array<string> = new Array(len)
    
    for (let i = 0; i < len; i++) {
        strArr[i] = strsplit[i]
    }
    
    return strArr
}