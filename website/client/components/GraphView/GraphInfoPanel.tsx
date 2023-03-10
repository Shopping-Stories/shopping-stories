import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
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

import { GraphInfoPanelProps } from "@components/GraphView/GraphGui";
import EntryInfoItem from "@components/GraphView/EntryInfoItem";
import { ListSubheader } from "@mui/material";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const GraphInfoPanel = ({ name, info, entityType }: GraphInfoPanelProps) => {
    // console.log(info)
    return (
        <>
            <Toolbar/>
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
                        {/*<Typography variant={""}>Selection Info</Typography>*/}
                        <ListItem>
                            <ListItemText
                                primary={`Name: ${name}`}
                                secondary={`Entity: ${entityType}`}
                                primaryTypographyProps={{variant: "h5", }}
                                secondaryTypographyProps={{variant: "h6", }}
                            />
                        </ListItem>
                    </DrawerHeader>
                    <Divider />
                    <ListSubheader>Associated Entries</ListSubheader>
                    <List>
                        {info &&
                            name &&
                            info.map((e,i) => (
                                <EntryInfoItem key={i} {...e}/>
                            ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>
        </>
    );
};
export default memo(GraphInfoPanel);
