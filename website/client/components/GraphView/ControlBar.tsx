import { useState, memo, useEffect } from "react";
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PlaceIcon from '@mui/icons-material/Place';
import NoteIcon from '@mui/icons-material/Note';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { styled, useTheme } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import { NodeInfo } from '@components/GraphView/GraphTypes';
// import DescriptionIcon from '@mui/icons-material/Description';
// import InfoIcon from '@mui/icons-material/Info';
// import MenuOpenIcon from '@mui/icons-material/MenuOpen';
// import ListSubheader from "@mui/material";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

// import Fab from '@mui/material/Fab';

// interface AppBarProps extends MuiAppBarProps {
//     infoOpen?: boolean;
// }
// const AppBar = styled(MuiAppBar, {
//     shouldForwardProp: (prop) => prop !== 'open',
// })<AppBarProps>(({ theme, infoOpen }) => ({
//     // zIndex: theme.zIndex.drawer,
//     transition: theme.transitions.create(['width', 'margin'], {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//     }),
//     ...(infoOpen && {
//         marginLeft: 240,
//         marginRight: 480,
//         width: `calc(100% - ${240}px)`,
//         transition: theme.transitions.create(['width', 'margin'], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//         }),
//     }),
// }));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

interface ControlBarProps {
    // width: number;
    name?: string;
    info?: NodeInfo;
}
const ControlBar = ({ info, name }: ControlBarProps) => {
    const [open, setOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(!!info);
    
    const handleClick = () => {
        setOpen(!open);
    };

    const openInfo = () => {
        setInfoOpen(!infoOpen);
    };
    useEffect(()=>{
        info ? setInfoOpen(true) : setInfoOpen(false)
    }, [info])
    const theme = useTheme();

    console.log('control bar render');
    // const toggleDrawer = () => setDrawn(!drawn);
    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <AppBar
                // anchor="right"
                color="transparent"
                position="fixed"
                elevation={0}
                sx={{
                    // zIndex: (theme) => theme.zIndex.drawer+1,
                    width: `calc(100% - ${240}px)`,
                    ml: `${240}px`,
                }}
            >
                <Toolbar />
                <Toolbar>
                    <IconButton onClick={() => handleClick()}>
                        <LegendToggleIcon />
                    </IconButton>
                    <Typography>Legend</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                        edge={'end'}
                        // sx={{ mr: 1 }}
                        onClick={openInfo}
                        // sx={{ ...(infoOpen && { display: 'none' }) }}
                    >
                        {/*<DescriptionIcon />*/}
                        {/*<InfoIcon sx={{ mr: 1 }} />*/}
                        <Typography>Context Panel</Typography>
                        {/*<MenuOpenIcon />*/}
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Collapse
                    in={open}
                    timeout="auto"
                    unmountOnExit
                    orientation={'vertical'}
                    sx={{
                        width: `${240}px`,
                    }}
                >
                    <List
                        sx={{
                            // zIndex: (theme) => theme.zIndex.drawer,
                            // width: `calc(100% - ${240}px)`,
                            // mr: `${width}px`
                            width: `${240}px`,
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
            <Drawer
                sx={{
                    ml: `${240}px`,
                    width: 480,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 480,
                    },
                }}
                variant="persistent"
                anchor="right"
                open={infoOpen}
            >
                <Toolbar />
                <DrawerHeader>
                    <IconButton onClick={openInfo}>
                        {theme.direction === 'rtl' ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemText primary={name}/>
                    </ListItem>
                    
                    {info && name &&
                        Object.entries(info).map(([k , v]) => (
                            // info[k as keyof typeof info] !== null &&
                            // info[k as keyof typeof info].isArray ?
                            //     info[k as keyof typeof info].map(item => (
                            //         <ListItem key={k}>
                            //             <ListItemText primary={item.toString()} />
                            //         </ListItem>
                            //     )) :
                                <ListItem key={k}>
                                    <ListItemText
                                        secondary={`${k}: ${v ? v.toString(): "N/A"}`}
                                    />
                                </ListItem>
                        ))}
                </List>
                <Divider />
            </Drawer>
        </Box>
    );
};
export default memo(ControlBar);
