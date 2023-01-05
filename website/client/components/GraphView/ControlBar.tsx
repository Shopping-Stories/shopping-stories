import { useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ListItemText from '@mui/material/ListItemText';
import PlaceIcon from '@mui/icons-material/Place';
import NoteIcon from '@mui/icons-material/Note';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import Typography from '@mui/material/Typography';
import Collapse from "@mui/material/Collapse";
interface ControlBarProps {
    width: number;
}
const ControlBar = ({ width }: ControlBarProps) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    // const toggleDrawer = () => setDrawn(!drawn);
    return (
        <AppBar
            // anchor="right"
            color="transparent"
            position="fixed"
            elevation={0}
            sx={{
                // zIndex: (theme) => theme.zIndex.drawer,
                width: `calc(100% - ${width}px)`,
                ml: `${width}px`,
                // mr: `${width}px`
            }}
        >
            <Toolbar />
            <Toolbar>
                <IconButton onClick={() => handleClick()}>
                    <LegendToggleIcon />
                </IconButton>
                <Typography>Legend</Typography>
                {/*{open ? <ExpandLess /> : <ExpandMore />}*/}
            </Toolbar>
            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                orientation={'vertical'}
            >
                <List
                    sx={{
                        // zIndex: (theme) => theme.zIndex.drawer,
                        width: `calc(100% - ${width}px)`,
                        // mr: `${width}px`
                    }}
                >
                    <ListItem title="Add">
                        <PersonIcon></PersonIcon>
                        <ListItemText>Person</ListItemText>
                    </ListItem>
                    {/*<br />*/}
                    <ListItem title="Add">
                        <StorefrontIcon></StorefrontIcon>
                        <ListItemText>Account</ListItemText>
                    </ListItem>
                    <ListItem title="Add">
                        <ShoppingBasketIcon></ShoppingBasketIcon>
                        <ListItemText>Item</ListItemText>
                    </ListItem>
                    {/*<br />*/}
                    <ListItem>
                        <HistoryEduIcon></HistoryEduIcon>
                        <ListItemText>Entry</ListItemText>
                    </ListItem>
                    {/*<br />*/}
                    <ListItem title="Add">
                        <PlaceIcon></PlaceIcon>
                        <ListItemText>Location</ListItemText>
                    </ListItem>
                    {/*<br />*/}
                    <ListItem title="Add">
                        <NoteIcon></NoteIcon>
                        <ListItemText>Tobacco Mark</ListItemText>
                    </ListItem>
                    {/*<br />*/}
                    <ListItem title="Add">
                        <StickyNote2Icon></StickyNote2Icon>
                        <ListItemText>Entry Note</ListItemText>
                    </ListItem>
                    {/*<br />*/}
                </List>
            </Collapse>
        </AppBar>
    );
};
export default ControlBar;
