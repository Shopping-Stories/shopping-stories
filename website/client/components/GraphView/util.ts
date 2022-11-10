// import { GKey, NodeInfo } from "@components/GraphView/GraphTypes";
import { PaletteMode } from "@mui/material";

const getSrc = (t:string, mode: PaletteMode) => {
    switch (mode) {
        case 'light': {
            switch (t) {
                case 'PersonObject':
                    return '/SVG/person_black_24dp.svg';
                case 'ItemEntryObject':
                    return '/SVG/shopping_basket_black_24dp.svg';
                case 'ItemOrServiceObject':
                    return '/SVG/shopping_basket_black_24dp.svg';
                case 'MentionedItemsObject':
                    return '/SVG/shopping_basket_black_24dp.svg';
                case 'RegularEntryObject':
                    return '/SVG/history_edu_black_24dp.svg';
                case 'TobaccoEntryObject':
                    return '/SVG/history_edu_black_24dp.svg';
                case 'MetaObject':
                    return '/SVG/history_edu_black_24dp.svg';
                case 'PlaceObject':
                    return '/SVG/place_black_24dp.svg';
                case 'AccHolderObject':
                    return '/SVG/storefront_black_24dp.svg';
                case 'TobaccoMarkObject':
                    return '/SVG/note_black_24dp.svg';
                case 'NoteObject':
                    return '/SVG/sticky_note_2_black_24dp.svg';
                default:
                    return '/SVG/help_black_24dp.svg';
            }
        }
        case 'dark': {
            switch (t) {
                case 'PersonObject':
                    return '/SVG/person_white_24dp.svg';
                case 'ItemEntryObject':
                    return '/SVG/shopping_basket_white_24dp.svg';
                case 'ItemOrServiceObject':
                    return '/SVG/shopping_basket_white_24dp.svg';
                case 'MentionedItemsObject':
                    return '/SVG/shopping_basket_white_24dp.svg';
                case 'RegularEntryObject':
                    return '/SVG/history_edu_white_24dp.svg';
                case 'TobaccoEntryObject':
                    return '/SVG/history_edu_white_24dp.svg';
                case 'MetaObject':
                    return '/SVG/history_edu_white_24dp.svg';
                case 'PlaceObject':
                    return '/SVG/place_white_24dp.svg';
                case 'AccHolderObject':
                    return '/SVG/storefront_white_24dp.svg';
                case 'TobaccoMarkObject':
                    return '/SVG/note_white_24dp.svg';
                case 'NoteObject':
                    return '/SVG/sticky_note_2_white_24dp.svg';
                default:
                    return '/SVG/help_white_24dp.svg';
            }
        }
    }
}
export const getSVGIcon = (t: string, mode: PaletteMode) => {
    // const nodeIcons = {
    const img = new Image()
    img.src = getSrc(t, mode)
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