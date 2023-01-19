import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import {
    // useState,
    memo,
    // useEffect
} from "react";

import {
    styled,
    // useTheme
} from '@mui/material/styles';

// import PersonIcon from '@mui/icons-material/Person';
// import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
// import StorefrontIcon from '@mui/icons-material/Storefront';
// import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
// import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
// import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
// import AppBar from '@mui/material/AppBar';
// import IconButton from '@mui/material/IconButton';
// import LegendToggleIcon from '@mui/icons-material/LegendToggle';
// import Collapse from '@mui/material/Collapse';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Checkbox from '@mui/material/Checkbox';
// import Slider from '@mui/material/Slider';

import { GraphInfoPanelProps } from "@components/GraphView/GraphGui";

// import Entry from "new_types/api_types"
// import { graphFilterSchema } from "../../formikSchemas";

// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import FormGroup from '@mui/material/FormGroup';
// import TextField from '@mui/material/TextField';
// import Button from "@mui/material/Button";
// import { Formik, Form, Field, useFormik } from "formik";
// import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
// import PlaceIcon from '@mui/icons-material/Place';
// import NoteIcon from '@mui/icons-material/Note';
// import StickyNote2Icon from '@mui/icons-material/StickyNote2';
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

const GraphInfoPanel = ({ name, info, entityType }: GraphInfoPanelProps) => {
    // const [infoOpen, setInfoOpen] = useState(!!info);
    //
    // const openInfo = () => {
    //     setInfoOpen(!infoOpen);
    // };
    //
    // useEffect(()=>{
    //     info ? setInfoOpen(true) : setInfoOpen(false)
    // }, [info])
    // const theme = useTheme();

    // console.log('control bar render');
    
    return (
        <>
            {/*<AppBar*/}
            {/*    // anchor="right"*/}
            {/*    color="transparent"*/}
            {/*    position="fixed"*/}
            {/*    elevation={0}*/}
            {/*    sx={{*/}
            {/*        // zIndex: (theme) => theme.zIndex.drawer+1,*/}
            {/*        // width: `calc(100% - ${240}px)`,*/}
            {/*        // ml: `${240}px`,*/}
            {/*        // width: `25%`,*/}
            {/*        width: `85%`,*/}
            {/*        ml: `15%`,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Toolbar />*/}
                <Toolbar>
                    {/*<Box sx={{ flexGrow: 1 }} />*/}
                    {/*<IconButton*/}
                    {/*    edge={'end'}*/}
                    {/*    // sx={{ mr: 1 }}*/}
                    {/*    onClick={openInfo}*/}
                    {/*    // sx={{ ...(infoOpen && { display: 'none' }) }}*/}
                    {/*>*/}
                    {/*    /!*<DescriptionIcon />*!/*/}
                    {/*    /!*<InfoIcon sx={{ mr: 1 }} />*!/*/}
                    {/*    <Typography>Context Panel</Typography>*/}
                    {/*    /!*<MenuOpenIcon />*!/*/}
                    {/*    <ChevronLeftIcon />*/}
                    {/*</IconButton>*/}
                </Toolbar>
            {/*</AppBar>*/}
            <Drawer
                sx={{
                    // ml: `${240}px`,
                    width: "100%",
                    flexShrink: 0,
                    ['& .MuiDrawer-paper']: {
                        width: "25%",
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="right"
                // open={infoOpen}
            >
                <Toolbar />
                <Box>
                    <DrawerHeader>
                        {/*<IconButton onClick={openInfo}>*/}
                        {/*    {theme.direction === 'rtl' ? (*/}
                        {/*        <ChevronLeftIcon />*/}
                        {/*    ) : (*/}
                        {/*        <ChevronRightIcon />*/}
                        {/*        // <CloseIcon />*/}
                        {/*    )}*/}
                        {/*</IconButton>*/}
                        <Typography>Selection Info</Typography>
                    </DrawerHeader>
                    <Divider />
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
                                        .filter(e => !!e[1])
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
                    <Divider />
                </Box>
            </Drawer>
        </>
    );
};
export default memo(GraphInfoPanel);

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
