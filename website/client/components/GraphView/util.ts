// import { GKey, NodeInfo } from "@components/GraphView/GraphTypes";
import { PaletteMode } from "@mui/material";

import { Currency, Entry, Ledger } from "../../../new_types/api_types";
// import { NodeInfo } from "@components/GraphView/GraphTypes";
export interface NodeTypes {
    person: EntryKey
    item: EntryKey
    personAccount: EntryKey
    store:  EntryKey
    help:  EntryKey
    mention: EntryKey
}

export interface LinkTypes {
    item_personAccount: EntryKey
    item_person: EntryKey
    item_store: EntryKey
    item_mention: EntryKey
    person_personAccount: EntryKey,
    mention_personAccount: EntryKey
}

export type NodeTypeKey = keyof NodeTypes
export type LinkTypeKey = keyof LinkTypes
export type GraphTypeKey = NodeTypeKey | LinkTypeKey

type NodeIcons = { [key in NodeTypeKey] : string }
type LinkTypeDict = { [key in LinkTypeKey] : "inherit" | "disabled" | "action" | "primary" | "secondary" | "error" | "info" | "success" | "warning" }

interface SvgIcons {
    light: NodeIcons
    dark: NodeIcons
}

export const linkColors: LinkTypeDict = {
    item_personAccount: "success",
    item_person: "success",
    item_store: "warning",
    item_mention: "info",
    person_personAccount: "error",
    mention_personAccount: "secondary"
}

const svgIconMap: SvgIcons = {
    light: {
        person: '/SVG/person_black_24dp.svg',
        item: '/SVG/shopping_basket_black_24dp.svg',
        personAccount: '/SVG/person_black_24dp.svg',
        store: '/SVG/storefront_black_24dp.svg',
        mention: '/SVG/record_voice_over_black_24dp.svg',
        help: '/SVG/help_black_24dp.svg'
    },
    dark: {
        person: '/SVG/person_white_24dp.svg',
        item: '/SVG/shopping_basket_white_24dp.svg',
        personAccount: '/SVG/person_white_24dp.svg',
        store: '/SVG/storefront_white_24dp.svg',
        mention: '/SVG/record_voice_over_white_24dp.svg',
        help: '/SVG/help_white_24dp.svg'
    }
}


const getNodeSrc = (t:string, mode: PaletteMode) => {
    if (!mode || !svgIconMap[mode as keyof SvgIcons][t as keyof NodeIcons]){
        return svgIconMap.light.help
    }
    return svgIconMap[mode as keyof SvgIcons][t as keyof NodeTypes]
}

export const setNodeSVGIcon = (t: string, mode: PaletteMode) => {
    const img = new Image()
    img.src = getNodeSrc(t, mode)
    return img
};

type EntryKey = keyof Entry;

const nodeTypeMap: NodeTypes = {
    item: "item",
    person: "peopleID",
    personAccount: "account_name",
    store: "store",
    mention: "mentions",
    help: "_id"
}

export const getNodeType = (nodeType:string):EntryKey => {
    if (!nodeTypeMap[nodeType as keyof NodeTypes]){
        return "_id"
    }
    else return nodeTypeMap[nodeType as keyof NodeTypes]
}

// export const getNodeInfo = (entry:Entry, t:EKey) => {
//
// }

type LedgerKeys = Pick<Entry, "ledger"| "date"| "date_year"| "month"| "Day"| "liber_book">

export const getNodeKeys = (nodeType:string): EntryKey[] => {
    if (nodeType === "adfas") console.log(nodeType)
    return ledgerKeys;
} //[...ledgerKeys, getNodeType(nodeType)]

export const getInfoKeys = (graphType: GraphTypeKey):EntryKey[] =>  {
    switch (graphType) {
        case "item_personAccount":
            return item_personAccount
        case "item_person":
            return item_person
        case "item_store":
            return item_store
        case "person_personAccount":
            return person_personAccount
        case "mention_personAccount":
            return base
        default:
            return ledgerKeys
    }
}

const ledgerKeys: EntryKey[]  = ["ledger", "date", "date_year", "month", "Day", "liber_book"]
const base: EntryKey[] = [...ledgerKeys, "context", "phrases", "mentions"]
const item: (keyof ItemEdgeKeys)[] = [
    "store_owner", "type",
    "item", "itemID", "amount", "amount_is_combo",
    "Quantity", "Commodity",
    "price", "price_is_combo",
    "currency", "currency_type", "sterling",
    "currency_totaling_contextless", "commodity_totaling_contextless",
    "debit_or_credit"
]

const person: EntryKey[] = ["people", "peopleID"]
const personAcct: EntryKey[] = ['account_name', 'accountHolderID'];
const item_personAccount = [...base, ...item, ...personAcct]
const item_person = [...base, ...person, ...item]
const item_store = [...base, ...item, ...personAcct]
const person_personAccount = [...base, ...person, ...personAcct]

const entryComplex = new Set<EntryKey>(["currency" , "ledger" , "sterling" , "mentions" , "people" ,"context" ,"phrases"])
type EntryNonInfo = Omit<Entry,
    "itemID" | "amount_is_combo" | "price_is_combo" |
    "commodity_totaling_contextless" | "currency_totaling_contextless" |
    "peopleID" | "accountHolderID"
    | "_id"
    >
// itemID: "Item ID",
// amount_is_combo: boolean,
// price_is_combo: boolean,
// phrases: any,
// currency_totaling_contextless: boolean,
// commodity_totaling_contextless: boolean,
// peopleID: "",
// accountHolderID: string,
// _id: string,
export type EntryScalarInfo = Omit<Entry,
    "currency" | "ledger" | "sterling" | "mentions" | "people" |"context" |"phrases" | keyof EntryNonInfo
    >
// type FullEntryInfo = Currency | Ledger | EntryScalarInfo

interface EntryObjects {
    ledger?: Ledger,
    currency?: Currency,
    sterling?: Currency,
}

export interface EntryInfo extends EntryScalarInfo{
    ledger?: Partial<Ledger>
    currency?: Partial<Currency>,
    sterling?: Partial<Currency>,
    people?: Entry["peopleID"],
    mentions?: Entry["mentions"],
    context?: Entry["context"],
    phrases?: Entry["phrases"],
    scalars?: EntryScalarInfo
}

export const makeEntryInfo = (e:Entry, t:(NodeTypeKey | LinkTypeKey)):EntryInfo => {
    let keys: EntryKey[] = getInfoKeys(t)
    let scalarInfo: EntryScalarInfo = {}
    let entryInfo: EntryInfo = {}
    
    // console.log(keys)
    for (let key of keys){
        if (!!displayNames[key as keyof typeof displayNames]) {
            if (!entryComplex.has(key)) {
                scalarInfo[key as keyof typeof scalarInfo] = e[key]
            } else if (!!e[key]) {
                entryInfo[key as keyof typeof entryInfo] = e[key]
            }
        } else if (!!e[key]) {
            entryInfo[key as keyof typeof entryInfo] = e[key]
        }
    }
    entryInfo.scalars = scalarInfo
    entryInfo._id = e._id
    return entryInfo
}
export type Display = {
    [key in keyof (EntryScalarInfo & Currency & Ledger & EntryObjects)]: string
}

// type InfoKey = keyof EntryScalarInfo & Currency & Ledger & EntryObjects

export const displayNames = {
    amount: "Amount",
    item: "Item",
    price: "Price",
    date: "Date",
    Marginalia: "Marginalia",
    currency_type: "Currency Type",
    account_name: "Account Name",
    store_owner: "Store Owner",
    date_year: "date_year",
    month: "Month",
    Day: "Day",
    debit_or_credit: "Payment",
    Quantity: "Quantity",
    Commodity: "Commodity",
    type: "Type",
    liber_book: "Liber Book",
    pounds: "Pounds",
    shillings: "Shillings",
    pennies: "Pennies",
    farthings: "Farthings",
    reel: "Reel",
    folio_year: "Folio Year",
    folio_page: "Folio Page",
    entry_id: "Entry ID",
    ledger: "Ledger Information",
    currency: "Currency Information",
    sterling: "Sterling Information",
    // itemID: "Item ID",
    // amount_is_combo: boolean,
    // price_is_combo: boolean,
    // phrases: any,
    // currency_totaling_contextless: boolean,
    // commodity_totaling_contextless: boolean,
    // peopleID: "",
    // accountHolderID: string,
    // _id: string,
}

const itemPersonAccount = new Set<NodeTypeKey>(["item", "personAccount"])
const itemPerson = new Set<NodeTypeKey>(["item", "person"])
const itemStore = new Set<NodeTypeKey>(["item", "store"])
const personPersonAccount = new Set<NodeTypeKey>(["person", "personAccount"])
const mentionPersonAccount = new Set<NodeTypeKey>(["mention", "personAccount"])
// const itemMention = new Set<NodeTypeKey>(["mention", "personAccount"])

export const makeLinkSnake = (x: NodeTypeKey, y: NodeTypeKey):[NodeTypeKey, NodeTypeKey, LinkTypeKey] =>  {
    if (itemPersonAccount.has(x) && itemPersonAccount.has(y)) return [x, y, "item_personAccount"]
    if (itemPerson.has(x) && itemPerson.has(y)) return [x, y, "item_person"]
    if (itemStore.has(x) && itemStore.has(y)) return [x, y, "item_store"]
    if (personPersonAccount.has(x) && personPersonAccount.has(y)) return [x, y,  "person_personAccount"]
    if (mentionPersonAccount.has(x) && mentionPersonAccount.has(y)) return [x, y,  "mention_personAccount"]
    // else linkType = "mention_personAccount"
    return [x, y, "item_mention"]
}

export const makeLinkID = (x:string, y:string):string[] => {
    let arr = [x,y].sort()
    return [arr[0], arr[1], `${arr[0]}_${arr[1]}`]
}

export type LinkInfoDisplay = {
    [key in LinkInfoKeys] : {
        displayName: string
        info: LinkInfo
    }
}

export type NodeInfoDisplay = {
    [key in NodeInfoKeys] : {
        displayName: string
        info: NodeInfo
    }
}

// type BaseNodeKeys = Pick<Entry, keyof LedgerKeys | "context"| "phrases"| "mentions">
type StoreKeys = Pick<Entry, "store_owner">
type ItemKeys = Pick<Entry, "item"| "itemID"| "type">
type Person = Pick<Entry, "people" | "peopleID">
type PersonAccount = Pick<Entry, "account_name" | "accountHolderID">
type Mention = Pick<Entry, "mentions">
type NodeInfo = Pick<Entry, keyof (ItemKeys | Person | PersonAccount | Mention | StoreKeys)>
type NodeInfoKeys = keyof NodeInfo

type BaseEdgeKeys = Pick<Entry, keyof LedgerKeys | "context"| "phrases"| "mentions">
type StoreEdgeKeys = Pick<Entry, keyof StoreKeys>
type PersonEdgeKeys = Pick<Entry, keyof Person>
type PersonAccountEdgeKeys = Pick<Entry, keyof PersonAccount>
type MentionEdgeKeys = Pick<Entry, keyof Mention>
type ItemEdgeKeys = Pick<Entry, keyof Omit<Entry, keyof (StoreEdgeKeys | PersonEdgeKeys | PersonAccountEdgeKeys | MentionEdgeKeys)>>
type LinkInfo = Pick<Entry, keyof (StoreEdgeKeys | PersonEdgeKeys | PersonAccountEdgeKeys | MentionEdgeKeys | ItemEdgeKeys | BaseEdgeKeys)>
type LinkInfoKeys = keyof LinkInfo


// export const setLinkSVGIcon = (t: string) => {
//     // const nodeIcons = {
//     const img = new Image()
//     // img.src = getLinkSrc(t)
//     return img
//     // AccountHolderObject:
// };

// const updateGInfo = (item: NodeInfo, itemID: GKey) => {
//     if (!nodeProps || !nodeProps[itemID]) {
//         let tName = `${
//             item && item.__typename ? item.__typename : 'Error'
//         }`;
//         // console.log("item for icon: ", item)
//         nodeProps[itemID] = {
//             node: item,
//             icon: getSVGIcon(tName),
//             label: itemID,
//         };
//     }
//     _updateGInfo(item, itemID)
// };