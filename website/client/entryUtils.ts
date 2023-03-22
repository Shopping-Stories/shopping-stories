import {
    Entry, Currency,
    EntryBooleanKey,
    EntryBooleanKeys,
    EntryKey, EntryKeys,
    EntryObjKey, EntryObjKeys,
    EntryStringArrayKey,
    EntryStringArrayKeys, ParserOutput, ParserOutputKey, ParserOutputKeys
} from "../new_types/api_types";

export const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export const toDisplayCase = (k:string) => {
    // console.log(k)
    // console.log(k.replace(/(_|^)([^_]?)/g, function(_, prep, letter) {
    //     return (prep && ' ') + letter.toUpperCase();
    // }))
    return k.replace(/(_|^)([^_]?)/g, function(_, prep, letter) {
        return (prep && ' ') + letter.toUpperCase();
    });
}

export function getFarthInsert(farthings: number|undefined) {
    let farthInsert = "";
    if (farthings != undefined && farthings != 0) {
        farthInsert = "." + (farthings/12).toString().replace("0.", "");
    }
    return farthInsert;
}

export function moneyToString(pounds: number|undefined, shillings: number|undefined, pence: number|undefined, farthings: number|undefined) {
    if (pence == undefined) {
        pence = 0;
    }
    if (pounds == undefined || pounds == 0) {
        if (shillings == undefined || shillings == 0) {
            return pence + getFarthInsert(farthings) + "d";
        }
        else {
            return shillings + "/" + pence + getFarthInsert(farthings);
        }
    }
    else {
        return "£" + pounds + "/" + shillings + "/" + pence + getFarthInsert(farthings);
    }
}

export function moneyToLongString(pounds: number|undefined, shillings: number|undefined, pence: number|undefined, farthings: number|undefined) {
    if (pence == undefined) {
        pence = 0;
    }
    if (pounds == undefined || pounds == 0) {
        if (shillings == undefined || shillings == 0) {
            return pence + getFarthInsert(farthings) + " d";
        }
        else {
            return shillings + " shillings, " + pence + getFarthInsert(farthings) + " d";
        }
    }
    else {
        return pounds + " pounds, " + shillings + " shillings, " + pence + getFarthInsert(farthings) + " d";
    }
}

export function dateToString(year: string|undefined, month: string|undefined, day: string|undefined) {
    if (year == undefined) {
        return ""
    }
    else {
        if (month == undefined) {
            return year
        }
        else {
            if (day == undefined) {
                return months[parseInt(month) - 1] + " " + year
            }
            else {
                return months[parseInt(month) - 1] + " " + day + " " + year
            }
        }
    }
}

export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];
const getEntries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>;

const currencyModel: Currency = {
    pounds: 0,
    shillings: 12,
    pennies: 6,
    farthings: 0
}

// Utils and types for processing non-parser format Entries
export const entryToRow = (entry: Entry) => {
    const nonComplex: Partial<Entry> = Object.fromEntries(Object.entries(entry)
        .filter(([k, v]) => !!v && (hiddenFields.has(k as HiddenField) || simpleFields.has(k as SimpleField))))
        // .map(e => e))
    // console.log(nonComplex)
    let currency = entry.currency ? getEntries(entry.currency) : []
    // console.log(currency)
    let sterling = []
    let ledger = entry.ledger ? getEntries(entry.ledger) : []
    if (!!entry.sterling){
        for (let denom of getEntries(currencyModel)){
            let sD = [`Sterling_${denom[0]}`, `${entry.sterling[denom[0]]}`]
            // console.log(sD)
            sterling.push(sD)
        }
    }
    // console.log(sterling)
    let q = !!entry.Quantity
    let c = !!entry.Commodity
    const complex = [
        ['Date', (entry?.Day ?? "") + " " + (entry?.month == undefined ? "" : months[parseInt(entry?.month) - 1]) + " " + entry?.date_year],
        ['Page', entry?.ledger?.folio_page],
        ['Item', toTitleCase((entry?.item ?? ""))],
        ['Qty/Cmdty', q && c ? `${entry.Quantity} (pounds) ${entry.Commodity}` : q ? entry.Quantity : c ? entry.Commodity : ''],
        ['Currency', moneyToString(entry?.currency?.pounds, entry?.currency?.shillings, entry?.currency?.pennies, entry?.currency?.farthings)],
        ['Sterling', moneyToString(entry?.sterling?.pounds, entry?.sterling?.shillings, entry?.sterling?.pennies, entry?.sterling?.farthings)],
        ['id', entry._id]
    ]

    // console.log(currency);
    // console.log(sterling);
    return {
        ...Object.fromEntries(complex),
        ...Object.fromEntries(currency),
        ...Object.fromEntries(sterling),
        ...Object.fromEntries(ledger),
        ...nonComplex }// Object.fromEntries(complex)
}

// These fields will not show up in datagrid display or csv exports
export type ExcludedField = Extract<EntryKey, EntryStringArrayKey  | EntryBooleanKey | EntryObjKey>//'currency' | 'sterling'>

// Fields that show up in datagrid display and csv export
export type SimpleField = Extract<EntryKey, 'account_name'| 'amount'| 'item' | 'store'| 'store_owner'>

// Fields that show up in csv export but not datagrid display
export type HiddenField = Exclude<EntryKey, SimpleField | ExcludedField>

// All fields included in csv export
export type IncludedField = Extract<EntryKey, SimpleField | HiddenField >

export const excludedFields = new Set<ExcludedField>([
    ...EntryBooleanKeys.values(),
    ...EntryStringArrayKeys.values(),
    ...EntryObjKeys.values()
    // ...['ledger', 'tobacco_entries'],
] as ExcludedField[])

export const simpleFields = new Set<SimpleField>(['account_name', 'amount', 'item', 'store', 'store_owner',]);

export const hiddenFields = new Set<HiddenField>(EntryKeys
    .filter(k => !excludedFields.has(k as ExcludedField) && !simpleFields.has(k as SimpleField)
    ) as HiddenField[])

export type FieldNames = { [k in IncludedField]: string; };

// Maps entry field names to how they should display in datagrid (csv display is unchanged)
export const fieldNames: FieldNames = Object.fromEntries(EntryKeys
    .filter(k=>!excludedFields.has(k as ExcludedField))
    .map(k => [k as IncludedField, k !== 'debit_or_credit' ? toDisplayCase(k as string) : 'Dr/Cr'])
) as FieldNames

// These fields exist in an entry object but their display must be processed somehow
export const complexFields = new Set<string>(['Date', 'Page', 'Quantity','Currency', 'Sterling'])

// These are fields required for processing for datagrid header/value formatting that should still be exported to csv.
// Note: not necessarily one-to-one with 'complexFields'
export const splitFields = new Set<string>([
    'Quantity', 'Commodity',
    'pounds', 'shillings', 'pennies', 'farthings',
    'Sterling_pounds', 'Sterling_shillings', 'Sterling_pennies', 'Sterling_farthings',
    'reel', 'folio_year', 'folio_page', 'entry_id'
])

// Final ordering of the visible columns
export const visibleFields = new Set<SimpleField | string>([
    'Date', 'Page',
    'Date', 'Page',
    'account_name', 'amount', 'item', 'Qty/Cmdty',
    'Currency', 'Sterling',
    'store', 'store_owner',
])

// All the fields tied to the datagrid for visibility, export, or both
export const colNames: string[] = [
    ...hiddenFields.values(),
    ...splitFields.values(),
    ...visibleFields.values()
    // ...simpleFields.values(),...complexFields.values(),
]

// Utils and types for processing non-parser format Entries

export type ExcludedParsedField = keyof Pick<ParserOutput,
    "amount_is_combo"|
    "price_is_combo"|
    "commodity_totaling_contextless"|
    "currency_totaling_contextless"|
    "errors"|
    "error_context"|
    "context"|
    "type"|
    "liber_book"|
    "phrases"|
    "mentions"
    >
export type IncludedParsedField = keyof Omit<ParserOutputKey, ExcludedParsedField>

export const noDisplay = [
    "amount_is_combo",
    "price_is_combo",
    "commodity_totaling_contextless",
    "currency_totaling_contextless",
    "errors",
    "error_context",
    "context",
    "error_context",
    "type",
    "liber_book",
    "phrases",
    "mentions"
] as Array<ExcludedParsedField>

export const excludedParsedFields = new Set<ParserOutputKey>(noDisplay)

export const moneyFields = [
    "currency_type",
    "pounds_ster",
    "shillings_ster",
    "pennies_ster",
    "pounds",
    "shillings",
    "pennies",
    // "farthings_ster",
    // "farthings",
]

export const ledgerFields = [
    "entry_id",
    "reel",
    "folio_reference",
    "folio_year",
    "folio_page",
]

export const storeInfoFields = [
    "store",
    "store_owner",
    "Marginalia"
]

export const entryInfoFields = [
    "debit_or_credit",
    "account_name",
    "Date Year",
    "_Month",
    "Day",
    // "amount_is_combo",
    // "text_as_parsed",
    // "original_entry",
    // "date",
    // "people",
]

export const itemInfoFields = [
    "item",
    "amount",
    "price",
    "Quantity",
    "Commodity",
]

export const parsedFieldNames = Object.fromEntries(
    ParserOutputKeys
        .filter(k=>!excludedParsedFields.has(k))
        .map(k => [k as IncludedParsedField, toDisplayCase(k as string)])
)

// const tobacco = [
//     "tobacco_location",
//     // "tobacco_marks",
//     // "tobacco_entries"
// ]
//
// const tobaccoEntry = [
//     "number",
//     "gross_weight",
//     "tare_weight",
//     "weight",
// ]
//
// const tobaccoMark = [
//     "mark_number",
//     "mark_text"
// ]