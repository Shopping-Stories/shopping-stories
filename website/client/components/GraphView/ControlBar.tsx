import React, { useState, memo, useEffect, useCallback } from "react";
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Button from "@mui/material/Button";
import { Formik, Form, Field, useFormik } from "formik";

// import Entry from "new_types/api_types"
import {GraphPredicates, ControlBarProps } from "@components/GraphView/GraphGui";
// import { graphFilterSchema } from "../../formikSchemas";

// import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
// import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
// import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';
// import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
// import { NodeInfo } from '@components/GraphView/GraphTypes';
// import CloseIcon from '@mui/icons-material/Close';
// import Input from '@mui/material/Input';
// import InputLabel from '@mui/material/InputLabel';
// import InputAdornment from '@mui/material/InputAdornment';
// import SearchIcon from '@mui/icons-material/Search';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import DescriptionIcon from '@mui/icons-material/Description';
// import InfoIcon from '@mui/icons-material/Info';
// import MenuOpenIcon from '@mui/icons-material/MenuOpen';
// import ListSubheader from "@mui/material";
// import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
// import Fab from '@mui/material/Fab';

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

const ControlBar = ({ name, info, makePredicates, filter, entityType }: ControlBarProps) => {
    const [open, setOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(!!info);
    const [tab, setTab] = useState(0)

    // const filterForm = useFormik<GraphPredicates>({
    //     initialValues: initFilter,
    //     onSubmit: (values) => setFilters(values)
    // })

    // const [filter, setFilter] = useState<GraphPredicates>(initFilter)

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

    // console.log('control bar render');
    
    return (
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <AppBar
                // anchor="right"
                color="transparent"
                position="fixed"
                elevation={0}
                sx={{
                    // zIndex: (theme) => theme.zIndex.drawer+1,
                    // width: `calc(100% - ${240}px)`,
                    // ml: `${240}px`,
                    // width: `25%`,
                    width: `85%`,
                    ml: `15%`,
                }}
            >
                <Toolbar />
                <Toolbar>
                    <IconButton onClick={handleClick}>
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
                        {/*<ListItem>*/}
                        {/*    <HistoryEduIcon></HistoryEduIcon>*/}
                        {/*    <ListItemText>Entry</ListItemText>*/}
                        {/*</ListItem>*/}
                        {/*<br />*/}
                        {/*<ListItem title="Add">*/}
                        {/*    <PlaceIcon></PlaceIcon>*/}
                        {/*    <ListItemText>Location</ListItemText>*/}
                        {/*</ListItem>*/}
                        {/*<br />*/}
                        {/*<ListItem title="Add">*/}
                        {/*    <NoteIcon></NoteIcon>*/}
                        {/*    <ListItemText>Tobacco Mark</ListItemText>*/}
                        {/*</ListItem>*/}
                        {/*<br />*/}
                        {/*<ListItem title="Add">*/}
                        {/*    <StickyNote2Icon></StickyNote2Icon>*/}
                        {/*    <ListItemText>Entry Note</ListItemText>*/}
                        {/*</ListItem>*/}
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
                            <Tab label="Selection Info" {...a11yProps(0)} />
                            <Tab label="Search and Filter" {...a11yProps(1)} />
                        </Tabs>
                    </DrawerHeader>
                    <Divider />

                    <TabPanel index={0} value={tab}>
                        <List>
                            <ListItem>
                                <ListItemText primary={`Name: ${name}`} secondary={`Entity: ${entityType}`} />
                            </ListItem>

                            {info &&
                                name &&
                                info.map((e) => (
                                    <>
                                        <Divider />
                                        {Object.entries(e)
                                            .filter(([k, v]) => !!v)
                                            .map(([k, v]) => (
                                                <ListItem key={k}>
                                                    {
                                                        <ListItemText
                                                            secondary={`${k}: ${v}`}
                                                            // secondary={`${k}: ${v ? v.toString(): "N/A"}`}
                                                        />
                                                    }
                                                </ListItem>
                                            ))}
                                        <Divider />
                                    </>
                                ))}
                        </List>
                    </TabPanel>
                    <TabPanel index={1} value={tab}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Checkbox
                                // checked={!!filter && !filter.nodeTypes?.person}
                                icon={<PersonOutlinedIcon />}
                                checkedIcon={
                                    <PersonOutlinedIcon color={'error'} />
                                }
                                name={'person'}
                                onChange={(e) =>
                                    makePredicates(
                                        'node',
                                        'personAccount',
                                        !e.target.checked,
                                    )
                                }
                            />
                            <Checkbox
                                // checked={!!filter && !filter.nodeTypes?.store}
                                icon={<StorefrontOutlinedIcon />}
                                checkedIcon={
                                    <StorefrontOutlinedIcon color={'error'} />
                                }
                                name={'store'}
                                onChange={(e) =>
                                    makePredicates(
                                        'node',
                                        'store',
                                        !e.target.checked,
                                    )
                                }
                            />
                            <Checkbox
                                // checked={!!filter && !filter.nodeTypes?.item}
                                icon={<ShoppingBasketOutlinedIcon />}
                                checkedIcon={
                                    <ShoppingBasketOutlinedIcon
                                        color={'error'}
                                    />
                                }
                                name={'item'}
                                onChange={(e) =>
                                    makePredicates(
                                        'node',
                                        'item',
                                        !e.target.checked,
                                    )
                                }
                            />
                        </Box>
                        <div>
                            <Typography sx={{ ml: 1 }}>Date Range</Typography>
                            <Slider sx={{ ml: 2, mr: 2 }} />
                        </div>
                    </TabPanel>
                    <Divider />
                </Box>
            </Drawer>
        </Box>
    );
};
export default memo(ControlBar);

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
