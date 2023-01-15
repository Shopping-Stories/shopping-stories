import { NodeListItemProps, LinkListItemProps, NodeListProps } from "@components/GraphView/GraphGui";
import { useState, memo  } from "react";
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
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
// import IconButton from "@mui/material/IconButton";
// import InfoIcon from '@mui/icons-material/Info';
import Tooltip from "@mui/material/Tooltip";
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';

const LinkListItem = ({ node, link, handleClickZoom, focusOn, focusOff, toggleInfo }: LinkListItemProps) => {
    const { id, linkType} = link
    const {nodeType, label} = node
    return (
            <ListItemButton
                onMouseEnter={()=>focusOn(link.id)}
                onMouseLeave={()=>focusOff("")}
            >
            <Tooltip title={"Toggle Info Panel"}>
            <ListItemIcon sx={{ pl: 2 }} onClick={()=>toggleInfo(node, link)}>
                <NodeIcon
                    t={`${nodeType ? nodeType : id}`}
                />
            </ListItemIcon>
            </Tooltip>
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

const getLinkKey = (u:string, v:string) => {
    let arr = [u, v].sort()
    return `${arr[0]}_${arr[1]}`
}

const NodeListItem = ({ node, handleClickZoom, focusOn, focusOff, toggleInfo }: NodeListItemProps) => {
    const {id, neighbors, nodeType, label} = node
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(!open);
    
    return (
        <>
            <ListItemButton
                onMouseEnter={()=>focusOn(node.id)}
                onMouseLeave={()=>focusOff("")}
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
                        .filter((entry) => !!entry[1])
                        .map(([key, v]) => (
                            <LinkListItem
                                key={key}
                                node={v}
                                link={v.linkDict[getLinkKey(v.id.toString(), id.toString())]}
                                handleClickZoom={handleClickZoom}
                                focusOn={focusOn}
                                focusOff={focusOff}
                                toggleInfo={toggleInfo}
                            />
                        ))}
                </List>
            </Collapse>
            <Divider/>
        </>
    );
};

const NodeList = ({ gData, handleClickZoom, focusOn, focusOff, toggleInfo}: NodeListProps): JSX.Element => {
    // console.log("nodelist render");
    return (
        <>
            <Toolbar>
                <SubdirectoryArrowRightIcon />
                <ListItemText primary="Nodes" secondary="Edges" />
            </Toolbar>
            <Divider />
        <List>
            {gData.nodes.filter(node => !!node).map(node =>
                    <NodeListItem
                        handleClickZoom={handleClickZoom}
                        key={node.id}
                        node={node}
                        focusOn={focusOn}
                        focusOff={focusOff}
                        toggleInfo={toggleInfo}
                    />
                )}
            </List>
        </>
    );
};

export default memo(NodeList);
