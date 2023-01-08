import PersonIcon from "@mui/icons-material/Person";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import HelpIcon from "@mui/icons-material/Help";
import StorefrontIcon from "@mui/icons-material/Storefront";
// import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
// import PlaceIcon from "@mui/icons-material/Place";
// import NoteIcon from "@mui/icons-material/Note";
// import StickyNote2Icon from "@mui/icons-material/StickyNote2";

interface NodeIconProps {
    t: string;
}

const NodeIcon = ({ t }: NodeIconProps) => {
    switch (t) {
        case "Item":
            return <ShoppingBasketIcon />;
        case "PersonAccount":
            return <PersonIcon />;
        case "Person":
            return <PersonIcon />
        case "Store":
            return <StorefrontIcon />;
        case "Mention":
            return <HelpIcon />;
        default:
            return <HelpIcon />;
    }
};
export default NodeIcon