import Drawer from '@mui/material/Drawer';
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

interface GraphSideBar {

}

const GraphSideBar = (props: GraphSideBar): JSX.Element => {
    return (
        <Drawer
            sx={{
                // width: drawerWidth,
                flexShrink: 0,
                ['& .MuiDrawer-paper']: {
                    // width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar/>
            <Box sx={{overflow: 'auto'}}>
            
            </Box>
        </Drawer>
    );
};

export default GraphSideBar;
