import PersonIcon from "@mui/icons-material/Person";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import HelpIcon from "@mui/icons-material/Help";
import StorefrontIcon from "@mui/icons-material/Storefront";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
// import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
// import PlaceIcon from "@mui/icons-material/Place";
// import NoteIcon from "@mui/icons-material/Note";
// import StickyNote2Icon from "@mui/icons-material/StickyNote2";

// import { linkColors, LinkTypeKey } from "@components/GraphView/util";

interface NodeIconProps {
    t: string;
    // linkType?: LinkTypeKey
}

const NodeIcon = ({ t }: NodeIconProps) => {
    // let c = linkType ? linkColors[linkType] : "inherit"
    switch (t) {
        case "item":
            return <ShoppingBasketIcon  //color={c}
                    />;
        case "personAccount":
            return <PersonIcon //color={c}
                    />;
        case "person":
            return <PersonIcon //color={c}
                    />
        case "store":
            return <StorefrontIcon //color={c}
                    />;
        case "mention":
            return <RecordVoiceOverIcon //color={c}
                    />;
        default:
            return <HelpIcon //color={c}
                    />;
    }
};
export default NodeIcon