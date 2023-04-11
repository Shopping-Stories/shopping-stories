import { GridRowModel } from "@mui/x-data-grid";
import {
    Entry,
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

// Utils and types for processing non-parser format Entries

export const entryToRow = (entry: Entry):GridRowModel => {
    const nonComplex: Partial<Entry> = Object.fromEntries(Object.entries(entry)
        .filter(([k, v]) => !!v && (hiddenFields.has(k as HiddenField) || visibleFields.has(k as VisibleField))))
        // .map(e => e))
    // console.log(nonComplex)
    let currency = entry.currency ? getEntries(entry.currency) : []
    let sterling = []
    let ledger = entry.ledger ? getEntries(entry.ledger) : []
    if (entry.sterling){
        for (let denom of currency){
            sterling.push([`Sterling_${denom[0]}`, entry.sterling[denom[0]]])
        }
    }
    
    const complex = [
        ['Item', toTitleCase((entry?.item ?? ""))],
        ['Currency', moneyToString(entry?.currency?.pounds, entry?.currency?.shillings, entry?.currency?.pennies, entry?.currency?.farthings)],
        ['Sterling', moneyToString(entry?.sterling?.pounds, entry?.sterling?.shillings, entry?.sterling?.pennies, entry?.sterling?.farthings)],
        ['Date', (entry?.Day ?? "") + " " + (entry?.month == undefined ? "" : months[parseInt(entry?.month) - 1]) + " " + entry?.date_year],
        ['Page', entry?.ledger?.folio_page],
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

export type ExcludedField = Extract<EntryKey, EntryStringArrayKey  | EntryBooleanKey | EntryObjKey>//'currency' | 'sterling'>
export type VisibleField = Extract<EntryKey,
    'account_name'| 'amount'| 'Quantity'| 'item'| 'Commodity' | 'store'| 'store_owner'
    >

export type HiddenField = Exclude<EntryKey, VisibleField | ExcludedField>
export type IncludedField = Extract<EntryKey, VisibleField | HiddenField >
export type FieldNames = {
    [k in IncludedField]: string;
};

export const excludedFields = new Set<ExcludedParsedField>([
    ...EntryBooleanKeys.values(),
    ...EntryStringArrayKeys.values(),
    // ...['ledger', 'tobacco_entries'],
    ...EntryObjKeys.values()
] as ExcludedParsedField[])

export const visibleFields = new Set<VisibleField>([
    'account_name', 'amount', 'Quantity', 'item', 'Commodity', 'store', 'store_owner',
]);

// export const splitFields = new Set<CurrencyKey>(['pounds', 'shilling', 'pennies', 'farthings'] as Array<CurrencyKey>)

export const hiddenFields = new Set<HiddenField>(EntryKeys
    .filter(k => !excludedFields.has(k as ExcludedParsedField) && !visibleFields.has(k as VisibleField)
    ) as HiddenField[])

export const fieldNames: FieldNames = Object.fromEntries(EntryKeys
    .filter(k=>!excludedFields.has(k as ExcludedParsedField))
    .map(k => [k as IncludedField, k !== 'debit_or_credit' ? toDisplayCase(k as string) : 'Dr/Cr'])
) as FieldNames

export const complexFields = new Set<string>(['Date', 'Page', 'Currency', 'Sterling', ])
export const splitFields = new Set<string>([
    'pounds', 'shillings', 'pennies', 'farthings',
    'Sterling_pounds', 'Sterling_shillings', 'Sterling_pennies', 'Sterling_farthings',
    'reel', 'folio_year', 'folio_page', 'entry_id'
])
export const colNames: string[] = [...complexFields.values(), ...hiddenFields.values(), ...visibleFields.values(), ...splitFields.values()]

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

// const r = /(ObjectId\(')|('\))|('),|{(')|(')}|\s(')|('):/g
const sq = /'/g
const singleQuote = /':/g
const spaceQ = /\s'/g
const obReg = /ObjectId\('|'\)/g
// const rParen = /'\)/g
const oBracketQ = /{'/g
const cBracketQ = /'}/g
const commaQ = /',/g

export interface PersonObject {
    _id: string,
    name: string,
    related: Array<string>
}

export interface ItemObject {
    _id?: string
    item?: string
    related?: Array<string>
    archMat?: number
    category?: string
    subcategory?: string
}

export const parsePeople = (ppl:string):PersonObject[] => {
    ppl = ppl.replace(obReg, '"')
        .replace(singleQuote, '":')
        .replace(spaceQ, ' "')
        .replace(oBracketQ, '{"')
        .replace(cBracketQ, '"}')
        .replace(commaQ, '",')
            // .replace(rParen, '"')
    try {
        let pArr: PersonObject[] = JSON.parse(ppl)
        return pArr
    } catch (e:any) {
        // alert(e)
        console.log(e?.message)
        console.log(ppl)
        return []
    }
    // return pArr
}

// export const parsePeople = (ppl:string) => {
//     ppl = ppl.replace(obReg, '"').replace(rParen, '"').replace(singleQuote, '"')
//     let pObj: PersonObject[] = JSON.parse(ppl)
// }

export const parseItem = (item:string): ItemObject[] => {
    item = item.replace(obReg, '"')
        .replace(singleQuote, '":')
        .replace(spaceQ, ' "')
        .replace(oBracketQ, '{"')
        .replace(cBracketQ, '"}')
        .replace(commaQ, '",')
    try {
        let itemArr: ItemObject[] = JSON.parse(item)
        return itemArr
    } catch (e:any) {
        // alert(e)
        console.log(e?.message)
        console.log(item)
        return []
    }
}



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