import React, { useState, memo, useRef } from "react";
// import { NodeListItemProps, LinkListItemProps, NodeListProps } from "@components/GraphView/GraphGui";
import { makeLinkID } from "@components/GraphView/GraphUtils";

import NodeIcon from '@components/GraphView/NodeIcon';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import { nodeHandler, itemHandler, focusHandler } from "@components/GraphView/GraphTypes";

// import { useTheme } from "@mui/material";
// import ListSubheader from "@mui/material/ListSubheader"
// import IconButton from "@mui/material/IconButton";
// import InfoIcon from '@mui/icons-material/Info';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';

interface NodeListProps {
    gData: GraphData
    handleClickZoom: nodeHandler
    toggleInfo: itemHandler
    focusOn: focusHandler
    focusOff: focusHandler
    scrolledItem: string | number
}
interface NodeListItemProps {
    node: NodeObject
    handleClickZoom: nodeHandler
    toggleInfo: itemHandler
    focusOn: focusHandler
    focusOff: focusHandler
    scrolledItem: string | number
    // focused: boolean
}
interface LinkListItemProps {
    link:LinkObject;
    node: NodeObject
    parent: NodeObject
    handleClickZoom: nodeHandler
    toggleInfo: itemHandler
    focusOn: focusHandler
    focusOff: focusHandler
    focused: boolean
}

const LinkListItem = ({ node, link, handleClickZoom, focusOn, focusOff, toggleInfo, parent, focused }: LinkListItemProps) => {
    const {
        id,
        // color,
        // linkType
    } = link
    const {nodeType, label} = node
    // const [hover, setHover] = useState(false)
    // const theme = useTheme()
    return (
            <ListItemButton
                onMouseEnter={()=>focusOn(new Set<string|number>([link.id, parent.id, node.id]))}
                onMouseLeave={()=>focusOff(new Set<string|number>())}
                autoFocus={focused}
            >
            <Tooltip title={"Toggle Info Panel"}>
            <ListItemIcon sx={{ pl: 2 }} onClick={()=>toggleInfo(node, link)}>
                <NodeIcon
                    t={`${nodeType ? nodeType : id}`}
                    // linkType={linkType}
                />
            </ListItemIcon>
            </Tooltip>
            {/*<Divider*/}
            {/*    orientation="vertical"*/}
            {/*    flexItem*/}
            {/*    sx={{mr:2, color: `${color}`}}*/}
            {/*/>*/}
            <Tooltip title={"Click text to zoom"}>
                <ListItemText
                    onClick={() => handleClickZoom(node)}
                    primary={label !== '' ? label : id}
                secondaryTypographyProps={{
                    noWrap: true,
                    style: {
                        // whiteSpace: 'normal',
                        // wordWrap: 'break-word',
                        // // overflow: 'auto'
                        // maxWidth: '100%',
                    },
                }}
            />
            </Tooltip>
            </ListItemButton>
    );
};

const NodeListItem = ({ node, handleClickZoom, focusOn, focusOff, toggleInfo, scrolledItem }: NodeListItemProps) => {
    const {id, neighbors, nodeType, label} = node
    const [open, setOpen] = useState(!!scrolledItem && (scrolledItem === id || node?.linkDict[scrolledItem]?.id === scrolledItem));
    const handleClickOpen = () => setOpen(!open);
    const nodeRef = useRef<HTMLDivElement | undefined>()
    return (
        <Box component={'div'} ref={nodeRef}>
            <ListItemButton
                // component={'div'}
                onMouseEnter={()=>focusOn(new Set<string|number>([node.id]))}
                onMouseLeave={()=>focusOff(new Set<string|number>())}
                autoFocus={!!scrolledItem && (scrolledItem === id || node?.linkDict[scrolledItem]?.id === scrolledItem)}
            >
            <Tooltip title={"Toggle Info Panel"}>
            <ListItemIcon onClick={()=>toggleInfo(node)}>
                {/*<Avatar sx={{ width: 36, height: 36 }}>*/}
                    <NodeIcon t={`${nodeType ? nodeType : ''}`} />
            </ListItemIcon>
            </Tooltip>
            <Tooltip title={"Click text to zoom"}>
                <ListItemText
                    onClick={()=>handleClickZoom(node)}
                    primary={label !== '' ? label : id}
                primaryTypographyProps={{
                    noWrap: true,
                    style: {
                        // whiteSpace: 'normal',
                        // wordWrap: 'break-word',
                        // overflow: 'auto',
                        // maxWidth: '100%',
                    },
                }}
            />
            </Tooltip>
                {neighbors &&
                    (open ? (
                        <ExpandLess onClick={handleClickOpen} />
                    ) : (
                        <ExpandMore onClick={handleClickOpen} />
                    ))}
            </ListItemButton>
            {/*</Tooltip>*/}
            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit
                orientation={'vertical'}
            >
                <List component="nav" disablePadding>
                    {neighbors && Object.entries(neighbors)
                        .filter(([key, v]) => (!!v && !!v.linkDict[makeLinkID(key, id.toString())[2]]))
                        .map(([key, v]) => (
                            <LinkListItem
                                key={key}
                                node={v}
                                parent={node}
                                link={v.linkDict[makeLinkID(v.id.toString(), id.toString())[2]]}
                                handleClickZoom={handleClickZoom}
                                focusOn={focusOn}
                                focusOff={focusOff}
                                toggleInfo={toggleInfo}
                                focused={scrolledItem === key}
                            />
                        ))}
                </List>
            </Collapse>
            <Divider/>
        </Box>
    );
};

const NodeList = ({ gData, handleClickZoom, focusOn, focusOff, toggleInfo, scrolledItem}: NodeListProps) => {
    // console.log("nodelist render");
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open
            sx={{
                // width: 240,
                flexShrink: 0,
                position: 'relative',
                [`& .MuiDrawer-paper`]: {
                    // width: 240,
                    width: `16.67%`,
                    // boxSizing: 'border-box',
                },
            }}
        >
            {/*<Divider />*/}
            <Toolbar>
                <SubdirectoryArrowRightIcon />
                <ListItemText primary="Nodes" secondary="Links" />
            </Toolbar>
            <List>
                {/*<ListSubheader>*/}
                {/*    <ListItemIcon><SubdirectoryArrowRightIcon /></ListItemIcon>*/}
                {/*    */}
                {/*    <ListItemText primary="Nodes" secondary="Edges" />*/}
                {/*</ListSubheader>*/}
                <Divider />
                {gData.nodes.filter(node => !!node).map(node =>
                        <NodeListItem
                            handleClickZoom={handleClickZoom}
                            key={node.id}
                            node={node}
                            focusOn={focusOn}
                            focusOff={focusOff}
                            toggleInfo={toggleInfo}
                            scrolledItem={scrolledItem}
                        />
                    )}
            </List>
        </Drawer>
    );
};

export default memo(NodeList);
