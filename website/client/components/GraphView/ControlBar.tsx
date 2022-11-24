import React, { useState, memo, useEffect } from "react";
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import NoteIcon from '@mui/icons-material/Note';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloseIcon from '@mui/icons-material/Close';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import OutlinedInput from '@mui/material/OutlinedInput';
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
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface ControlBarProps {
    // width: number;
    name?: string;
    info?: NodeInfo;
}
const ControlBar = ({ info, name }: ControlBarProps) => {
    const [open, setOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(!!info);
    const [tab, setTab] = useState(0)
    
    const handleClick = () => {
        setOpen(!open);
    };
    
    const handleTabSwitch = (_event: React.SyntheticEvent,value:number) => {
        setTab(value)
    }

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
                <Box>
                <DrawerHeader>
                    <IconButton onClick={openInfo}>
                        {theme.direction === 'rtl' ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                            // <CloseIcon />
                        )}
                    </IconButton>
                    <Tabs value={tab} onChange={handleTabSwitch}>
                        <Tab label="Selection Info" {...a11yProps(0)}/>
                        <Tab label="Search and Filter"{...a11yProps(1)}/>
                    </Tabs>
                </DrawerHeader>
                <Divider />
                
                <TabPanel index={0} value={tab}>
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
                </TabPanel >
                <TabPanel index={1} value={tab}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <FormControl component="fieldset" variant="outlined">
                            {/*<div>*/}
                            {/*<SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />*/}
                            <TextField
                                id="input-with-sx"
                                label="Search..."
                                sx={{ m: 1, width: '25ch' }}
                                variant="standard"
                            />
                            {/*</div>*/}
                        <Divider/>
                        {/*<Box>*/}
                        <div>
                        <FormLabel sx={{ml:1}}>Node Category Filters</FormLabel>
                            <FormGroup row>
                            <Checkbox
                                checkedIcon={<PersonIcon/>}
                                icon={<PersonOutlinedIcon/>}
                            />
                            <Checkbox
                                checkedIcon={<PlaceIcon/>}
                                icon={<PlaceOutlinedIcon/>}
                            />
                            <Checkbox
                                checkedIcon={<StorefrontIcon/>}
                                icon={<StorefrontOutlinedIcon/>}
                            />
                            <Checkbox
                                checkedIcon={<NoteIcon/>}
                                icon={<NoteOutlinedIcon/>}
                            />
                            <Checkbox
                                checkedIcon={<ShoppingBasketIcon/>}
                                icon={<ShoppingBasketOutlinedIcon/>}
                            />
                            <Checkbox
                                checkedIcon={<StickyNote2Icon/>}
                                icon={<StickyNote2OutlinedIcon/>}
                            />
                            <Checkbox
                                checkedIcon={<HistoryEduIcon/>}
                                icon={<HistoryEduOutlinedIcon/>}
                            />
                        </FormGroup>
                        </div>
                    </FormControl>
                </Box>
                <div>
                    <Typography sx={{ml:1}}>Date Range</Typography>
                    <Slider
                        sx={{ml:2, mr:2}}
                    />
                </div>
                    
                </TabPanel>
                <Divider />
                </Box>
            </Drawer>
        </Box>
    );
};
export default memo(ControlBar);
