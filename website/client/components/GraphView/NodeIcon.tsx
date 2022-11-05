import PersonIcon from "@mui/icons-material/Person";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PlaceIcon from "@mui/icons-material/Place";
import StorefrontIcon from "@mui/icons-material/Storefront";
import NoteIcon from "@mui/icons-material/Note";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import HelpIcon from "@mui/icons-material/Help";

interface NodeIconProps {
    t: string;
}

const NodeIcon = ({ t }: NodeIconProps) => {
    // const nodeIcons = {
    
    switch (t) {
        case 'PersonObject':
            return <PersonIcon />;
        case 'ItemEntryObject':
            return <ShoppingBasketIcon />;
        case 'ItemOrServiceObject':
            return <ShoppingBasketIcon />;
        case 'MentionedItemsObject':
            return <ShoppingBasketIcon />;
        case 'RegularEntryObject':
            return <HistoryEduIcon />;
        case 'TobaccoEntryObject':
            return <HistoryEduIcon />;
        case 'MetaObject':
            return <HistoryEduIcon />;
        case 'PlaceObject':
            return <PlaceIcon />;
        case 'AccHolderObject':
            return <StorefrontIcon />;
        case 'TobaccoMarkObject':
            return <NoteIcon />;
        case 'NoteObject':
            return <StickyNote2Icon />;
        default:
            return <HelpIcon />;
    }
    // AccountHolderObject:
};
export default NodeIcon