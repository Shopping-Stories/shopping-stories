// import { GKey, NodeInfo } from "@components/GraphView/GraphTypes";
import { PaletteMode } from "@mui/material";

import { Entry } from "../../../new_types/api_types";
// import { NodeInfo } from "@components/GraphView/GraphTypes";

const getNodeSrc = (t:string, mode: PaletteMode) => {
    switch (mode) {
        case 'light': {
            switch (t) {
                case 'Person':
                    return '/SVG/person_black_24dp.svg'
                case 'PersonAccount':
                    return '/SVG/person_black_24dp.svg'
                case 'Item':
                    return '/SVG/shopping_basket_black_24dp.svg'
                case 'Store':
                    return '/SVG/storefront_black_24dp.svg'
                default:
                    return '/SVG/help_black_24dp.svg'
            }
        }
        default: {
            switch (t) {
                case 'Person':
                    return '/SVG/person_white_24dp.svg'
                case 'PersonAccount':
                    return '/SVG/person_white_24dp.svg'
                case 'Item':
                    return '/SVG/shopping_basket_white_24dp.svg'
                case 'Store':
                    return '/SVG/storefront_white_24dp.svg'
                default:
                    return '/SVG/help_white_24dp.svg'
            }
        }
    }
}

type EKey = keyof Entry;

export const getNodeInfo = (nodeType:string):EKey => {
    switch (nodeType) {
        case "Item":
            return "item"
        case "PersonAccount":
            return "account_name"
        case "Store":
            return "store_owner"
        case "Mention":
            return "mentions"
        default:
            return "_id"
    }
}
const ledger = ["ledger", "date", "Date Year", "_Month", "Day", "liber_book",]
const base = [...ledger, "context", "phrases", "mentions"]
const item = [
    "store_owner",
    "item", "itemID", "amount", "amount_is_combo",
    "Quantity", "Commodity", "type",
    "price", "price_is_combo",
    "currency", "currency_type", "sterling",
    "currency_totaling_contextless", "commodity_totaling_contextless",
    "debit_or_credit"
]
const person = ["people", "peopleID"]
const personAcct = ["account_name", "accountHolderID" ]

export const getLinkInfo = (linkType:string, ):string[] =>  {

    switch (linkType) {
        case "Item-PersonAccount":
            return [...base, ...item, ...personAcct]
        case "Item-Person":
            return [...base, ...person, ...person]
        case "Item-Store":
            return [...base, ...item, ...personAcct]
        case "Person-PersonAccount":
            return [...base, ...person, ...personAcct]
        case "Mention-PersonAccount":
            return base
        default:
            return []
    }
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