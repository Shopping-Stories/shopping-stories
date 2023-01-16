// import { GKey, NodeInfo } from "@components/GraphView/GraphTypes";
import { PaletteMode } from "@mui/material";

import { Currency, Entry, Ledger } from "../../../new_types/api_types";
// import { NodeInfo } from "@components/GraphView/GraphTypes";

const getNodeSrc = (t:string, mode: PaletteMode) => {
    switch (mode) {
        case 'light': {
            switch (t) {
                case 'person':
                    return '/SVG/person_black_24dp.svg'
                case 'personAccount':
                    return '/SVG/person_black_24dp.svg'
                case 'item':
                    return '/SVG/shopping_basket_black_24dp.svg'
                case 'store':
                    return '/SVG/storefront_black_24dp.svg'
                default:
                    return '/SVG/help_black_24dp.svg'
            }
        }
        case 'dark': {
            switch (t) {
                case 'person':
                    return '/SVG/person_white_24dp.svg'
                case 'personAccount':
                    return '/SVG/person_white_24dp.svg'
                case 'item':
                    return '/SVG/shopping_basket_white_24dp.svg'
                case 'store':
                    return '/SVG/storefront_white_24dp.svg'
                default:
                    return '/SVG/help_white_24dp.svg'
            }
        }
    }
}

type EKey = keyof Entry;

export const getNodeType = (nodeType:string):EKey => {
    switch (nodeType) {
        case "item":
            return "item"
        case "personAccount":
            return "account_name"
        case "store":
            return "store_owner"
        case "mention":
            return "mentions"
        default:
            return "_id"
    }
}

export const getNodeInfo = (entry:Entry, t:EKey) => {

}

type LedgerKeys = Pick<Entry, "ledger"| "date"| "Date Year"| "_Month"| "Day"| "liber_book">
type BaseKeys = Pick<Entry, keyof LedgerKeys | "context"| "phrases"| "mentions">
type ItemKeys = Pick<Entry, "store_owner"|
    "item"| "itemID"| "amount"| "amount_is_combo"|
    "Quantity"| "Commodity"| "type"|
    "price"| "price_is_combo"|
    "currency"| "currency_type"| "sterling"|
    "currency_totaling_contextless"| "commodity_totaling_contextless"|
    "debit_or_credit"
    >
type Person = Pick<Entry, "people" | "peopleID">
type PersonAccount = Pick<Entry, "account_name" | "accountHolderID">
type NodeInfo = Pick<Entry, "item" | "account_name" | "store_owner" | "mentions" | "_id" | keyof BaseKeys | keyof ItemKeys | keyof Person | keyof PersonAccount>

const ledgerKeys: EKey[]  = ["ledger", "date", "Date Year", "_Month", "Day", "liber_book"]
const base: EKey[] = [...ledgerKeys, "context", "phrases", "mentions"]
const item: EKey[] = [
    "store_owner",
    "item", "itemID", "amount", "amount_is_combo",
    "Quantity", "Commodity", "type",
    "price", "price_is_combo",
    "currency", "currency_type", "sterling",
    "currency_totaling_contextless", "commodity_totaling_contextless",
    "debit_or_credit"
]
const person: EKey[] = ["people", "peopleID"]
const personAcct: EKey[] = ["account_name", "accountHolderID" ]

export const getNodeKeys = (nodeType:string): EKey[] => ledgerKeys //[...ledgerKeys, getNodeType(nodeType)]

export const getLinkKeys = (linkType:string, ):EKey[] =>  {

    switch (linkType) {
        case "item_personAccount":
            return [...base, ...item, ...personAcct]
        case "item_person":
            return [...base, ...person, ...person]
        case "item_store":
            return [...base, ...item, ...personAcct]
        case "person_personAccount":
            return [...base, ...person, ...personAcct]
        case "mention_personAccount":
            return base
        default:
            return []
    }
}
export type EntryInfo = Omit<Partial<Currency> & Partial<Ledger> & Entry, "ledger" | "currency">
export const filterEntry = (e:Entry, keys:EKey[]):EntryInfo => {
    let entryInfo: EntryInfo = {}
    for (let key of keys){
        if (key === "ledger" || key === "currency"){
            for (let [k, v] of Object.entries(e[key as keyof Entry])){
                entryInfo[k as keyof EntryInfo] = v
            }
        }
        else {
            entryInfo[key] = e[key]
        }
    }
    return entryInfo
}

export const makeLinkSnake = (x:string, y:string):string[] => {
    let arr = [x, y].sort();
    return [...arr, `${arr[0]}_${arr[1]}`]
}

export const setNodeSVGIcon = (t: string, mode: PaletteMode) => {
    const img = new Image()
    img.src = getNodeSrc(t, mode)
    return img
};

export const setLinkSVGIcon = (t: string) => {
    // const nodeIcons = {
    const img = new Image()
    // img.src = getLinkSrc(t)
    return img
    // AccountHolderObject:
};

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